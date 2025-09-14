/**
 * @link https://leetcode.cn/problems/merge-k-sorted-lists/
 */

import { ListNode, toListNode, showListNodeRes } from "./common.js";

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
    let head = new ListNode(-Infinity)
    for (let list of lists) {
        head = mergeTwoLists(head, list)
        showListNodeRes(head)
    }
    function mergeTwoLists(l1, l2) {
        let head = new ListNode()
        let res = head
        while (l1 && l2) {
            if (l1.val <= l2.val) {
                head.next = l1
                l1 = l1.next
                head = head.next
            } else {
                head.next = l2
                l2 = l2.next
                head = head.next
            }
        }
        while (l1) {
            head.next = l1
            l1 = l1.next
            head = head.next
        }
        while (l2) {
            head.next = l2
            l2 = l2.next
            head = head.next
        }
        return res.next
    }
    return head.next
};

showListNodeRes(mergeKLists([toListNode([2]), toListNode([]), toListNode([-1])]));
