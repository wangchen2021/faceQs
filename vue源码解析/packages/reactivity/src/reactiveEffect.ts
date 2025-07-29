import { activeEffect, trackEffects, trrigerEffects } from "./effect";

const targetMap = new WeakMap();

export const createDep = (cleanup: Function) => {
    const dep = new Map() as any;
    dep.cleanup = cleanup; //用于清理不需要的属性
    return dep
}

export function track(target: any, key: any) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        //如果没有依赖Map，创建一个
        if (!depsMap) {
            depsMap = new Map();
            targetMap.set(target, depsMap);
        }

        let dep = depsMap.get(key);
        //如果没有依赖，创建一个
        if (!dep) {
            depsMap.set(key, dep = createDep(() => { depsMap.delete(key) })); //用于清理不需要的属性
        }
        trackEffects(activeEffect, dep); //将当前effect添加到依赖中
    }
}

export function trriger(target: any, key: any, value: any, oldValue: any) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const dep = depsMap.get(key);
    if (!dep) {
        return;
    }
    trrigerEffects(dep)//触发依赖
}
