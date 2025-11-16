export default class LinkList {
    val: any
    next: null | LinkList

    constructor(val: any = null, next: LinkList | null = null) {
        this.val = val
        this.next = next
    }

    insertEnd(val: any) {
        let p = this
        while (p.next) {
            p = p.next as any
        }
        p.next = new LinkList(val)
        return this
    }

    insertStart(val: any) {
        const next = new LinkList(this.val, this.next)
        this.val = val
        this.next = next
        return this
    }

    insert(val: any, index: number) {
        const valNode = new LinkList(val)
        if (index === 0) {
            this.insertStart(val)
        } else {
            let pre = new LinkList()
            let p = this
            while (p && index > 0) {
                pre = p
                p = p.next as any
                index--
            }
            if (index === 0) {
                pre.next = valNode
                valNode.next = p
            } else {
                this.insertEnd(val)
            }
        }
        return this
    }

    removeAt(index: number) {
        if (index === 0) {
            this.removeStart
        }
        else {
            let pre = null as any
            let p = this
            while (p && index > 0) {
                index--
                pre = p
                p = p.next as any
            }
            if (index === 0) {
                if (!p.next) {
                    pre.next = null
                } else {
                    pre.next = p.next
                }
            }
        }
        return this
    }

    removeStart() {
        const next = this.next
        if (!next) {
            return null
        } else {
            this.val = next.val
            this.next = next.next
        }
        return this
    }

    reserve() {
        let pre = null
        let cur = this
        while (cur) {
            const next = cur.next
            cur.next = pre
            pre = cur
            cur = next as any
        }
        return pre
    }

    static from(arr: any[]): LinkList {
        const pre = new LinkList()
        if (arr.length === 0) return pre
        let p = pre
        for (let item of arr) {
            p.next = new LinkList(item)
            p = p.next
        }
        return pre.next as LinkList
    }

    static printList(list: LinkList | null) {
        let res = []
        while (list) {
            res.push(list.val)
            list = list.next as LinkList
        }
        return console.log(res);
    }
}

