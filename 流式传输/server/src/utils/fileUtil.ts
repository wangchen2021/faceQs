import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { TEMP_CHUNK_DIR } from "../config/fileUpload";

/**
 * 计算文件（文件路径/文件流）的 MD5 值
 * @param fileSource 文件路径 或 Node.js ReadStream
 * @returns 文件 MD5 字符串
 */
export const calculateFileMD5 = async (fileSource: string | fs.ReadStream): Promise<string> => {
    return new Promise((resolve, reject) => {
        const md5Hash = crypto.createHash('md5');
        let stream: fs.ReadStream;

        // 处理文件路径/文件流
        if (typeof fileSource === 'string') {
            if (!fs.existsSync(fileSource)) {
                reject(new Error(`文件不存在：${fileSource}`));
                return;
            }
            stream = fs.createReadStream(fileSource);
        } else {
            stream = fileSource;
        }

        // 读取文件数据并更新 MD5
        stream.on('data', (chunk) => {
            md5Hash.update(chunk);
        });

        // 读取完成，返回 MD5 值
        stream.on('end', () => {
            const md5 = md5Hash.digest('hex');
            resolve(md5);
        });

        // 读取失败
        stream.on('error', (err) => {
            reject(new Error(`计算 MD5 失败：${err.message}`));
        });
    });
};

/**
 * 查询指定文件已上传的分片索引
 * @param fileMD5 文件唯一标识（整体 MD5）
 * @returns 已上传分片索引数组
 */
export const queryUploadedChunks = async (fileMD5: string): Promise<number[]> => {
    const chunkDir = path.join(TEMP_CHUNK_DIR, fileMD5);
    // 分片目录不存在，说明未上传任何分片
    if (!fs.existsSync(chunkDir)) {
        return [];
    }

    // 读取目录下所有分片文件（文件名即为分片索引）
    const chunkFiles = await fs.readdir(chunkDir);
    // 转换为数字类型并排序
    const chunkIndexes = chunkFiles
        .map((fileName) => parseInt(fileName, 10))
        .filter((index) => !isNaN(index))
        .sort((a, b) => a - b);

    return chunkIndexes;
};