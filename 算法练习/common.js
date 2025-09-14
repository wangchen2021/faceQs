export class ListNode {

    next = undefined
    val = undefined

    constructor(val, next) {
        this.val = val
        this.next = next
    }


    get val() {
        return this.val === undefined ? 0 : this.val
    }

    get next() {
        return this.next === undefined ? null : this.next
    }

}

export function toListNode(arr) {
    let head = new ListNode()
    let res = head
    for (let item of arr) {
        head.next = new ListNode(item)
        head = head.next
    }
    return res.next
}

export function showListNodeRes(list) {
    let res = []
    while (list) {
        if (list.val) res.push(list.val)
        list = list.next
    }
    return console.log(res);
}