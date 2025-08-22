import { patchAttr } from "./modules/patchAttr"
import { patchClass } from "./modules/patchClass"
import { patchEvent } from "./modules/patchEvent"
import { patchStyle } from "./modules/patchStyle"

//元素属性操作
export default function patchProp(el: VueTMLElement, key: string, prevValue: any, nextValue: any) {

    if (key === 'class') {
        return patchClass(el, nextValue)
    }

    else if (key === 'style') {
        return patchStyle(el, prevValue, nextValue)
    }

    else if (key.startsWith('on')) {
        //事件
        return patchEvent(el, key, nextValue)
    }

    else {
        return patchAttr(el, key, nextValue)
    }
    
}





