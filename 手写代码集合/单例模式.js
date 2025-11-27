class Test {
    constructor(name) {
        this.name = name
    }
}

const createSingle = (className) => {
    return new Proxy(className, {
        construct(target, args, newTarget) {
            if (!target.instance) {
                target.instance = Reflect.construct(target, args, newTarget)
            }
            return target.instance
        }
    })
}

const SingleTest = createSingle(Test)

const s1 = new SingleTest("s1")
const s2 = new SingleTest("s2")
console.log(s1, s2);
console.log(s1 === s2);
