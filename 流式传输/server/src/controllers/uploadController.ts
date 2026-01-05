import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { TEMP_CHUNK_DIR, FORMAL_FILE_DIR } from "../config/fileUpload";
import { calculateFileMD5, queryUploadedChunks } from '../utils/fileUtil';

// 接口返回格式统一封装
interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

const sendResponse = <T>(res: Response, code: number, msg: string, data: T = {} as T) => {
    const response: ApiResponse<T> = { code, msg, data };
    res.json(response);
};

/**
 * 分片上传接口
 */
export const uploadChunk = async (req: Request, res: Response) => {
    try {
        // 1. 获取前端传递的参数（multer 解析后的文件及表单数据）
        const chunkFile = req.file;
        const fileMD5 = req.body.fileMD5 as string;
        const chunkIndex = parseInt(req.body.chunkIndex as string, 10);
        const chunkMD5 = req.body.chunkMD5 as string;

        // 校验参数
        if (!chunkFile || !fileMD5 || isNaN(chunkIndex) || !chunkMD5) {
            return sendResponse(res, 400, '参数缺失或无效', []);
        }

        // 2. 校验分片 MD5（确保分片传输完整）
        const receivedChunkMD5 = await calculateFileMD5(chunkFile.path);
        if (receivedChunkMD5 !== chunkMD5) {
            // 删除损坏的分片文件
            await fs.unlink(chunkFile.path);
            return sendResponse(res, 400, '分片损坏，MD5 校验失败', []);
        }

        // 3. 保存分片到临时目录（目录结构：temp/{fileMD5}/{chunkIndex}）
        const chunkDir = path.join(TEMP_CHUNK_DIR, fileMD5);
        await fs.mkdirp(chunkDir); // 确保目录存在
        const chunkSavePath = path.join(chunkDir, chunkIndex.toString());

        // 移动分片文件（multer 默认上传到临时目录，移动到指定路径）
        await fs.move(chunkFile.path, chunkSavePath, { overwrite: true });

        sendResponse(res, 200, '分片上传成功', []);
    } catch (err) {
        const error = err as Error;
        sendResponse(res, 500, `分片上传失败：${error.message}`, []);
    }
};

/**
 * 文件合并接口
 */
export const mergeFile = async (req: Request, res: Response) => {
    try {
        // 1. 获取前端传递的参数
        const { fileMD5, totalChunks, fileName, fileSize } = req.body;
        
        if (!fileMD5 || isNaN(totalChunks) || !fileName) {
            return sendResponse(res, 400, '参数缺失或无效', []);
        }

        const chunkDir = path.join(TEMP_CHUNK_DIR, fileMD5);
        // 2. 校验分片是否完整
        const uploadedChunks = await queryUploadedChunks(fileMD5);
        if (uploadedChunks.length !== totalChunks) {
            return sendResponse(res, 400, `分片不完整（已上传${uploadedChunks.length}/${totalChunks}）`, []);
        }

        // 3. 定义最终文件路径（添加 fileMD5 避免文件名重复）
        const extName = path.extname(fileName);
        const baseName = path.basename(fileName, extName);
        const formalFileName = `${baseName}_${fileMD5}${extName}`;
        const formalFilePath = path.join(FORMAL_FILE_DIR, formalFileName);

        // 4. 按分片索引顺序合并文件
        const writeStream = fs.createWriteStream(formalFilePath);
        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(chunkDir, i.toString());
            const readStream = fs.createReadStream(chunkPath);

            // 同步写入（确保分片顺序）
            await new Promise((resolve, reject) => {
                readStream.pipe(writeStream, { end: false });
                readStream.on('end', resolve as () => void);
                readStream.on('error', reject);
            });

            // 关闭当前分片读取流
            readStream.close();
        }

        // 关闭写入流
        writeStream.close();

        // 5. 校验合并后文件的 MD5（确保完整）
        const mergedFileMD5 = await calculateFileMD5(formalFilePath);
        if (mergedFileMD5 !== fileMD5) {
            // 合并后的文件损坏，删除文件
            await fs.unlink(formalFilePath);
            return sendResponse(res, 500, '文件合并后损坏，MD5 校验失败', []);
        }

        // 6. 删除临时分片目录（释放存储空间）
        await fs.remove(chunkDir);

        // 返回文件访问路径（可根据实际业务调整，如静态资源访问路径）
        const fileUrl = `/uploads/formal/${formalFileName}`;
        sendResponse(res, 200, '文件合并成功', { fileUrl, fileName: formalFileName, fileMD5 });
    } catch (err) {
        const error = err as Error;
        sendResponse(res, 500, `文件合并失败：${error.message}`, []);
    }
};

/**
 * 查询已上传分片接口
 */
export const getUploadedChunks = async (req: Request, res: Response) => {
    try {
        const fileMD5 = req.query.fileMD5 as string;
        if (!fileMD5) {
            return sendResponse(res, 400, '文件 MD5 不能为空', []);
        }

        const uploadedChunks = await queryUploadedChunks(fileMD5);
        sendResponse(res, 200, '查询成功', uploadedChunks);
    } catch (err) {
        const error = err as Error;
        sendResponse(res, 500, `查询失败：${error.message}`, []);
    }
};