export namespace WebRTCTypes{
    interface SdpData{
        sdpData:any,
        type:"call"|"answer",
        userId:string,
        connectId:string,
    }
}