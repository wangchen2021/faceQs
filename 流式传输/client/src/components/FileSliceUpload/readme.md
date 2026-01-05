这里提供完整的大文件 HTTP 分片上传/分块下载 + 断点续传案例，采用前端（原生 JS + Axios）+ 后端（Node.js/Express）技术栈，包含核心逻辑、完整代码与关键细节，可直接复用。

---

## 核心原理
| 功能 | 核心机制 | 关键技术 |
|------|----------|----------|
| 分片上传 | 前端切分文件为固定大小块，并发上传；后端接收后校验合并 | File.slice()、FormData、MD5 唯一标识、临时分片存储 |
| 断点续传 | 前后端记录已完成分片，中断后跳过已传块 | 文件 MD5 校验、分片索引记录、localStorage/Redis 存储进度 |
| 分块下载 | 前端用 Range 请求头指定字节范围，后端返回 206 部分内容 | HTTP Range 协议、206 Partial Content、流式文件读取 |

---

## 一、分片上传 + 断点续传（完整案例）
### 1. 前端实现（原生 JS + Axios）
核心逻辑：计算文件 MD5 → 校验已传分片 → 并发上传未传分片 → 触发合并。
```javascript
import axios from 'axios';
import SparkMD5 from 'spark-md5'; // 需安装：npm i spark-md5

const CHUNK_SIZE = 5*1024*1024; // 5MB 分片
const API_BASE = 'http://localhost:3000/api';

// 计算文件 MD5（唯一标识）
const calculateFileMD5 = (file) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      spark.append(e.target.result);
      resolve(spark.end());
    };
    fileReader.readAsArrayBuffer(file);
  });
};

// 分片上传主函数
export const uploadLargeFile = async (file) => {
  const fileMD5 = await calculateFileMD5(file);
  const chunks = [];
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  // 1. 切分文件
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    chunks.push({
      index: i,
      chunk: file.slice(start, end),
      hash: `${fileMD5}-${i}`
    });
  }

  // 2. 校验已上传分片
  const { data: uploadedChunks } = await axios.get(`${API_BASE}/upload/check`, {
    params: { fileMD5, filename: file.name }
  });

  // 3. 并发上传未传分片
  const uploadPromises = chunks
    .filter(chunk => !uploadedChunks.includes(chunk.index))
    .map(chunk => {
      const formData = new FormData();
      formData.append('chunk', chunk.chunk);
      formData.append('index', chunk.index);
      formData.append('fileMD5', fileMD5);
      formData.append('filename', file.name);
      return axios.post(`${API_BASE}/upload/chunk`, formData, {
        onUploadProgress: (e) => {
          console.log(`分片 ${chunk.index} 进度：${Math.round(e.progress * 100)}%`);
        }
      });
    });
  await Promise.all(uploadPromises);

  // 4. 触发文件合并
  await axios.post(`${API_BASE}/upload/merge`, {
    fileMD5,
    filename: file.name,
    totalChunks
  });
  console.log('文件上传完成');
};
```

### 2. 后端实现（Node.js/Express）
核心逻辑：接收分片 → 临时存储 → 校验完整性 → 合并分片 → 清理临时文件。
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer'); // 需安装：npm i express multer fs-extra

const UPLOAD_DIR = path.resolve(__dirname, '../uploads');
const TEMP_DIR = path.resolve(UPLOAD_DIR, 'temp');
fs.ensureDirSync(TEMP_DIR);
fs.ensureDirSync(UPLOAD_DIR);

// 配置 multer 存储分片
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fileMD5 } = req.body;
    const chunkDir = path.join(TEMP_DIR, fileMD5);
    fs.ensureDirSync(chunkDir);
    cb(null, chunkDir);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.index); // 用分片索引命名
  }
});
const upload = multer({ storage });

// 1. 校验已上传分片
router.get('/upload/check', async (req, res) => {
  const { fileMD5 } = req.query;
  const chunkDir = path.join(TEMP_DIR, fileMD5);
  const uploadedChunks = [];
  if (fs.existsSync(chunkDir)) {
    const files = await fs.readdir(chunkDir);
    uploadedChunks.push(...files.map(Number));
  }
  res.json({ uploadedChunks });
});

// 2. 接收分片
router.post('/upload/chunk', upload.single('chunk'), (req, res) => {
  res.json({ code: 0, msg: '分片上传成功' });
});

// 3. 合并分片
router.post('/upload/merge', async (req, res) => {
  const { fileMD5, filename, totalChunks } = req.body;
  const chunkDir = path.join(TEMP_DIR, fileMD5);
  const targetPath = path.join(UPLOAD_DIR, filename);

  // 按索引排序合并
  const writeStream = fs.createWriteStream(targetPath);
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, i.toString());
    const chunkBuffer = await fs.readFile(chunkPath);
    writeStream.write(chunkBuffer);
    await fs.unlink(chunkPath); // 删除临时分片
  }
  writeStream.end();
  await fs.rmdir(chunkDir); // 删除分片目录
  res.json({ code: 0, msg: '文件合并完成', url: `/uploads/${filename}` });
});

module.exports = router;
```

---

## 二、分块下载 + 断点续传（完整案例）
### 1. 前端实现（原生 JS）
核心逻辑：记录已下载字节 → 用 Range 请求头续传 → 追加写入文件。
```javascript
const downloadLargeFile = async (fileUrl, savePath, chunkSize = 5*1024*1024) => {
  const fileSize = await getFileTotalSize(fileUrl);
  let downloadedSize = 0;
  // 检查本地已下载大小
  if (fs.existsSync(savePath)) { // 浏览器用 FileSystem API，Node.js 用 fs
    downloadedSize = fs.statSync(savePath).size;
  }

  while (downloadedSize < fileSize) {
    const end = Math.min(downloadedSize + chunkSize - 1, fileSize - 1);
    const headers = { Range: `bytes=${downloadedSize}-${end}` };
    const response = await axios.get(fileUrl, {
      headers,
      responseType: 'arraybuffer',
      onDownloadProgress: (e) => {
        const progress = (downloadedSize + e.loaded) / fileSize * 100;
        console.log(`下载进度：${progress.toFixed(2)}%`);
      }
    });

    // 追加写入文件
    await fs.writeFile(savePath, Buffer.from(response.data), { flag: 'a' });
    downloadedSize = end + 1;
  }
  console.log('文件下载完成');
};

// 获取文件总大小
const getFileTotalSize = async (url) => {
  const { headers } = await axios.head(url);
  return parseInt(headers['content-length']);
};
```

### 2. 后端实现（Node.js/Express）
核心逻辑：解析 Range 请求头 → 读取对应字节范围 → 返回 206 响应。
```javascript
router.get('/download', async (req, res) => {
  const { filename } = req.query;
  const filePath = path.join(UPLOAD_DIR, filename);
  const fileStat = await fs.stat(filePath);
  const fileSize = fileStat.size;

  // 解析 Range 请求头
  const range = req.headers.range;
  if (range) {
    const [start, end] = range.replace('bytes=', '').split('-').map(Number);
    const startPos = isNaN(start) ? 0 : start;
    const endPos = isNaN(end) ? fileSize - 1 : end;
    const chunkSize = endPos - startPos + 1;

    // 设置响应头
    res.status(206);
    res.setHeader('Content-Range', `bytes ${startPos}-${endPos}/${fileSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', chunkSize);

    // 流式读取文件片段
    const readStream = fs.createReadStream(filePath, { start: startPos, end: endPos });
    readStream.pipe(res);
  } else {
    // 不支持 Range 时返回完整文件
    res.setHeader('Content-Length', fileSize);
    fs.createReadStream(filePath).pipe(res);
  }
});
```

---

## 三、关键优化与避坑
1.  **分片大小选择**：默认 5MB，弱网环境可降至 1–2MB，高速网络可增至 10–20MB，平衡请求数与重试成本。
2.  **并发控制**：前端用 Promise.allSettled 或限制并发数（如 3–5 个），避免请求过多导致超时。
3.  **完整性校验**：每个分片携带 MD5，后端合并前校验，防止数据损坏。
4.  **断点持久化**：前端用 localStorage 存文件 MD5 与已传分片；后端用 Redis 存进度，支持跨会话续传。
5.  **清理机制**：后端定时清理过期未合并的临时分片，避免磁盘占用。
6.  **跨域处理**：后端配置 CORS，允许 Range、Content-Range 等请求头。

---

## 四、快速部署与测试
1.  安装依赖：`npm i express multer fs-extra spark-md5 axios`
2.  启动后端：配置 Express 并挂载路由，监听 3000 端口。
3.  前端调用：通过 `uploadLargeFile` 上传、`downloadLargeFile` 下载，测试断点续传（中断网络后恢复）。

---