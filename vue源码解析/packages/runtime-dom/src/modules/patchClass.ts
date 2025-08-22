export function patchClass(el: VueTMLElement, value: any) {
    if (value == null) {
        el.removeAttribute('class')
    } else {
        el.className = value
    }
}