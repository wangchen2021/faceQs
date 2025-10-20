import { ShapeFlags } from "@vue/shared"
import { onMounted, onUpdated } from "../apiLifecycle"
import { getCurrentInstance } from "../component"

export const KeepAlive = {
    __isKeepAlive: true,
    props: {
        max: Number
    },
    setup(props: any, { slots }: any) {
        const keys = new Set<string | number>()
        const cachedVnodes = new Map<string | number, vnode>()
        let paddingKey: string | number | null = null
        const instance = getCurrentInstance() as ComponentInstance

        const cacheSubTree = () => {
            cachedVnodes.set(paddingKey as string | number, instance?.subTree)
        }

        const { move, createElement, unmount: _unmount } = instance.ctx.renderer

        //keep-alive组件特有初始化方法
        instance.ctx.activate = function (vnode: vnode, container: VueTMLElement, anchor: HTMLElement | null) {
            move(vnode, container, anchor)
        }

        const storageContainer = createElement('div')
        instance.ctx.deactivate = function (vnode: vnode) {
            move(vnode, storageContainer, null) //移动到隐藏的容器中
        }

        onMounted(cacheSubTree)

        onUpdated(cacheSubTree)

        function unmount(vnode: vnode) {
            //恢复标识位
            let shapeFlag = vnode.shapeFlag
            if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
                shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE
            }
            if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
                shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
            }
            vnode.shapeFlag = shapeFlag
            _unmount(vnode)
            cachedVnodes.delete(vnode.key!)
        }

        function parneCacheEntry(firstKey: string | number) {
            keys.delete(firstKey)
            const cacheVnode = cachedVnodes.get(firstKey)
            unmount(cacheVnode!)
        }

        return () => {
            const vnode = slots.default()
            const key = vnode.key == null ? vnode.type : vnode.key
            const cacheVnode = cachedVnodes.get(key)
            paddingKey = key
            if (cacheVnode) {
                vnode.component = cacheVnode.component //复用组件实例
                vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE //标记为缓存节点 不做初始化操作
                keys.delete(key)
                keys.add(key) //lru算法 更新key顺序
            } else {
                keys.add(key)
                if (props.max && keys.size > props.max) { //超过最大缓存数量
                    parneCacheEntry(keys.values().next().value as string | number)
                }
            }
            vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE //标记为keep-alive组件
            return vnode //等待组件加载完毕缓存
        }
    }
}



export const isKeepAlive = (type: any) => {
    return type && type.__isKeepAlive
}