/**
 * @description vue扩展HTMLElement类型
 */
declare interface VueTMLElement extends HTMLElement {
    _vei?: Record<string, any>,
    _vnode?: any //虚拟节点
}

/**
 * @description 组件类型
 */
declare type VueComponent = {
    data?: Function, //组件的data数据
    render?: Function, //组件的render函数
    props: any, //组件的props选项
    setup?: Function //组合式API
}


/**
 * @description 虚拟节点类型
 */
declare type vnode = {
    type: string | symbol | VueComponent | Function, //节点类型
    props?: Record<string | symbol, any>,
    children?: Array<vnode | string> | string,
    el: VueTMLElement | null, //真实节点
    shapeFlag: number, //标记节点类型
    key?: string | number, //唯一标识
    __v_isVNode?: true, //标识是虚拟节点
    component?: ComponentInstance //组件实例
    ref?: any //ref
}


/**
 * @description 组件实例类型
 */
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
    bc?: Array<Function>, //beforeCreate
    c?: Array<Function>, //created
    bm?: Array<Function>, //beforeMount
    m?: Array<Function>, //mounted
    bu?: Array<Function>, //beforeUpdate
    u?: Array<Function>, //updated
    bum?: Array<Function>, //beforeUnmount
    um?: Array<Function>, //unmounted
    parent: ComponentInstance | null,
    provides: Record<string | symbol, any>,
}