export * from '@vue/reactivity'
import { nodeOps } from "./nodeOps"
import patchProp from "./patchProp"
import { createRenderer } from "@vue/runtime-core"

const renderOptions = Object.assign({ patchProp }, nodeOps)

export const render = (vnode: vnode, container: VueTMLElement) => {
    return createRenderer(renderOptions).render(vnode, container)
}

export * from "@vue/runtime-core"