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
    let preHead = head
    let endHead = head

    for (let i = 0; i < n - 1; i++) {
        endHead = endHead.next
        if (!endHead) return head // n大于总长度
    }

    //删除首个 无法记录pre
    endHead = endHead.next
    if (!endHead) return head.next

    while (endHead && endHead.next) {
        endHead = endHead.next
        preHead = preHead.next
    }

    preHead.next = preHead.next.next
    return head
};