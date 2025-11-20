function myInstanceof(left, right) {
    if (typeof left !== 'object' || right === null) return false
    let proto = Object.getPrototypeOf(left)
    while (true) {
        if (proto === null) return false
        if (proto === right.prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
}

class Dog{
    constructor(){}
}

let dog=new Dog()
let b={}

console.log(myInstanceof(b,Dog));
console.log(myInstanceof(dog,Dog));

