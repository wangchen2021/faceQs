export { }

let currentEffect: any = null
const depsMap = new WeakMap()
const isReacive = Symbol("__v_isReactive")

function reacive(target: any) {
    if (typeof target === "object" && !target[isReacive]) {
        return createReactiveObject(target)
    } else {
        return target
    }
}

//用reflect的原因是
//1. 是不报错，不阻断代码执行
//2. 解决函数内部get set指针问题
// 正确的 this 指向：Reflect.get(target, key, receiver) 的第三个参数 receiver 
// 会绑定操作时的上下文（即 Proxy 实例本身），而直接 target[key] 的 this 会指向 
// target 而非代理对象，导致依赖收集等逻辑失效。  其实就是在使用getter返回自身属性时 this会指向原函数，无法被响应对象拦截
//3. 支持继承场景，确保代理穿透
function createReactiveObject(target: object) {
    return new Proxy(target, {
        get(target: any, key, reaciver) {
            if (key === isReacive) {
                return true
            }
            track(target, key)
            return Reflect.get(target, key, reaciver)
        },
        set(target, key, newValue, receiver) {
            Reflect.set(target, key, newValue, receiver)
            update(target, key)
            return true
        }
    })
}

function track(target: any, key: string | symbol) {
    if (!depsMap.has(target)) {
        depsMap.set(target, new Map())
    }
    const targetMap = depsMap.get(target)
    if (!targetMap.has(key)) {
        targetMap.set(key, new Map())
    }
    const keyMap = targetMap.get(key)
    keyMap.set(currentEffect, { effect: currentEffect, id: ++currentEffect.id })
    // bindEffectDeps(keyMap)
}


// function bindEffectDeps(keyMap) {

// }

function update(target: any, key: string | symbol) {
    if (depsMap.has(target)) {
        updateEffect(depsMap.get(target), key)
    }
}

function updateEffect(deps: Map<string | symbol, Map<ReactiveEffect, object>>, key: string | symbol) {
    const targetMap = deps.get(key)
    const effects = targetMap?.keys()
    if (effects) {
        for (let effect of effects) {
            effect.run()
        }
    }
}



class ReactiveEffect {

    fn: Function | null = null
    scheduler: Function | undefined = undefined
    id = 0
    deps = new Map()

    constructor(fn: Function, scheduler: Function | undefined) {
        this.fn = fn
        this.scheduler = scheduler
    }

    run() {
        if (this.scheduler) {
            this.scheduler()
        } else {
            this.runner()
        }
    }

    runner() {
        currentEffect = this
        if (this.fn) {
            this.fn()
        }
        currentEffect = null
    }
}

function effect(fn: Function, config?: any) {
    const { scheduler } = config
    const reactiveEffect = new ReactiveEffect(fn, scheduler)
    reactiveEffect.run()
    return reactiveEffect.runner
}




const obj = {
    a: 1,
    b: 2
}

const proxyObj = reacive(obj)

function test() {
    console.log(proxyObj.a);
}

const runner = effect(test,
    {
        schedule: () => {
            console.log("自定义runner执行");
            runner()
        },
    }
)

setTimeout(() => {
    proxyObj.a = 5
}, 2000);


