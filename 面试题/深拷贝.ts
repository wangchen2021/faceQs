let obj = {
    a: 1,
    b: 2,
    c: [1, 2, 3],
    d: {
        name: 'd',
    },
    e: function () {
        console.log('e');
    }
}

// 浅拷贝
let obj2 = obj

// 深拷贝
function deepClone(target: any) {
    let res: any
    let type = Object.prototype.toString.call(target)
    if (type === '[object Object]') {
        res = {}
    }
    else if (type === '[object Array]') {
        res = []
    } else {
        return target
    }
    for (let key in target) {
        let value = target[key]
        let valueTpye = Object.prototype.toString.call(value)
        if (valueTpye === '[object Object]' || valueTpye === '[object Array]') {
            res[key] = deepClone(value)
        } else {
            res[key] = value
        }
    }
    return res
}

let obj3 = deepClone(obj)


obj.a = 6
console.table([obj, obj2, obj3]);


function myClone(target: any) {
    const type = Object.prototype.toString.call(target)
    let res: any
    switch (type) {
        case "[object Object]":
            res = {}
            break;
        case "[object Array]":
            res = []
            break;
        default:
            return res
    }
    for (let key in target) {
        const value = target[key]
        const valueType = Object.prototype.toString.call(value)
        if (valueType === "[object Object]" || valueType === "[object Array]") {
            res[key] = myClone(value)
        } else {
            res[key] = value
        }
    }
    return res
}