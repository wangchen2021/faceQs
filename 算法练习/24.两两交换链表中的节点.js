/**
 * @link https://leetcode.cn/problems/swap-nodes-in-pairs/
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
 * @return {ListNode}
 */
var swapPairs = function (head) {
    let res = new ListNode()
    let p = res
    if (!head || !head.next) return head
    while (head && head.next) {
        p.next = head.next  // L -> 2
        head.next = head.next.next //  1 -> 3
        p.next.next = head // 2 -> 1
        p = head  // p = 1
        head = head.next // head = 3
    }
    return res.next
};