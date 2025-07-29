export function effect(fn: Function, options: any) {
    //创建响应effect 数据变化后重新执行
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run();
    });
    _effect.run()
    return _effect;
}

export let activeEffect: ReactiveEffect | undefined = undefined;

function preCleanEffect(effect: ReactiveEffect) {
    //清理之前的依赖
    effect._depsLength = 0
    effect._trackId++ //每次执行effect时，trackId加1，表示新的依赖
}

class ReactiveEffect {
    _trackId = 0  //用于跟踪依赖 每执行一次加一
    deps: any[] = []; //存储依赖
    _depsLength = 0; //依赖长度
    public active = true; //是否激活
    constructor(public fn: Function, public scheduler: Function) {
        this.fn = fn;
        this.scheduler = scheduler;
    }
    //执行fn
    run() {
        if (!this.active) {
            return this.fn();
        }
        let lastEffect = activeEffect; //保存当前activeEffect
        try {
            //设置当前effect为activeEffect
            activeEffect = this;
            preCleanEffect(this); //清理之前的依赖
            return this.fn();
        } finally {
            activeEffect = lastEffect; //执行完后清除activeEffect
        }
    }
}

//依赖和effect双向记忆
export function trackEffects(effect: ReactiveEffect, dep: Map<any, any>) {
    if (dep.get(effect) !== effect._trackId) {
        //依赖dep记录effect  同时effect记录依赖dep
        dep.set(effect, effect._trackId); //将当前effect添加到依赖中
    }
    effect.deps[effect._depsLength++] = dep; //将依赖添加到effect的deps中
}

export function trrigerEffects(dep: Map<any, any>) {
    for (const effect of dep.keys()) {
        if (effect.scheduler) {
            effect.scheduler();
        }
    }
}