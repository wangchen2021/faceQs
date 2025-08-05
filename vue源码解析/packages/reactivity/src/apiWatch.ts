/**
 * @description：本来不属于reactivity包的内容，本来属于包，但是因为watch是reactive的一个api，所以放在这里
 */

import { isReactive } from "./reactive";
import { isRef } from "./ref";
import { ReactiveEffect } from "./effect"
import { isFunction } from "@vue/shared";

export function watch(src: any, cb: any, options: any) {
    return dowatch(src, cb, options)
}


function traverse(src: any, deep: boolean, currentDepth = 0, seen = new Set()) {
    if (typeof src !== 'object' || src === null || seen.has(src)) {
        return src;
    }
    seen.add(src);
    for (const key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
            const value = src[key];
            if (deep) {
                traverse(value, deep, currentDepth + 1, seen);
            }
        }
    }
    return src;
}


function dowatch(src: any, cb: any, options: any) {
    const reactiveGetter = (src: any) => traverse(src, options.deep ? true : false)
    let getter = () => { }
    if (isReactive(src)) {
        getter = () => reactiveGetter(src)
    } else if (isRef(src)) {
        getter = () => src.value
    } else if (isFunction(src)) {
        getter = src
    }
    let oldValue: any;
    const job = () => {
        if (cb) {
            const newValue = effect.run()
            if (cb.length === 1) {
                cb(newValue);
            } else {
                cb(oldValue, newValue);
            }
            oldValue = newValue;
        } else {
            effect.run()
        }
    }
    const effect = new ReactiveEffect(getter, job);
    if (options.immediate) {
        job()
    } else {
        oldValue = effect.run(); //执行一次获取初始值
    }

    const unWatch = () => {
        effect.stop()
    }

    return unWatch
}

export function watchEffect(src: any, options: any = {}) {
    return dowatch(src, null, options)
}