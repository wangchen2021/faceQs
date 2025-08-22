import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";
import { ReactiveFlags } from "./constants";

//记录缓存代理后的结果
const reactiveMap = new WeakMap();


export function reactive(target: any) {
    return createReactiveObject(target);
}

function createReactiveObject(target: any) {

    //判断是否是对象
    if (!isObject(target)) {
        return target;
    }

    //如果是已经代理的，直接返回
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }

    if (reactiveMap.has(target)) {
        //如果缓存中有，直接返回
        return reactiveMap.get(target);
    }

    let proxy = new Proxy(target, mutableHandlers);
    //缓存代理后的结果
    reactiveMap.set(target, proxy);
    return proxy;
}

export function toReactive(value: any) {

    if (isObject(value)) {
        return reactive(value);
    }

    return value;
}

export function isReactive(value: any) {
    //判断是否是响应式对象
    return !!(value && value[ReactiveFlags.IS_REACTIVE]); //等价Boolean(value && value[ReactiveFlags.IS_REACTIVE]);
}