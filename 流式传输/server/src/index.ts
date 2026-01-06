import express, { Request, Response } from 'express';
import path from 'path';
import http from 'http';
import { initWebRTC } from './socketIO';
import { openAIdRouter, uploadRouter } from './routers';

// 创建 Express 实例
const app = express();
const port = 3001;


const server = http.createServer(app);
// 跨域配置（测试环境放开所有跨域，生产环境指定域名）

// 1. 跨域配置
app.use((req: Request, res: Response, next: Function) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 2. 托管前端静态文件（public 目录）
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'upload')));

app.use(express.json());

initWebRTC(app, server)

app.get("/", (req: Request, res: Response) => {
  res.send("success")
})

app.use("/upload", uploadRouter)

app.use("/openAI",openAIdRouter)

// 启动服务
server.listen(port, () => {
  console.log(`服务运行在 http://localhost:${port}`);
});