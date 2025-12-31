export namespace WebRTCTypes{
    interface SdpData{
        sdpData:any,
        type:"call"|"answer",
        userId:string,
        connectId:string,
    }

    interface UsersData {
    id: string,
    userId: string,
    name: string
}
}