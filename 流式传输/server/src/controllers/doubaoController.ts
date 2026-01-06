import { openai } from "../config/openAI";
import { Request, Response } from 'express';

export const getTextAIRes = async (req: Request, res: Response) => {
    const { text } = req.body
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: text,
            }
        ],
        model: 'doubao-seed-1-6-251015',
        reasoning_effort: "medium",
    });
    res.send(completion.choices[0])
}

export const getTextAIResStream = async (req: Request, res: Response) => {
    try {
        // 设置 SSE 响应头（关键：开启分块传输，让前端能实时接收数据）
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // 立即发送响应头
        const { text } = req.body
        const stream = await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: text,
                }
            ],
            model: 'doubao-seed-1-6-251015',
            reasoning_effort: "medium",
            stream: true,
        });
        for await (const part of stream) {
            const msg = part.choices[0]?.delta?.content || ""
            res.write(`data: ${JSON.stringify({ content: msg })}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end()
    } catch (err) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.status(500); // 设置 HTTP 错误状态码
        // 错误信息封装为 SSE 格式，方便前端统一解析
        res.write(`data: ${JSON.stringify({ error: `流式调用失败：${err}` })}\n\n`);
        res.end()
    }
}
