import { proxyRefs, reactive } from "@vue/reactivity"
import { hasOwn, isFunction, isObject, ShapeFlags } from "@vue/shared"

export function createComponentInstance(vnode: vnode) {
    const vnodeType = vnode.type as VueComponent
    const instance: ComponentInstance = {
        data: null,
        isMounted: false,
        vnode,
        subTree: null,
        update: null,
        props: {},
        attrs: {},
        propsOptions: vnodeType.props || {},
        proxy: {},
        component: null,
        next: null,
        setupState: {},
        slots: {},
    }
    return instance
}

//根据propsOptions解析props，attrs
const initProps = (instance: ComponentInstance, rawProps: any) => {
    const props: { [key: string]: any } = {}
    const attrs: { [key: string]: any } = {}
    const propOptions = instance.propsOptions //用户定义的
    if (rawProps) { //所有的属性
        for (const key in rawProps) {
            const value = rawProps[key]
            if (key in propOptions) {
                props[key] = value //是props定义的属性，放到props中
            } else {
                attrs[key] = value
            }
        }
    }
    instance.props = reactive(props)
    instance.attrs = attrs
}

const publicProperties = { // 组件实例的公开属性
    $el: (i: ComponentInstance) => i.vnode.el,
    $data: (i: ComponentInstance) => i.data,
    $props: (i: ComponentInstance) => i.props,
    $attrs: (i: ComponentInstance) => i.attrs,
    $slots: (i: ComponentInstance) => i.slots,
}

const handler: ProxyHandler<ComponentInstance> = {
    get(target, key) {
        const { data, props, setupState } = target
        if (data && hasOwn(data, key)) {
            return data[key]
        }
        else if (hasOwn(props, key)) {
            return props[key]
        } else if (setupState && hasOwn(setupState, key)) {
            return setupState[key]
        }

        const publicGetter = publicProperties[key as keyof typeof publicProperties]
        if (publicGetter) {
            return publicGetter(target)
        }
    },
    set(target, key, value) {
        const { data, props, setupState } = target
        if (data && hasOwn(data, key)) {
            data[key] = value
        }
        else if (hasOwn(props, key)) {
            props[key] = value
            console.warn('不要修改props的值')
            return false
        } else if (setupState && hasOwn(setupState, key)) {
            setupState[key] = value
        }
        return true
    }
}

function initSlots(instance: ComponentInstance, children: any) {
    if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
        instance.slots = children
    } else {
        instance.slots = {}
    }
}

export function setupComponent(instance: ComponentInstance) {
    const { vnode } = instance
    initProps(instance, vnode.props)
    initSlots(instance, vnode.children)
    instance.proxy = new Proxy(instance, handler)
    vnode.component = instance
    const { data = () => { }, render, setup } = vnode.type as VueComponent
    //处理setup
    const setupContext = {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: (event: string, ...args: any[]) => {
            const eventName = `on${event[0].toUpperCase()}${event.slice(1)}`
            const handler = vnode.props![eventName]
            if (handler) {
                handler(...args)
            }
        },
        expose: (exposed: any) => {
            instance.exposed = exposed
        }
    }
    if (setup) {
        const setupResult = setup(instance.props, setupContext)
        if (isFunction(setupResult)) {
            instance.render = setupResult
        } else if (isObject(setupResult)) {
            instance.setupState = proxyRefs(setupResult) //返回值脱ref
        }
    }

    if (isFunction(data)) {
        instance.data = reactive(data.call(instance.proxy)) //data中的this指向组件实例
    } else {
        console.warn("data必须是函数");
    }

    if (!instance.render) {
        instance.render = render
    }
}