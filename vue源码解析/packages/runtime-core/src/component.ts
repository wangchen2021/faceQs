import { reactive } from "@vue/reactivity"
import { hasOwn, isFunction } from "@vue/shared"

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
        next: null
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
    $attrs: (i: ComponentInstance) => i.attrs
}

const handler: ProxyHandler<ComponentInstance> = {
    get(target, key) {
        const { data, props } = target
        if (data && hasOwn(data, key)) {
            return data[key]
        }
        else if (hasOwn(props, key)) {
            return props[key]
        }
        const publicGetter = publicProperties[key as keyof typeof publicProperties]
        if (publicGetter) {
            return publicGetter(target)
        }
    },
    set(target, key, value) {
        const { data, props } = target
        if (data && hasOwn(data, key)) {
            data[key] = value
        }
        else if (hasOwn(props, key)) {
            props[key] = value
            console.warn('不要修改props的值')
            return false
        }
        return true
    }
}

export function setupComponent(instance: ComponentInstance) {
    const { vnode } = instance
    initProps(instance, vnode.props)
    instance.proxy = new Proxy(instance, handler)
    vnode.component = instance
    const { data = () => { }, render } = vnode.type as VueComponent
    if (isFunction(data)) {
        instance.data = reactive(data.call(instance.proxy)) //data中的this指向组件实例
        instance.render = render
    } else {
        console.warn("data必须是函数");
    }
}