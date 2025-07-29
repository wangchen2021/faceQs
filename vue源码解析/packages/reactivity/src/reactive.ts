import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

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