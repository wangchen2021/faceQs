import { hasOwn, ShapeFlags } from "@vue/shared";
import { createVnode, Fragment, isSameVnode, Text } from "./createVnode";
import { getSequence } from "./seq";
import { isRef, reactive, ReactiveEffect } from "@vue/reactivity";
import { queueJob } from "./scheduler";
import { createComponentInstance, setupComponent } from "./component";
import { invokeArrayFns } from "./apiLifecycle";
import { isKeepAlive } from "./components/KeepAlive";

export function createRenderer(renderOptions: any) {

    const {
        insert: hostInsert,
        remove: hostRemove,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        patchProp: hostPatchProp,
    } = renderOptions

    const mountChildren = (children: any, container: VueTMLElement, parentComponent: ComponentInstance | null) => {
        normalizeTextChildren(children)
        for (let i = 0; i < children.length; i++) {
            patch(null, children[i], container, null, parentComponent) // 递归调用patch函数处理子节点
        }

    }

    const mountElement = (vnode: vnode, container: VueTMLElement, anchor: HTMLElement | null = null, parentComponent: ComponentInstance | null) => {

        const { type, props, children, shapeFlag } = vnode

        const el = (vnode.el = hostCreateElement(type)) // 创建元素

        if (props) {
            for (const key in props) {
                hostPatchProp(el, key, null, props[key]) // 设置属性
            }
        }

        //处理子节点
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children) // 设置文本内容
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el, parentComponent) // 递归处理子节点   
        }

        hostInsert(el, container, anchor) // 插入到容器中
    }

    const processElement = (n1: vnode | null, n2: vnode, container: VueTMLElement, anchor: HTMLElement | null = null, parentComponent: ComponentInstance | null) => {
        if (n1 === null) {
            mountElement(n2, container, anchor, parentComponent)
        } else {
            patchElement(n1, n2, container, parentComponent)
        }
    }

    const patchProps = (oldProps: Record<string, any>, newProps: Record<string, any>, el: VueTMLElement) => {
        // 比较新旧属性，更新真实 DOM
        for (const key in newProps) {
            const prev = oldProps[key]
            const next = newProps[key]
            hostPatchProp(el, key, prev, next) // 更新属性
        }

        // 删除旧属性
        for (const key in oldProps) {
            if (!(key in newProps)) {
                hostPatchProp(el, key, oldProps[key], null) // 删除属性
            }
        }
    }

    const unmountChildren = (children: Array<vnode>) => {
        for (let i = 0; i < children.length; i++) {
            unmount(children[i]) // 递归卸载子节点
        }
    }

    const patchKeyedChildren = (c1: Array<vnode>, c2: Array<vnode>, el: VueTMLElement) => {
        // 全量 diff算法
        let i = 0; // 新旧数组的起始索引
        let e1 = c1.length - 1 // 旧数组的尾部索引
        let e2 = c2.length - 1 // 新数组的尾部索引
        // 从左到右比较新旧数组的头部
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]
            if (isSameVnode(n1, n2)) {
                patch(n1, n2, el, null) // 如果新旧节点相同，递归比较
            } else {
                break // 如果不相同，停止比较
            }
            i++ // 头部索引向后移动
        }

        // 从右到左比较新旧数组的尾部
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1]
            const n2 = c2[e2]
            if (isSameVnode(n1, n2)) {
                patch(n1, n2, el, null) // 如果新旧节点相同，递归比较
            } else {
                break // 如果不相同，停止比较
            }
            e1-- // 尾部索引向前移动
            e2--
        }
        // 比对乱序
        if (i > e1) {
            // 新数组多
            if (i <= e2) {
                let nextPos = e2 + 1
                let anchor = nextPos < c2.length ? c2[nextPos].el : null
                while (i <= e2) {
                    patch(null, c2[i], el, anchor) // 挂载新节点
                    i++
                }
            }
        }
        // 旧数组多
        else if (i > e2) {
            if (i <= e1) {
                while (i <= e1) {
                    unmount(c1[i]) // 卸载旧节点
                    i++
                }
            }
        }
        // 中间对比
        else {

            let s1 = i // 新数组的起始索引
            let s2 = i // 旧数组的起始索引
            const keyToNewIndexMap = new Map() // 用于存储新节点的索引

            // 挂载新节点
            let toBePatched = e2 - s2 + i

            let newIndexToOldIndexMap = new Array(toBePatched).fill(0) // 用于存储新节点的索引映射 [0,0,0...e2]

            for (let i = s2; i <= e2; i++) {
                const vnode = c2[i]
                keyToNewIndexMap.set(vnode.key, i) // 将新节点的索引 存储到map中
            }

            for (let i = s1; i <= e1; i++) {
                const vnode = c1[i]
                const newIndex = keyToNewIndexMap.get(vnode.key) // 获取旧节点在新节点中的索引
                if (newIndex === undefined) {
                    unmount(vnode) // 如果新节点中没有该旧节点，卸载旧节点
                } else {
                    newIndexToOldIndexMap[newIndex - s2] = i + 1 // 将旧节点的索引存储到新节点的索引映射中 [2,5,3,0,0,6,0,7]
                    patch(vnode, c2[newIndex], el) // 如果新节点中有该旧节点，递归比较
                }
            }

            let increasingNewIndexSequence = getSequence(newIndexToOldIndexMap) // 获取最长递增子序列 [2,3,6,7]

            let j = increasingNewIndexSequence.length - 1

            for (let i = toBePatched - 1; i > 0; i--) {
                let newIndex = s2 + i
                let vnode = c2[newIndex]
                let anchor = c2[newIndex + 1]?.el
                if (!vnode.el) {
                    patch(null, vnode, el, anchor) // 挂载新节点
                } else {
                    if (i === increasingNewIndexSequence[j]) {
                        j--
                        continue
                    }
                    hostInsert(vnode.el, el, anchor) // 如果新节点已经存在，直接插入
                }
            }

        }
    }

    const normalizeTextChildren = (children: any[]) => {
        for (let i = 0; i < children.length; i++) {
            if (typeof children[i] === 'string' || typeof children[i] === 'number') {
                children[i] = createVnode(Text, null, children[i])
            }
        }
    }

    const patchChildren = (n1: vnode, n2: vnode, el: VueTMLElement, parentComponent: ComponentInstance | null) => {
        // 孩子的三种情况 text array null
        normalizeTextChildren(n2.children as any[])
        const c1 = n1.children
        const c2 = n2.children
        const prevShapeFlag = n1.shapeFlag
        const nextShapeFlag = n2.shapeFlag
        // 1. 新节点是文本
        if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {

            // 如果旧节点是数组，先卸载旧的子节点
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 如果旧节点是数组，先卸载旧的子节点
                unmountChildren(c1 as Array<vnode>)
            }

            // 如果新节点的文本内容和旧节点不同，更新文本内容
            if (c1 !== c2) {
                // 如果新节点的文本内容和旧节点不同，更新文本内容
                hostSetElementText(el, c2 as string)
            }
        } else {
            // 2. 老节点是数组
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 如果新节点是数组，先卸载旧的子节点
                if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    //diff算法
                    patchKeyedChildren(c1 as Array<vnode>, c2 as Array<vnode>, el) // 比较新旧数组子节点

                } else {
                    unmountChildren(c1 as Array<vnode>) // 卸载旧的子节点
                }
            } else {
                // 3. 老节点是文本
                if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '') // 清空旧的文本内容
                }

                if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    mountChildren(c2 as Array<vnode>, el, parentComponent) // 挂载新节点的子节点
                }
            }
        }
    }


    /**
     * @description 更新元素节点
     * @param n1 旧节点
     * @param n2 新节点
     * @param container 容器
     */
    const patchElement = (n1: vnode, n2: vnode, container: VueTMLElement, parentComponent: ComponentInstance | null) => {
        let el = n2.el = n1.el // 复用旧节点的真实元素
        let oldProps = n1.props || {}
        let newProps = n2.props || {}
        patchProps(oldProps, newProps, el as VueTMLElement) // 更新属性
        patchChildren(n1, n2, el as VueTMLElement, parentComponent) // 更新子节点
    }

    const processText = (n1: vnode | null, n2: vnode, container: VueTMLElement) => {
        if (n1 === null) {
            n2.el = hostCreateText(n2.children as string, container)
            hostInsert(n2.el, container)
        } else {
            n2.el = n1.el
            if (n1.children !== n2.children) {
                hostSetText(n2.el, n2.children as string)
            }
        }
    }


    const processFragment = (n1: vnode | null, n2: vnode, container: VueTMLElement, parentComponent: ComponentInstance | null) => {
        if (n1 === null) {
            mountChildren(n2.children as Array<vnode>, container, parentComponent)
        } else {
            patchChildren(n1, n2, container, parentComponent)
        }
    }

    const updateComponentPreRender = (instance: ComponentInstance, nextVNode: vnode) => {
        instance.next = null
        instance.vnode = nextVNode
        updateProps(instance, instance.props, nextVNode.props)
        // 组件更新的时候 需要更新插槽
        Object.assign(instance.slots, nextVNode.children);
    }

    const renderComponent = (instance: ComponentInstance) => {
        const { render, vnode, proxy, attrs, slots } = instance
        if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            return render?.call(proxy, proxy);
        } else {
            // 此写法 不用使用了，vue3中没有任何性能优化
            const renderFn = vnode.type as Function
            return renderFn(attrs, { slots }); // 函数式组件
        }
    }

    const setupRenderEffect = (instance: ComponentInstance, vnode: vnode, container: VueTMLElement, anchor: HTMLElement | null) => {
        //挂载组件
        const componentUpdateFn = () => {
            const { bm, m } = instance
            if (!instance.isMounted) {
                if (bm) {
                    invokeArrayFns(bm)
                }
                const subTree = renderComponent(instance) //调用组件的render函数，返回虚拟节点
                patch(null, subTree, container, anchor, instance) //递归调用patch函数
                instance.isMounted = true
                instance.subTree = subTree
                if (m) {
                    invokeArrayFns(m)
                }
            } else {
                const { next, bu, u } = instance
                if (next) {
                    updateComponentPreRender(instance, next)
                }
                if (bu) {
                    invokeArrayFns(bu)
                }

                const subTree = renderComponent(instance) //调用组件的render函数，返回虚拟节点
                patch(instance.subTree, subTree, container, anchor, instance) //递归调用patch函数
                instance.subTree = subTree
                if (u) {
                    invokeArrayFns(u)
                }
            }
        }

        const effect = new ReactiveEffect(componentUpdateFn, () => {
            queueJob(update)
        })
        const update = (instance.update = () => effect.run());
        update();
    }


    const mountComponent = (vnode: vnode, container: VueTMLElement, anchor: HTMLElement | null = null, parentComponent: ComponentInstance | null) => {

        //创建组件实例
        const instance = (vnode.component = createComponentInstance(vnode, parentComponent))

        if (isKeepAlive(vnode.type)) {
            instance.ctx.renderer = {
                createElement: hostCreateElement, //创建元素缓存dom
                move(vnode: vnode, container: VueTMLElement, anchor: HTMLElement | null) {
                    hostInsert(vnode.component?.subTree.el, container, anchor)
                },
                unmount(vnode: vnode) {
                    hostRemove(vnode.component!.subTree.el!)
                }
            }
        }

        //给实例属性赋值
        setupComponent(instance)

        //创建effect
        setupRenderEffect(instance, vnode, container, anchor)
    }

    const hasPropsChanged = (oldProps: Record<string | symbol, any> | undefined, newProps: Record<string | symbol, any> | undefined) => {
        let nKeys = Object.keys(newProps || {})
        let oKeys = Object.keys(oldProps || {})
        if (nKeys.length !== oKeys.length) {
            return true
        }

        for (let i = 0; i < nKeys.length; i++) {
            const key = nKeys[i]
            if (newProps![key] !== oldProps![key]) {
                return true
            }
        }

        return false
    }

    const updateProps = (instance: ComponentInstance, preProps: Record<string | symbol, any> | undefined, nextProps: Record<string | symbol, any> | undefined) => {
        if (hasPropsChanged(preProps, nextProps)) {
            for (let key in nextProps) {
                instance.props[key] = nextProps[key]
            }

            for (let key in preProps) {
                if (!(key in nextProps!)) {
                    delete instance.props[key]
                }
            }
        }
    }

    const shouldUpdateComponent = (n1: vnode, n2: vnode) => {
        const { props: preProps, children: prevChildren } = n1
        const { props: nextProps, children: nextChildren } = n2
        if (prevChildren || nextChildren) { // 只要有一个有插槽就一定更新
            return true
        }
        if (preProps === nextProps) {
            return false
        }
        return hasPropsChanged(preProps, nextProps)
    }

    const updateComponent = (n1: vnode, n2: vnode) => {
        const instance = (n2.component = n1.component)! //复用组件实例 核心是为了复用dom
        if (shouldUpdateComponent(n1, n2)) {
            instance.next = n2
            instance.update && instance.update()
        }
    }

    const processComponent = (n1: vnode | null, n2: vnode, container: VueTMLElement, anchor: HTMLElement | null = null, parentComponent: ComponentInstance | null) => {
        if (n1 === null) {
            if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
                //激活组件
                parentComponent?.ctx.activate!(n2, container, anchor)
            } else {
                //挂载组件
                mountComponent(n2, container, anchor, parentComponent)
            }
        } else {
            //更新组件
            updateComponent(n1, n2)
        }
    }

    const patch = (n1: vnode | null, n2: vnode, container: VueTMLElement, anchor: HTMLElement | null = null, parentComponent: ComponentInstance | null = null) => {
        // 这里可以实现虚拟 DOM 的 diff 算法
        // 比较新旧虚拟节点，更新真实 DOM
        if (n1 === n2) return // 如果新旧节点相同，直接返回
        if (n1 && !isSameVnode(n1, n2)) {
            // 如果新旧节点不相同，先卸载旧节点
            unmount(n1)
            n1 = null // 重置 n1 为 null
        }
        const { type, shapeFlag, ref } = n2
        switch (type) {
            case Text:
                processText(n1, n2, container)
                break
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, anchor, parentComponent) // 处理元素节点
                }
                else if (shapeFlag & ShapeFlags.TELEPORT) {
                    const teleportProps = type as TeleportProps
                    teleportProps.process(n1, n2, container, anchor, parentComponent, {
                        mountChildren,
                        patchChildren,
                        //将组件或者dom移动到目标dom容器中
                        move(vnode: vnode, container: VueTMLElement, anchor: HTMLElement | null) {
                            hostInsert(vnode.component ? vnode.component.subTree.el : vnode.el, container, anchor)
                        },
                    })
                }
                else if (shapeFlag & ShapeFlags.COMPONENT) {
                    //处理组件
                    processComponent(n1, n2, container, anchor, parentComponent)
                }
        }

        if (ref) {
            setRef(ref, n2)
        }

    }

    function setRef(ref: any, vnode: vnode) {
        let value = vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT ? (vnode.component?.exposed || vnode.component?.proxy) : vnode.el
        if (isRef(ref)) {
            ref.value = value
        }
    }

    const unmount = (vnode: vnode) => {
        const performRemove = () => {
            hostRemove(vnode.el!)
        }
        if (vnode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
            //停用组件
            const parentComponent = vnode.component?.parent
            parentComponent?.ctx.deactivate!(vnode)
        }
        else if (vnode.type === Fragment) {
            return unmountChildren(vnode.children as Array<vnode>)
        }
        else if (vnode.shapeFlag & ShapeFlags.COMPONENT) {
            return unmount(vnode.component!.subTree!)
        }
        else if (vnode.shapeFlag & ShapeFlags.TELEPORT) {
            const teleportProps = vnode.type as TeleportProps
            teleportProps.remove(vnode, unmountChildren)
        }
        else {
            performRemove()
        }
    }

    // 渲染函数 将虚拟节点渲染到真实 DOM 上
    const render = (vnode: vnode | null, container: VueTMLElement, parentComponent: ComponentInstance | null) => {
        if (vnode === null) {
            if (container._vnode) {
                unmount(container._vnode)
            }
        } else {
            patch(container._vnode || null, vnode, container, null, parentComponent)
            container._vnode = vnode // 保存当前容器的虚拟节点
        }
    }

    return {
        render
    }
}