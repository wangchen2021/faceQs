function reactive(target: any) {
    if (typeof target !== "object" || target === null) return target
    return createReactiveObject(target)
}

const targetMap = new WeakMap()

let currentEffect: ReactiveEffect | null = null

function createNewDep(clean: (key: string | symbol) => void) {
    const res = new Map as Map<any, any> & { clean: (key: string | symbol) => void }
    res.clean = clean
    return res
}

function trackEffects(effect: ReactiveEffect, dep: Map<ReactiveEffect, number>) {
    dep.set(effect, effect.id)
    if (!effect.deps.includes(dep)) {
        effect.deps.push(dep)
    }
}

function trace(target: object, key: string | symbol) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, dep = createNewDep((key: string | symbol) => depsMap.delete(key)))
    }
    if (currentEffect) {
        trackEffects(currentEffect, dep)
    }
}


function update(target: object, key: string | Symbol) {
    const depsMap = targetMap.get(target)
    if (depsMap) {
        const dep = depsMap.get(key) as Map<ReactiveEffect, number>
        dep.keys().forEach((effect) => {
            effect.run()
        })
    }
}

function createReactiveObject(obj: object) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            trace(target, key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, newValue, receiver) {
            const res = Reflect.set(target, key, newValue, receiver)
            update(target, key)
            return res
        }
    })
}

class ReactiveEffect {
    id = 1
    deps: any[] = []
    runner!: Function
    schedule!: Function | undefined
    constructor(runner: Function, schedule?: Function) {
        this.runner = runner
        this.schedule = schedule
    }

    run() {
        currentEffect = this
        if (!this.schedule) {
            this.runner()
        } else {
            this.schedule()
        }
        currentEffect = null
    }

}

function effect(fn: Function, config?: any) {
    const reactiveEffect = new ReactiveEffect(fn)
    reactiveEffect.run()
    if (config) {
        Object.assign(reactiveEffect, config)
    }
    const runner = reactiveEffect.run.bind(reactiveEffect)
    return runner
}

const state = reactive({
    a: 1,
    b: 2
})

effect(() => {
    console.log(state.a);
})

state.a = 3

setTimeout(() => {
    state.a = 8
}, 3000);
