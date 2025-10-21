import { isFunction, isObject, isString, ShapeFlags } from "@vue/shared"
import { isTeleport } from "./components/Teleport"

export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment')

export const enum PatchFlags {
    TEXT = 1,                     // 000000000001 动态文本
    CLASS = 1 << 1,               // 000000000010 动态 class
    STYLE = 1 << 2,               // 000000000100 动态 style
    PROPS = 1 << 3,               // 000000001000 动态属性（非 class/style）
    FULL_PROPS = 1 << 4,          // 000000010000 动态 key，需完整 diff
    HYDRATE_EVENTS = 1 << 5,      // 000000100000 事件需要 hydration
    STABLE_FRAGMENT = 1 << 6,     // 000001000000 子节点顺序不变的 fragment
    KEYED_FRAGMENT = 1 << 7,      // 000010000000 带 key 的 fragment
    UNKEYED_FRAGMENT = 1 << 8,    // 000100000000 无 key 的 fragment
    NEED_PATCH = 1 << 9,          // 001000000000 仅需非 props 的 patch（ref、指令等）
    DYNAMIC_SLOTS = 1 << 10,      // 010000000000 动态插槽
    DEV_ROOT_FRAGMENT = 1 << 11,  // 100000000000 开发时根注释片段

    // 特殊值（不能位运算）
    HOISTED = -1,                 // 静态提升节点
    BAIL = -2,                    // 退出优化模式
}

export function createVnode(type: any, props?: any, children?: any, patchFlag?: any) {
    const shapeFlag =
        isString(type)
            ? ShapeFlags.ELEMENT : isTeleport(type)
                ? ShapeFlags.TELEPORT : isObject(type)
                    ? ShapeFlags.STATEFUL_COMPONENT : isFunction(type)
                        ? ShapeFlags.FUNCTIONAL_COMPONENT : 0

    const vnode: vnode = {
        type,
        props,
        children,
        key: props?.key,
        shapeFlag, //标记节点类型
        el: null, //真实节点
        __v_isVNode: true, //标识是虚拟节点
        ref: props?.ref,
        patchFlag
    }

    if (currentBlock && patchFlag > 0) {
        currentBlock.push(vnode)
    }

    if (children) {
        if (Array.isArray(children)) {
            vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN // 数组子节点
            vnode.children = children
        } else if (isObject(children)) {
            if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                // 组件 + 对象 = 插槽
                vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN // 插槽子节点
            }
        }
        else {
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

let currentBlock: Array<any> | null = null

export function openBlock() {
    currentBlock = [] //收集动态节点
}

export function closeBlock() {
    currentBlock = null
}

export function setupBlock(vnode: vnode) {
    vnode.dynamicChildren = currentBlock
    closeBlock()
    return vnode
}

export function toDisplayString(value: any) {
    return isString(value) ? value : value === null ? "" : isObject(value) ? JSON.stringify(value) : String(value)
}

export function createElementBlock(type: string | symbol | Function | VueComponent | TeleportProps, props?: any, children?: any, patchFlag?: any) {
    const vnode = createVnode(type, props, children, patchFlag)
    return setupBlock(vnode)
}

export { createVnode as _createElementVNode }
