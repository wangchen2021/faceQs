/**
 * @link https://leetcode.cn/problems/merge-two-sorted-lists/
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
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    let pre = new ListNode()
    let p = pre
    while (list1 || list2) {
        if (!list1) {
            p.next = list2
            list2 = list2.next
        } else if (!list2) {
            p.next = list1
            list1 = list1.next
        } else {
            if (list1.val > list2.val) {
                p.next = list2
                list2 = list2.next
            } else {
                p.next = list1
                list1 = list1.next
            }
        }
        p = p.next
    }
    return pre.next
};