import { ShapeFlags } from "@vue/shared"

export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment')

export function createVnode(type: any, props?: any, children?: any) {
    const vnode: vnode = {
        type,
        props,
        children,
        key: props?.key,
        shapeFlag: ShapeFlags.ELEMENT, //标记节点类型
        el: null, //真实节点
        __v_isVNode: true, //标识是虚拟节点
    }

    if (children) {
        if (Array.isArray(children)) {
            vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN // 数组子节点
            vnode.children = children
        } else {
            vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN // 文本子节点
            vnode.children = children
        }
    }

    return vnode
}

export function isVnode(vnode: any) {
    return vnode?.__v_isVNode
}

export function isSameVnode(n1: vnode, n2: vnode) {
    return n1.type === n2.type && n1.key === n2.key
}