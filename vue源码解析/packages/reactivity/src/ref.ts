import { ComputedRefImpl } from "./computed";
import { activeEffect, trackEffects, trrigerEffects } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";

export function ref(value: any) {
    return createRef(value);
}

function createRef(value: any) {
    return new RefImpl(value);
}

class RefImpl {
    public _v_isRef = true
    public _value: any;
    public dep: any // 用于存储依赖
    constructor(public rawValue: any) {
        this._value = toReactive(rawValue); // 初始化值
    }
    get value() {
        trackRefValue(this); // 依赖收集
        return this.rawValue;
    }
    set value(newValue: any) {
        if (newValue !== this.rawValue) {
            this.rawValue = newValue;
            this._value = newValue;
            // 这里可以添加触发更新的逻辑
            // 比如调用一个更新函数或者触发依赖收集
            trrigerRefValue(this); // 触发更新
        }
    }
}

export function trackRefValue(ref: RefImpl | ComputedRefImpl) {
    if (activeEffect) {
        trackEffects(activeEffect,
            (
                ref.dep = ref.dep || createDep(() => { ref.dep = undefined })
            ),
        );
    }
}

export function trrigerRefValue(ref: RefImpl | ComputedRefImpl) {
    let dep = ref.dep;
    if (dep) { 
        trrigerEffects(dep);
    }
}

class ObjectRefImpl<T> {
    public _v_isRef = true
    constructor(public _object: T, public _key: keyof T) {
    }
    get value() {
        return this._object[this._key];
    }
    set value(newValue: any) {
        this._object[this._key] = newValue;
    }
}

export function toRef<T>(object: T, key: keyof T) {
    return new ObjectRefImpl(object, key);
}

export function toRefs<T>(object: T) {
    const res: any = {}
    for (const key in object) {
        res[key] = toRef(object, key);
    }
    return res;
}

export function proxyRefs<T extends { [key: string]: any }>(object: T) {
    return new Proxy(object, {
        get(target, key, receiver) {
            let res: any = Reflect.get(target, key, receiver);
            return res && res._v_isRef ? res.value : res; //如果是ref
        },
        set(target, key, value, receiver) {
            const oldValue = target[key as keyof T];
            if (oldValue && oldValue._v_isRef) {
                oldValue.value = value;
                return true;
            } else {
                return Reflect.set(target, key, value, receiver); //直接设置值
            }
        }
    });
}

export function isRef(value: any) {
    return !!(value && value._v_isRef); //判断是否是ref对象
}