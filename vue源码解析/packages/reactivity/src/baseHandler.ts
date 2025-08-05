import { isObject } from "@vue/shared";
import { track, trriger } from "./reactiveEffect";
import { reactive } from "./reactive";
import { ReactiveFlags } from "./constants";


export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        // 这里可以添加一些响应式的逻辑
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        //依赖收集
        track(target, key);
        // 不直接用 receiver[key]， 因为可能会触发 getter 直接取target[key]，而不是代理对象的属性也不对
        let res = Reflect.get(target, key, receiver); //receiver指定this指向
        if (isObject(res)) {
            return reactive(res); //如果是对象，返回reactive代理对象 深度代理
        }
        return res; //返回值
    },
    set(target, key, value, receiver) {
        // 这里可以添加一些响应式的逻辑
        let oldVlaue = target[key]
        const result = Reflect.set(target, key, value, receiver);
        if (oldVlaue !== value) {
            //需要触发更新逻辑
            trriger(target, key, value, oldVlaue);
        }
        return result
    }
}