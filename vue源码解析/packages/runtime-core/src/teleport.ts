import { ShapeFlags } from "@vue/shared"

export const Teleport: TeleportProps = {
    __isTeleport: true,
    process(n1: vnode, n2: vnode, container: VueComponent, anchor: HTMLElement | null, parentComponent: ComponentInstance | null, internals: any) {
        const { mountChildren, patchChildren, move } = internals
        if (!n1) { //挂载
            const target = n2.props?.to //目标容器
            const targetElement = typeof target === 'string' ? document.querySelector(target) : target
            if (targetElement) {
                n2.target = targetElement
                mountChildren(n2.children, targetElement as VueTMLElement, anchor)
            }
        } else {
            patchChildren(n1, n2, n2.target, parentComponent)
            if (n2.props?.to !== n1.props?.to) {
                const newTarget = n2.props?.to
                const newTargetElement = typeof newTarget === 'string' ? document.querySelector(newTarget) : newTarget
                if (newTargetElement) {
                    n2.target = newTargetElement
                    const children = n2.children as Array<vnode>
                    children.forEach((child: any) => {
                        move(child, newTargetElement as VueTMLElement, anchor)
                    })
                }
            }
        }

    },
    remove(vnode: vnode, unmountChildren: Function) {
        const {shapeFlag,children} = vnode
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            unmountChildren(children as Array<vnode>)
        }
    }
}

export const isTeleport = (type: any) => {
    return type && type.__isTeleport
}