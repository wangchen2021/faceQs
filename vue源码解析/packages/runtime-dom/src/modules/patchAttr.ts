export function patchAttr(el: VueTMLElement, key: string, nextValue: any) {
    if (nextValue == null) {
        el.removeAttribute(key)
    } else {
        el.setAttribute(key, nextValue)
    }
}