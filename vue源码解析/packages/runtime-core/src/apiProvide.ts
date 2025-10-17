import { currentInstance } from "./component";

export function provide(key: string | symbol, value: any) {
    if (!currentInstance) return
    const parentProvides = currentInstance.parent?.provides
    let provides = currentInstance.provides
    if (parentProvides === provides) {
        //如果在子组件新增provide，需要拷贝一份全新的
        provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
}

export function inject(key: string | symbol, defaultValue?: any) {
    if (!currentInstance) return
    const provides = currentInstance.parent?.provides //读父亲的不读自己的
    if (provides && key in provides) {
        return provides[key]
    } else {
        return defaultValue
    }
}