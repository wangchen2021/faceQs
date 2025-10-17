export const Teleport = {
    __isTeleport: true
    
}

export const isTeleport = (type: any) => {
    return type && type.__isTeleport
}