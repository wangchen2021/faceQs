import { track, trriger } from "./reactiveEffect";

export enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    RAW = '__v_raw'
}

export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        // 这里可以添加一些响应式的逻辑
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        //依赖收集
        track(target, key);
        // 不直接用 receiver[key]， 因为可能会触发 getter 直接取target[key]，而不是代理对象的属性也不对
        return Reflect.get(target, key, receiver); //receiver指定this指向
    },
    set(target, key, value, receiver) {
        // 这里可以添加一些响应式的逻辑
        let oldVlaue = target[key]
        const result = Reflect.set(target, key, value, receiver);
        if (oldVlaue !== value) {
            //需要触发更新逻辑
            trriger(target,key,value,oldVlaue);
        }
        return result
    }
}