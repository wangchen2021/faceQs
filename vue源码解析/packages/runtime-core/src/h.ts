/**
 * @description - h函数 构造虚拟节点 （类型，属性，儿子...）/（类型，儿子）
1. 两个参数，第二个可能是节点也可以是属性
2. 第二个参数是儿子数组
3. 三个参数的时候第二个必须是属性，超过三个参数的后面参数都是儿子
   `h("div",{a:1})`
 */

import { isObject } from "@vue/shared"
import { createVnode, isVnode } from "./createVnode"

export function h(type: any, propsOrChildren?: any, children?: any) {
    const l = arguments.length
    //如果第二个参数是字符串，说明是儿子
    if (l === 1) {
        return createVnode(type)
    }
    if (l === 2) {
        if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
            if (isVnode(propsOrChildren)) {
                //第二个参数是虚拟节点
                return createVnode(type, null, [propsOrChildren])
            } else {
                return createVnode(type, propsOrChildren) // 第二个参数是属性
            }
        }
        return createVnode(type, null, propsOrChildren)
    }
    if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2) //把第三个及后面的参数作为儿子
        return createVnode(type, propsOrChildren, children)
    }
    if (l === 3) {
        if (isVnode(children)) {
            return createVnode(type, propsOrChildren, [children])
        } else {
            return createVnode(type, propsOrChildren, children)
        }
    }
}

