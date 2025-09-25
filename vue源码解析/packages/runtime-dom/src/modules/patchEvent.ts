export function patchEvent(el: VueTMLElement, key: string, nextValue: any) {
    //vue_event_invoker
    const invokers = el._vei || (el._vei = {})
    const eventName = key.slice(2).toLowerCase() //去掉on前缀
    const existingInvoker = invokers[key] //之前绑定的事件

    if (existingInvoker && nextValue) {
        //如果有旧的事件，并且有新的事件
        return existingInvoker.value = nextValue
    }
    
    if (nextValue) {
        //如果有新的事件
        const invoker = (invokers[key] = createInvoker(nextValue))
        return el.addEventListener(eventName, invoker)
    }

    if (existingInvoker) {
        //没有新的事件，移除旧的事件
        el.removeEventListener(eventName, existingInvoker)
        return invokers[key] = undefined
    }
}

function createInvoker(value: any) {
    const invoker = (e: any) => invoker.value()
    invoker.value = value
    return invoker
}