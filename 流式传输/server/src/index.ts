import express, { Request, Response } from 'express';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import { WebRTCTypes } from '@my/shared';

// 创建 Express 实例
const app = express();
const port = 3001;

interface UsersData {
  id: string,
  userId: string,
  name: string
}

let users: Record<string, UsersData> = {}
let usersIdSocketIdMap = new Map()

const server = http.createServer(app);
// 跨域配置（测试环境放开所有跨域，生产环境指定域名）
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 监听客户端连接
io.on('connection', (socket) => {
  console.log('客户端已连接：', socket.id);
  const userId = socket.handshake.query.userId as string
  users[userId] = {
    id: socket.id,
    userId,
    name: "名称是：" + socket.id,
  }
  usersIdSocketIdMap.set(socket.id, userId)

  // 转发 SDP 信息（连接描述：offer/answer）
  socket.on('webRtcSdp', (data: WebRTCTypes.SdpData) => {
    const { connectId } = data
    const targetUser = users[connectId]
    if (targetUser) {
      socket.to(targetUser.id).emit('webRtcSdp', data);
    }
  });

  // 转发 ICE 候选地址（网络地址信息）
  socket.on('webRtcIce', (iceData) => {
    socket.broadcast.emit('webRtcIce', iceData);
  });

  // 监听客户端断开连接
  socket.on('disconnect', () => {
    console.log('客户端已断开：', socket.id);
    const userId = usersIdSocketIdMap.get(socket.id)
    delete users[userId]
    usersIdSocketIdMap.delete(socket.id)
  });
});

// 1. 跨域配置
app.use((req: Request, res: Response, next: Function) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 2. 托管前端静态文件（public 目录）
app.use(express.static(path.join(__dirname, 'public')));

app.get("/socket/user", (req: Request, res: Response) => {
  const { userId } = req.query
  const resArr = []
  for (let key in users) {
    if (key !== userId) {
      resArr.push(users[key])
    }
  }
  res.json({
    users: resArr,
    date: performance.now()
  })
})

// 3. 顺序流式返回长文本接口（TS 类型明确）
app.get('/stream/text', (req: Request, res: Response) => {
  // 模拟长文本段落（按顺序分块）
  const longTextParagraphs: string[] = [
    "第一章 流式传输概述\n",
    "顺序流式传输（渐进式）是一种经典的传输模式，数据按固定顺序分块发送，客户端边接收边处理。\n",
    "这种传输方式无需等待完整数据加载，适合文本、音频、视频等线性内容的传输。\n",
    "第二章 核心特性\n",
    "1.  顺序性：数据必须按发送顺序接收，无法跳转到未加载的部分；\n",
    "2.  即时性：拿到部分数据即可渲染/播放，降低用户等待时间；\n",
    "3.  无随机访问：不支持拖拽跳播，只能按顺序加载后续内容。\n",
    "第三章 适用场景\n",
    "常见于短视频点播、在线音乐播放、长文本阅读等场景，兼容性强，实现简单。\n"
  ];

  // 启用 HTTP 分块传输（关键配置）
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  // 按顺序定时发送文本块
  let index = 0;
  const sendInterval = setInterval(() => {
    if (index < longTextParagraphs.length) {
      const chunk = longTextParagraphs[index];
      res.write(chunk); // 发送单个文本块（顺序不可打乱）
      console.log(`已发送第 ${index + 1} 个文本块：${chunk.trim()}`);
      index++;
    } else {
      // 所有块发送完毕，结束流
      clearInterval(sendInterval);
      res.end();
      console.log('文本块全部发送完成');
    }
  }, 1000); // 每 1 秒发送一个块，模拟网络延迟

  // 客户端断开连接时，清理定时器
  req.on('close', () => {
    clearInterval(sendInterval);
    res.end();
    console.log('客户端断开连接，文本流已终止');
  });
});

// 启动服务
server.listen(port, () => {
  console.log(`后端 TS 服务运行在 http://localhost:${port}`);
});