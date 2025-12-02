const target = {
    a: 1,
    b: 2
}

const obj1 = new Proxy(target, {

    get(target, key, receiver) {
        console.log("读取");
        return Reflect.get(target, key, receiver)
    },

    set(target, key, newValue, receiver) {
        console.log("修改值");
        return Reflect.set(target, key, newValue, receiver)
    }

})

obj1.a
obj1.b = 3

function observe(target) {
    if ((typeof target !== "object" && typeof target !== "function") || target === null) {
        return
    }
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

function defineReactive(target, key, value) {

    Object.defineProperty(target, key, {

        get() {
            console.log("observe get");
            return value
        },

        set(newValue) {
            console.log("observe set");
            if (newValue !== value) {
                observe(newValue)
                value = newValue
            }
        }

    })
}

observe(target)

target.a = 3