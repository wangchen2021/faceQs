export function getCurrentTime(): number {
    return performance.now()
}

export function isArray(target: any) {
    return Array.isArray(target)
}

export function isNum(target: any) {
    return typeof target === "number"
}

export function isObject(target: any) {
    return typeof target === "object"
}

export function isFun(target: any) {
    return typeof target === "function"
}