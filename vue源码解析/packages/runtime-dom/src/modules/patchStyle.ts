export function patchStyle(el: VueTMLElement, prevValue: any, nextValue: any) {
    let style = el.style
    for (const key in nextValue) {
        (style as any)[key] = nextValue[key]
    }
    //移除旧的删除的样式
    if (prevValue) {
        for (const key in prevValue) {
            if (nextValue && nextValue[key] == null) {
                (style as any)[key] = ''
            }
        }
    }
}