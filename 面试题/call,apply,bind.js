// bind与call或apply最大的区别就是bind不会被立即调用，而是返回一个函数，函数内部的this指向与bind执行时的第一个参数，而传入bind的第二个及以后的参数作为原函数的参数来调用原函数。

let obj = {
    name: "test",
    fun: function (str1, str2) {
        console.log(this.name);
        console.log(str1);
        console.log(str2);
    }
}

let obj2 = {
    name: "obj2"
}

// obj.fun("1", "2")
// obj.fun.call(obj2, "1", "1")
// obj.fun.apply(obj2, ["5", "5"])
// let a = obj.fun.bind(obj2, "6")
// a("7")


function myCall() {
    const args = arguments
    const param = Array.from(args)
    const target = param.shift()
    const targetFunKey = Symbol("targetCallFunKey")
    target[targetFunKey] = this
    return target[targetFunKey](...param)
}

function myApply(target) {
    const args = arguments
    const param = Array.from(args)[1]
    const targetFunKey = Symbol("targetApplyFunKey")
    target[targetFunKey] = this
    return target[targetFunKey](...param)
}

function myBind() {
    const args = arguments
    const param = Array.from(args)
    const target = param.shift()
    const targetFunKey = Symbol("targetBindFunKey")
    target[targetFunKey] = this
    return function () {
        const newArgs = arguments
        target[targetFunKey](...param, ...newArgs)
    }
}

Function.prototype.myCall = myCall
Function.prototype.myApply = myApply
Function.prototype.myBind = myBind

obj.fun.myCall(obj2, "1", "2")
obj.fun.myApply(obj2, ["5", "5"])
let a = obj.fun.myBind(obj2, "6")
a("7", "8")