import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getAction } from '../../api/request';
import { v4 as uuidv4 } from 'uuid';
import type { WebRTCTypes } from '@my/shared';

const userId = uuidv4();
// 移除 wrtc 导入，使用浏览器原生 API
// 定义 Socket 事件类型（可选，提升 TS 类型安全性）
// WebRTC 点对点音视频通话组件
const WebRTC: React.FC = () => {
    // 本地视频 ref
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    // 远端视频 ref
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    // RTCPeerConnection 实例 ref
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    // 本地媒体流 ref
    const localStreamRef = useRef<MediaStream | null>(null);
    // Socket 实例 ref（组件内创建，避免全局污染）
    const socketRef = useRef<ReturnType<typeof io> | null>(null);
    // 通话状态
    const [callStatus, setCallStatus] = useState<string>('未建立连接，请点击「发起通话」');

    const [users, setUsers] = useState<any[]>([])

    const [connectUser, setConnectUser] = useState<any>(null)

    // 1. 初始化本地采集 + RTCPeerConnection + Socket
    useEffect(() => {
        // 创建 Socket 连接
        socketRef.current = io('http://localhost:3001', {
            query: {
                userId
            }
        });
        const socket = socketRef.current;

        // 初始化本地音视频采集
        const initLocalStream = async () => {
            try {
                // 显式声明 MediaStreamConstraints 类型，自定义分辨率
                const constraints: MediaStreamConstraints = {
                    video: { width: 1280, height: 720, frameRate: 30 },
                    audio: false
                };
                const localStream = await navigator.mediaDevices.getUserMedia(constraints);
                localStreamRef.current = localStream;

                // 绑定本地视频预览，增加类型安全和错误处理
                if (localVideoRef.current && localStream) {
                    localVideoRef.current.srcObject = localStream as MediaStream;
                    try {
                        await localVideoRef.current.play();
                    } catch (playErr) {
                        console.error('本地视频播放失败：', playErr);
                        setCallStatus('本地视频播放失败，请检查设备权限');
                    }
                }
            } catch (err) {
                const error = err as Error;
                setCallStatus(`本地采集失败：${error.message}`);
                console.error(error);
            }
        };

        // 初始化 RTCPeerConnection
        const initPeerConnection = () => {
            // STUN 服务器配置
            const iceConfig = {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun.qq.com:3478' }
                ]
            };

            // 创建 RTCPeerConnection 实例（浏览器原生 API）
            const peerConnection = new RTCPeerConnection(iceConfig);
            peerConnectionRef.current = peerConnection;

            // 将本地流添加到 PeerConnection
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, localStreamRef.current!);
                });
            }

            // 监听远端流
            peerConnection.ontrack = (event) => {
                const remoteStream = event.streams[0];
                if (remoteVideoRef.current && remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream as MediaStream;
                    setCallStatus('点对点通话已建立，正在通话中...');
                }
            };

            // 监听 ICE 候选地址
            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit('webRtcIce', event.candidate);
                }
            };

            // 监听连接状态变化
            peerConnection.onconnectionstatechange = () => {
                const state = peerConnection.connectionState;
                switch (state) {
                    case 'connected':
                        setCallStatus('通话已建立');
                        break;
                    case 'disconnected':
                        setCallStatus('通话已断开');
                        break;
                    case 'failed':
                        setCallStatus('通话连接失败');
                        break;
                    case 'closed':
                        setCallStatus('通话已关闭');
                        break;
                    default:
                        break;
                }
            };
        };

        // 先初始化本地采集，再初始化 PeerConnection
        initLocalStream().then(initPeerConnection);

        // 监听信令服务器转发的 SDP 信息
        socket.on('webRtcSdp', async (data: WebRTCTypes.SdpData) => {
            const { userId: connectId, sdpData, type } = data
            if (!peerConnectionRef.current) return;
            try {
                if (type === "call") {
                    alert(`收到来自${userId}通讯请求`)
                } else {
                    alert(`收到来自${userId}通讯回复`)
                }
                await peerConnectionRef.current.setRemoteDescription(
                    new RTCSessionDescription(sdpData)
                );
                // 收到 offer 后创建 answer
                if (sdpData.type === 'offer') {
                    const answer = await peerConnectionRef.current.createAnswer();
                    await peerConnectionRef.current.setLocalDescription(answer);
                    const param: WebRTCTypes.SdpData = {
                        sdpData: answer,
                        type: "answer",
                        userId,
                        connectId
                    }
                    socket.emit('webRtcSdp', param);
                }
            } catch (err) {
                console.error('处理 SDP 失败：', err);
            }
        });

        // 监听信令服务器转发的 ICE 候选地址
        socket.on('webRtcIce', async (iceData) => {
            if (!peerConnectionRef.current) return;
            try {
                await peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(iceData)
                );
            } catch (err) {
                console.error('添加 ICE 失败：', err);
            }
        });

        // 组件卸载时清理所有资源
        return () => {
            // 停止本地媒体流
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            // 关闭 PeerConnection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            // 断开 Socket 连接
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            // 清空视频源
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            setCallStatus('组件已卸载，所有资源已清理');
        };
    }, []);

    // 2. 发起通话（创建 offer 并发送）
    const startCall = async () => {
        if (!connectUser) return alert("请选择连线用户")
        const peerConnection = peerConnectionRef.current;
        const socket = socketRef.current;
        if (!peerConnection || !socket) {
            setCallStatus('PeerConnection 或 Socket 未初始化，请稍后重试');
            return;
        }

        try {
            // 创建 offer
            const offer = await peerConnection.createOffer();
            // 设置本地 SDP
            await peerConnection.setLocalDescription(offer);
            const param: WebRTCTypes.SdpData = {
                sdpData: offer,
                userId,
                connectId: connectUser.userId,
                type: "call"
            }
            // 发送 offer 到信令服务器
            socket.emit('webRtcSdp',param);
            setCallStatus('已发起通话请求，等待对方接听...');
        } catch (err) {
            const error = err as Error;
            setCallStatus(`发起通话失败：${error.message}`);
            console.error(error);
        }
    };

    // 3. 结束通话
    const endCall = () => {
        // 停止本地流
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        // 关闭 PeerConnection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        // 清空视频源
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        setCallStatus('通话已结束');
    };

    const selectUsers = () => {
        getAction("/socket/user", { userId })
            .then((res: any) => {
                setUsers(res.users)
            })
    }

    return (
        <div style={{ width: '1000px', margin: '30px auto' }}>
            <h3>WebRTC 点对点音视频通话示例（React TS 优化版）</h3>
            <h3>用户id {userId}</h3>
            <p style={{ color: '#666' }}>{callStatus}</p>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button onClick={selectUsers}>选择用户</button>
                <button onClick={startCall} style={{ padding: '10px 20px' }}>
                    发起通话
                </button>
                <button onClick={endCall} style={{ padding: '10px 20px', background: '#f44336', color: '#fff' }}>
                    结束通话
                </button>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ minWidth: "150px" }}>
                    <h4>用户列表</h4>
                    {users.map((item) => {
                        return <div onClick={() => setConnectUser(item)} style={{ cursor: "pointer", marginTop: "20px" }} key={item.userId}>{item.userId}</div>
                    })}
                    {connectUser && <h4>当前选择用户：{connectUser.userId}</h4>}
                </div>
                {/* 本地视频预览 */}
                <div>
                    <h4>本地视频</h4>
                    <video
                        ref={localVideoRef}
                        width="480"
                        height="360"
                        playsInline
                        controls
                        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                </div>
                {/* 远端视频预览 */}
                <div>
                    <h4>远端视频</h4>
                    <video
                        ref={remoteVideoRef}
                        width="480"
                        height="360"
                        playsInline
                        controls
                        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WebRTC;