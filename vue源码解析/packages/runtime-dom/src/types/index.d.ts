//操作节点属性
declare interface VueTMLElement extends HTMLElement {
    _vei?: Record<string, any>,
    _vnode?: any //虚拟节点
}

declare type VueComponent = {
    data?: Function, //组件的data数据
    render?: Function, //组件的render函数
}

declare type vnode = {
    type: string | symbol | VueComponent, //节点类型
    props?: Record<string, any>,
    children?: Array<vnode | string> | string,
    el: VueTMLElement | null, //真实节点
    shapeFlag: number, //标记节点类型
    key?: string | number, //唯一标识
    __v_isVNode?: true, //标识是虚拟节点
}

