Object.prototype.myCreate = function (target) {
    function fn() { }
    fn.prototype = target
    return new fn()
}


let a = Object.myCreate({ a: 1 })
console.log(a.a);


let b=Object.create({b:1})
console.log(b.b);