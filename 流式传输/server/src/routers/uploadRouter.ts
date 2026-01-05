import { Router } from 'express';
import multer from 'multer';
import { uploadChunk, mergeFile, getUploadedChunks } from '../controllers/uploadController';

export const uploadRouter = Router();
// 临时存储 multer 解析的文件（自动清理，不影响业务）
const upload = multer({ dest: 'node_modules/.tmp/' });

// 1. 分片上传接口（upload.single('chunk') 解析名为 chunk 的文件）
uploadRouter.post('/chunk', upload.single('chunk'), uploadChunk);

// 2. 文件合并接口
uploadRouter.post('/merge', mergeFile);

// 3. 查询已上传分片接口
uploadRouter.get('/query', getUploadedChunks);