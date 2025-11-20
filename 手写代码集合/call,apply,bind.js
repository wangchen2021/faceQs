Function.prototype.myCall = function (target, ...args) {
    const fn = this
    const key = Symbol("myCall")
    target[key] = fn
    target[key](...args)
    delete target[key]
}


Function.prototype.myApply = function (target, args) {
    const fn = this
    const key = Symbol("myApply")
    target[key] = fn
    target[key](...args)
    delete target[key]
}


Function.prototype.myBind = function (target, args) {
    const fn = this
    return function (...newArgs) {
        fn.myApply(target, [...args, ...newArgs])
    }
}




let obj1 = {
    name: "obj1",
    say(age) {
        console.log(this.name);
        console.log(age);
    }
}

let obj2 = {
    name: "obj2"
}

obj1.say(12)

obj1.say.myCall(obj2, 18)

obj1.say.myApply(obj2, [18])


let f = obj1.say.myBind(obj2, [29])

f()

console.log(obj2);
