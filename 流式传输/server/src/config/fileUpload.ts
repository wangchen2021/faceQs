import path from 'path';
import fs from 'fs-extra';

// 根目录
const rootDir = process.cwd();
// 上传基础目录
export const UPLOAD_BASE_DIR = path.join(rootDir, 'upload');
// 临时分片目录
export const TEMP_CHUNK_DIR = path.join(UPLOAD_BASE_DIR, 'temp');
// 最终文件目录
export const FORMAL_FILE_DIR = path.join(UPLOAD_BASE_DIR, 'formal');

// 确保目录存在（不存在则自动创建）
const ensureUploadDirs = () => {
    [UPLOAD_BASE_DIR, TEMP_CHUNK_DIR, FORMAL_FILE_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirpSync(dir);
        }
    });
};
// 初始化目录
ensureUploadDirs();

// 其他配置
export const UPLOAD_CONFIG = {
    chunkSize: 1 * 1024 * 1024, // 对应前端分片大小：2MB
    maxFileSize: 10 * 1024 * 1024 * 1024, // 最大文件大小：10GB
};