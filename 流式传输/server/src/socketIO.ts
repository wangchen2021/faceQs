import { Server } from 'socket.io';
import { WebRTCTypes } from '@my/shared';
import http from 'http';
import { Express, Request, Response } from "express"



let usersIdSocketIdMap = new Map()
let users: Record<string, WebRTCTypes.UsersData> = {}

export function initWebRTC(app: Express, server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
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

}