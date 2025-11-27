function MyTypeof(target) {
    const type = typeof target
    if (type !== "object") return type
    else {
        if (Array.isArray(target)) {
            return "array"
        } else if (target === null) {
            return "null"
        } else {
            return "object"
        }
    }
}

console.log(MyTypeof(null));
