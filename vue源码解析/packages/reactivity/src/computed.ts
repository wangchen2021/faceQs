import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, trrigerRefValue } from "./ref";

export function computed(getterOrOptions: any) {
    let onlyGetter = isFunction(getterOrOptions);
    let getter: Function;
    let setter: Function;
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => { };
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
}

export class ComputedRefImpl {
    public _value: any;
    public effect: ReactiveEffect;
    public dep: any;

    constructor(getter: Function, public setter: Function) {
        this.effect = new ReactiveEffect(
            () => getter(this._value),
            () => {
                //  计算属性依赖值发生变化,触发渲染
                trrigerRefValue(this);
            });
    }

    get value() {
        if (this.effect.dirty) {
            this._value = this.effect.run();
            // 收集effect
            trackRefValue(this);
        }
        return this._value; // 如果没有脏标志，直接返回缓存值
    }
    
    set value(newValue: any) {
        this.setter(newValue)
    }
}