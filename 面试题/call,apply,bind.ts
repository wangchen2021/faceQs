// bind与call或apply最大的区别就是bind不会被立即调用，而是返回一个函数，函数内部的this指向与bind执行时的第一个参数，而传入bind的第二个及以后的参数作为原函数的参数来调用原函数。

export { };

let obj = {
    name: "test",
    fun: function (str1: string, str2: string) {
        console.log(this.name);
        console.log(str1);
        console.log(str2);
    }
}

let obj2 = {
    name: "obj2"
}

obj.fun("1", "2")
obj.fun.call(obj2, "1", "1")
obj.fun.apply(obj2, ["5", "5"])
let a = obj.fun.bind(obj2, "6")
a("7")