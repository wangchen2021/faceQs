

function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}


export class ListNode {
    
    next = undefined
    val = undefined

    constructor(val) {
        this.val = val
    }


    get val() {
        return this.val === undefined ? 0 : this.val
    }

    get next() {
        return this.next === undefined ? null : this.next
    }

}