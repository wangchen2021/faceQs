export function patchAttr(el: VueTMLElement, key: string, nextValue: any) {
    if (key === "ref") return
    if (nextValue == null) {
        el.removeAttribute(key)
    } else {
        el.setAttribute(key, nextValue)
    }
}