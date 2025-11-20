export { }
let obj = { a: 1, b: 2 }

let targetMap = new WeakMap()

const defineVueReactive = (obj: object, key: string | symbol, val: any) => {
    Object.defineProperty(obj, key, {
        get() {
            console.log("数据订阅");
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                observe(newVal)
                val = newVal
                console.log("更新视图");
            }
        }
    })
}

function observe(target: any) {
    if (typeof target !== 'object' || obj === null) return
    Object.keys(target).forEach((key) => {
        defineVueReactive(target, key, target[key])
    })
}

observe(obj)
