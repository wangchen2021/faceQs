import React, { useState, useRef, type ChangeEvent } from 'react';
import SparkMD5 from 'spark-md5';
import { getAction, postAction } from '../../api/request';

// 核心配置类型定义
interface UploadConfig {
  chunkSize: number; // 上传分片大小
  fileMD5: string; // 文件整体MD5值
  totalChunks: number; // 总分片数
  uploadedChunks: number[]; // 已上传分片索引数组
  uploadChunkUrl: string; // 分片上传接口地址
  mergeFileUrl: string; // 文件合并接口地址
  queryUploadedUrl: string; // 查询已上传分片接口地址
}


const FileSliceUpload: React.FC = () => {
  // 上传状态管理
  const [file, setFile] = useState<File | null>(null); // 选中的文件
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 整体上传进度
  const [uploadStatus, setUploadStatus] = useState<string>(''); // 上传状态提示
  const [isUploading, setIsUploading] = useState<boolean>(false); // 是否正在上传

  // 核心配置（使用useRef保存，避免组件重渲染丢失状态）
  const configRef = useRef<UploadConfig>({
    chunkSize: 1 * 1024 * 1024, // 分片大小：1MB
    fileMD5: '',
    totalChunks: 0,
    uploadedChunks: [],
    // 替换为你的实际后端接口地址
    uploadChunkUrl: '/upload/chunk',
    mergeFileUrl: '/upload/merge',
    queryUploadedUrl: '/upload/query',
  });

  // 1. 文件选择事件处理
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadProgress(0);
    setUploadStatus(
      `已选中文件：${selectedFile.name}（大小：${(selectedFile.size / 1024 / 1024).toFixed(2)}MB）`
    );
  };

  // 2. 计算文件整体 MD5 值（大文件分段读取，避免内存溢出）
  const calculateFileMD5 = async (targetFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      const blobSlice = File.prototype.slice;

      // 读取文件的分片大小（用于计算MD5，非上传分片）
      const readChunkSize = 10 * 1024 * 1024; // 1MB
      const totalReadChunks = Math.ceil(targetFile.size / readChunkSize);
      let currentReadChunk = 0;

      // 读取下一个分片
      const loadNextChunk = () => {
        const start = currentReadChunk * readChunkSize;
        const end = Math.min(start + readChunkSize, targetFile.size);
        fileReader.readAsArrayBuffer(blobSlice.call(targetFile, start, end));
      };

      fileReader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('文件读取失败，无法计算MD5'));
          return;
        }

        spark.append(e.target.result as ArrayBuffer);
        currentReadChunk++;

        // 所有读取分片处理完成
        if (currentReadChunk >= totalReadChunks) {
          const fileMD5 = spark.end();
          configRef.current.fileMD5 = fileMD5;
          // 计算上传总分片数
          configRef.current.totalChunks = Math.ceil(targetFile.size / configRef.current.chunkSize);
          resolve(fileMD5);
        } else {
          loadNextChunk();
        }
      };

      fileReader.onerror = (err) => {
        reject(new Error(`MD5 计算失败：${err}`));
      };

      // 启动读取
      loadNextChunk();
    });
  };

  // 3. 计算单个分片的 MD5 值
  const calculateChunkMD5 = async (chunk: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const spark = new SparkMD5.ArrayBuffer();

      fileReader.readAsArrayBuffer(chunk);
      fileReader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('分片读取失败，无法计算MD5'));
          return;
        }
        spark.append(e.target.result as ArrayBuffer);
        resolve(spark.end());
      };

      fileReader.onerror = (err) => {
        reject(new Error(`分片 MD5 计算失败：${err}`));
      };
    });
  };

  // 4. 查询已上传的分片（断点续传核心）
  const queryUploadedChunks = async (fileMD5: string): Promise<number[]> => {
    const res = await getAction(configRef.current.queryUploadedUrl, { fileMD5 }) as any
    return res.data
  }


  // 5. 上传单个分片
  const uploadSingleChunk = async (chunkIndex: number): Promise<boolean> => {
    const config = configRef.current;
    if (!file) return false;

    // 计算分片的起始和结束位置
    const start = chunkIndex * config.chunkSize;
    const end = Math.min(start + config.chunkSize, file.size);
    // 分割文件获取当前分片
    const chunk = file.slice(start, end);
    // 计算分片MD5
    const chunkMD5 = await calculateChunkMD5(chunk);

    // 构造FormData
    const formData = new FormData();
    formData.append('fileMD5', config.fileMD5);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', config.totalChunks.toString());
    formData.append('chunkMD5', chunkMD5);
    formData.append('chunk', chunk);


    return postAction(config.uploadChunkUrl, formData)
      .then(() => {
        // 更新上传进度
        const completedChunks = config.uploadedChunks.length + 1;
        setUploadProgress(Math.ceil((completedChunks / config.totalChunks) * 100));
        return true;
      })
      .catch((err) => {
        console.error(`分片 ${chunkIndex} 上传异常：`, (err as Error).message);
        return false;
      })
  }

  // 6. 批量上传所有分片
  const uploadAllChunks = async () => {
    if (!file) {
      setUploadStatus('请先选择文件！');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('正在计算文件MD5值...');

      // 步骤1：计算文件整体MD5
      const fileMD5 = await calculateFileMD5(file);
      setUploadStatus('MD5计算完成，正在查询已上传分片...');

      // 步骤2：查询已上传分片
      const uploadedChunks = await queryUploadedChunks(fileMD5);
      configRef.current.uploadedChunks = uploadedChunks;
      setUploadStatus(`已上传 ${uploadedChunks.length} 个分片，开始上传剩余分片...`);

      // 步骤3：遍历所有分片，上传未完成的分片
      const config = configRef.current;
      for (let i = 0; i < config.totalChunks; i++) {
        if (uploadedChunks.includes(i)) {
          console.log(`分片 ${i} 已上传，跳过`);
          continue;
        }

        // 上传单个分片，失败则重试（此处简单重试1次，可根据业务调整重试次数）
        let isSuccess = await uploadSingleChunk(i);
        if (!isSuccess) {
          setUploadStatus(`分片 ${i} 上传失败，正在重试...`);
          isSuccess = await uploadSingleChunk(i);
          if (!isSuccess) {
            throw new Error(`分片 ${i} 上传失败，整体上传终止`);
          }
        }
        config.uploadedChunks.push(i);
      }

      // 步骤4：所有分片上传完成，请求合并文件
      setUploadStatus('所有分片上传完成，正在合并文件...');
      await mergeFile();
      setUploadStatus(`文件上传成功！文件名：${file.name}，MD5：${fileMD5}`);
      setUploadProgress(100);
    } catch (err) {
      setUploadStatus(`上传失败：${(err as Error).message}`);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // 7. 请求服务端合并文件
  const mergeFile = async () => {
    const config = configRef.current;
    if (!file) throw new Error('文件不存在，无法合并');

    const mergeData = {
      fileMD5: config.fileMD5,
      totalChunks: config.totalChunks,
      fileName: file.name,
      fileSize: file.size,
    };

    postAction(config.mergeFileUrl, mergeData)
      .then((res: any) => {
        console.log(res);
        if (res.code !== 200) {
          console.error(`文件合并失败：${res.msg}`);
        }
      })
      .catch((err) => {
        throw new Error(`文件合并失败：${err.msg}`);
      })
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h3>React TS 分片上传 + MD5 校验</h3>
      {/* 文件选择框 */}
      <input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        style={{ marginBottom: 16 }}
      />
      {/* 上传按钮 */}
      <button
        onClick={uploadAllChunks}
        disabled={isUploading || !file}
        style={{
          padding: '8px 16px',
          backgroundColor: isUploading || !file ? '#ccc' : '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: isUploading || !file ? 'not-allowed' : 'pointer',
          marginBottom: 16,
        }}
      >
        {isUploading ? '上传中...' : '开始上传'}
      </button>
      {/* 上传进度条 */}
      <div
        style={{
          height: 8,
          backgroundColor: '#f5f5f5',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#1890ff',
            width: `${uploadProgress}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {/* 上传状态提示 */}
      <div style={{ color: uploadStatus.includes('失败') ? '#f5222d' : '#333' }}>
        {uploadStatus || '请选择文件后点击上传按钮'}
      </div>
    </div>
  );
};

export default FileSliceUpload;