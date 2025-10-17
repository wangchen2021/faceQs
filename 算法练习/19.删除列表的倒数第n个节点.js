/**
 * @link https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/
 */

import { ListNode } from "./common";

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    let origin = new ListNode(0, head)
    let pre = origin
    let cur = origin
    for (let i = 0; i < n; i++) {
        cur = cur.next
        if (!cur) return origin.next
    }
    while (cur.next) {
        cur = cur.next
        pre = pre.next
    }
    pre.next = pre.next.next

    return origin.next

};