//实现该函数
function memoize(func: Function) {
    const cache = new WeakMap()
    function remeberFun(obj: Object) {
        if (cache.has(obj)) {
            return cache.get(obj)
        } else {
            const res = func(obj)
            cache.set(obj, res)
            return res
        }
    }
    // 只有要被 new 的构造函数才用 .prototype；普通函数想暴露静态属性，直接“函数对象.属性 = 值”即可。
    remeberFun.cache = {
        set: (obj: object, values: any) => {
            if (cache.has(obj)) {
                cache.set(obj, values)
            } else {
                throw new Error(`Cache has no key of ${obj.toString()}`)
            }
        },
    }
    return remeberFun
}

var object = { a: 1, b: 2 }
var other = { c: 3, d: 4 }

var values = memoize((obj: object) => Object.values(obj))

console.log(values(object))

//=> [1 , 2]

console.log(values(other));

//=> [3, 4]

object.a = 2

console.log(values(object));

//=> [1 , 2]

values.cache.set(object, ['a', 'b'])

console.log(values(object));

//=>['a' , 'b']

