//操作节点属性
declare interface VueTMLElement extends HTMLElement {
    _vei?: Record<string, any>,
    _vnode?: any //虚拟节点
}

declare type VueComponent = {
    data?: Function, //组件的data数据
    render?: Function, //组件的render函数
    props: any, //组件的props选项
    setup?: Function //组合式API
}

declare type vnode = {
    type: string | symbol | VueComponent, //节点类型
    props?: Record<string | symbol, any>,
    children?: Array<vnode | string> | string,
    el: VueTMLElement | null, //真实节点
    shapeFlag: number, //标记节点类型
    key?: string | number, //唯一标识
    __v_isVNode?: true, //标识是虚拟节点
    component?: ComponentInstance //组件实例
}

declare type ComponentInstance = {
    data: any,
    isMounted: boolean,
    vnode: vnode,
    subTree: any,
    update: (() => void) | null,
    props: Record<string | symbol, any>,
    attrs: Record<string | symbol, any>,
    propsOptions: Record<string | symbol, any>,
    proxy: Record<string | symbol, any>,
    component: ComponentInstance | null,
    render?: Function,
    next: vnode | null,
    setupState: Record<string | symbol, any>,
    slots: Record<string, Function>,
    exposed?: Record<string, any>,
}