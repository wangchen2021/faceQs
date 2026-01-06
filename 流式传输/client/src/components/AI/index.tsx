import React, { useState, useRef, type FormEvent } from 'react';
// 导入 CSS Modules 样式
import styles from './styles.module.css';
import { postAction } from '../../api/request';

// 对话消息类型定义
interface ChatMessage {
    role: 'user' | 'assistant'; // 角色：用户/AI助手
    content: string; // 消息内容
    timestamp: number; // 时间戳（用于唯一标识 + 排序）
}

const AI: React.FC = () => {
    // 1. 状态管理
    const [messages, setMessages] = useState<ChatMessage[]>([]); // 对话记录
    const [inputValue, setInputValue] = useState<string>(''); // 输入框内容
    const [isLoading, setIsLoading] = useState<boolean>(false); // 加载状态
    const [isStreaming, setIsStreaming] = useState<boolean>(true); // 是否开启流式回答
    const messageListRef = useRef<HTMLDivElement>(null); // 对话列表Ref（自动滚动到底部）
    const streamChunkCacheRef = useRef<string>(''); // 缓存已接收的完整响应字符串
    const assistantMsgTimestampRef = useRef<number>(0); // 缓存 AI 消息唯一标识


    // 2. 自动滚动到底部（聚焦最新消息）
    const scrollToBottom = () => {
        messageListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // 3. 非流式调用 AI 接口（完整返回答案）
    const fetchNonStreamAnswer = async (userContent: string) => {
        try {
            postAction("/openAI/unstream", { text: userContent })
                .then((res: any) => {
                    // 添加 AI 回答到对话列表
                    setMessages(prev => [
                        ...prev,
                        {
                            role: 'assistant',
                            content: res.message.content,
                            timestamp: Date.now(),
                        },
                    ]);
                })
                .catch((err) => {
                    throw new Error(err.msg || '非流式调用失败');
                })
        } catch (err) {
            const error = err as Error;
            // 添加错误提示到对话列表
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: `❌ ${error.message}`,
                    timestamp: Date.now(),
                },
            ]);
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };

    const fetchStreamAnswer = async (userContent: string) => {
        // 1. 初始化：添加 AI 占位消息、清空片段缓存
        const assistantMsgTimestamp = Date.now();
        assistantMsgTimestampRef.current = assistantMsgTimestamp;
        streamChunkCacheRef.current = ''; // 清空上次流式请求的缓存
        setMessages(prev => [
            ...prev,
            {
                role: 'assistant',
                content: '',
                timestamp: assistantMsgTimestamp,
            },
        ]);
        scrollToBottom(); // 滚动到占位消息

        try {
            // 2. 使用 axiosInstance 原始实例发送请求（不使用 postAction）
            await postAction(
                "/openAI/stream", // 复用你的 baseURL，只需相对路径
                { text: userContent }, // 保持你的参数格式不变
                {
                    responseType: 'text', // 关键：设置为 text，避免 Axios 自动解析 JSON
                    timeout: 0, // 关键：禁用超时（流式响应耗时不确定）
                    // 关键：监听下载进度，获取分块响应
                    onDownloadProgress: (progressEvent: any) => {
                        // 3. 获取完整的响应文本（从 progressEvent 中提取）
                        const fullResponseText = progressEvent.event.target.response as string;
                        if (!fullResponseText) return;

                        // 4. 计算新增的响应片段（过滤已处理过的内容）
                        const newChunk = fullResponseText.substring(streamChunkCacheRef.current.length);
                        if (!newChunk) return; // 无新增内容，直接返回

                        // 5. 更新缓存：保存已处理的完整响应文本
                        streamChunkCacheRef.current = fullResponseText;

                        // 6. 解析新增片段（与你原有逻辑一致，无需大幅修改）
                        const lines = newChunk.split('\n\n').filter(line => line.trim() !== '');
                        for (const line of lines) {
                            if (line === 'data: [DONE]') continue; // 忽略结束标志
                            if (line.startsWith('data: ')) {
                                try {
                                    const jsonStr = line.replace('data: ', '');
                                    const data = JSON.parse(jsonStr);
                                    // 追加 AI 回答内容
                                    if (data.content) {
                                        setMessages(prev =>
                                            prev.map(msg =>
                                                msg.timestamp === assistantMsgTimestampRef.current
                                                    ? { ...msg, content: msg.content + data.content }
                                                    : msg
                                            )
                                        );
                                        scrollToBottom(); // 每次更新后滚动到底部
                                    }
                                    // 处理错误信息
                                    if (data.error) {
                                        throw new Error(data.error);
                                    }
                                } catch (e) {
                                    // 忽略非标准格式数据，不影响整体流程
                                    continue;
                                }
                            }
                        }
                    },
                }
            );
        } catch (err) {
            const error = err as Error;
            // 更新 AI 消息为错误提示
            setMessages(prev =>
                prev.map(msg =>
                    msg.timestamp === assistantMsgTimestampRef.current
                        ? { ...msg, content: `❌ ${error.message}` }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };
    // 5. 提交表单（发送用户消息）
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 阻止表单默认刷新行为
        const userContent = inputValue.trim();

        // 校验：输入为空或加载中时，不执行操作
        if (!userContent || isLoading) return;

        // 清空输入框
        setInputValue('');
        // 添加用户消息到对话列表
        const userMessage: ChatMessage = {
            role: 'user',
            content: userContent,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        scrollToBottom(); // 滚动到用户消息

        // 根据模式调用对应接口
        if (isStreaming) {
            await fetchStreamAnswer(userContent);
        } else {
            await fetchNonStreamAnswer(userContent);
        }
    };

    // 6. 切换流式/非流式模式
    const toggleStreamingMode = () => {
        setIsStreaming(prev => !prev);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>AI 智能对话</h2>

            {/* 流式/非流式模式切换 */}
            <div className={styles.modeSwitch}>
                <label>
                    <input
                        type="checkbox"
                        checked={isStreaming}
                        onChange={toggleStreamingMode}
                        className={styles.checkbox}
                    />
                    开启流式回答（打字机效果）
                </label>
            </div>

            {/* 对话列表容器 */}
            <div className={styles.chatContainer}>
                <div ref={messageListRef} className={styles.messageList}>
                    {/* 空对话提示 */}
                    {messages.length === 0 ? (
                        <div className={styles.emptyTip}>
                            👋 您好，我是 AI 助手，请问有什么可以帮到您的？
                        </div>
                    ) : (
                        // 渲染对话记录
                        messages.map((msg) => (
                            <div
                                key={`${msg.timestamp}-${msg.role}`}
                                className={
                                    msg.role === 'user'
                                        ? styles.userMessageWrapper
                                        : styles.assistantMessageWrapper
                                }
                            >
                                <div
                                    className={
                                        msg.role === 'user' ? styles.userAvatar : styles.assistantAvatar
                                    }
                                >
                                    {msg.role === 'user' ? '👤' : '🤖'}
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.roleName}>
                                        {msg.role === 'user' ? '我' : 'AI 助手'}
                                    </div>
                                    <div className={styles.contentText}>{msg.content}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 输入表单 */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="请输入您的问题..."
                    className={styles.textarea}
                    disabled={isLoading}
                    rows={3}
                />
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading || !inputValue.trim()}
                >
                    {isLoading ? (
                        <span className={styles.loadingText}>发送中...</span>
                    ) : (
                        '发送'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AI;