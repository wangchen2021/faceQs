//对节点元素的操作
export const nodeOps = {

    insert(el: Element, parent: Element, anchor = null) {
        //   newNode 要插入的新节点
        //   referenceNode	插入到这个节点之前；如果为 null，则插入到 parentNode 的末尾（相当于 appendChild）
        parent.insertBefore(el, anchor)
    },

    remove(el: Element) {
        const parent = el.parentNode
        if (parent) {
            parent.removeChild(el)
        }
    },

    createElement(type: string) {
        return document.createElement(type)
    },

    setText(node: Text, text: string) {
        node.nodeValue = text
    },

    setElementText(el: Element, text: string) {
        el.textContent = text
    },

    parentNode(node: Node) {
        return node.parentNode
    },

    nextSibling(node: Node) {
        return node.nextSibling
    },

}