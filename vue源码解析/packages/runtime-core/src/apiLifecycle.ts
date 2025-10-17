import { currentInstance, resetCurrentInstance, setCurrentInstance } from "./component"

/**
 * @description vue生命周期枚举
 */
export enum LifeCycle {
    BEFORE_CREATE = "bc",
    CREATED = "c",
    BEFORE_MOUNT = "bm",
    MOUNTED = "m",
    BEFORE_UPDATE = "bu",
    UPDATED = "u",
    BEFORE_UNMOUNT = "bum",
    UNMOUNTED = "um"
}

export const onBeforeMount = createHook(LifeCycle.BEFORE_MOUNT)
export const onMounted = createHook(LifeCycle.MOUNTED)
export const onBeforeUpdate = createHook(LifeCycle.BEFORE_UPDATE)
export const onUpdated = createHook(LifeCycle.UPDATED)
export const onBeforeUnmount = createHook(LifeCycle.BEFORE_UNMOUNT)
export const onUnmounted = createHook(LifeCycle.UNMOUNTED)

function createHook(lifecycle: LifeCycle) {
    return (hook: Function, target: ComponentInstance | null = currentInstance) => {
        if (target) {
            const hooks = target[lifecycle] || (target[lifecycle] = [])
            const wrapHook=()=>{
                setCurrentInstance(target)
                hook.call(target)
                resetCurrentInstance()
            }
            hooks.push(wrapHook)
        }
    }
}

export function invokeArrayFns(fns: Array<Function>) {
    for (let i = 0; i < fns.length; i++) {
        fns[i]()
    }
}