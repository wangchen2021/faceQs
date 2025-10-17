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
    let pre = lists[0]

    function mergeTwoLists(l1, l2) {
        let pre = new ListNode()
        let p = pre
        while (l1 && l2) {
            if (l1.val > l2.val) {
                p.next = l2
                l2 = l2.next
            } else {
                p.next = l1
                l1 = l1.next
            }
            p = p.next
        }
        p.next = l1 || l2
        return pre.next
    }

    function merge(left,ritht){
        if(left===ritht) return lists[left]
        if(left>ritht) return null
        const mid= (left+ritht)>>1
        return mergeTwoLists(merge(left,mid),merge(mid+1,ritht)) 
    }

    return merge(0,lists.length-1)

};

showListNodeRes(mergeKLists([toListNode([2]), toListNode([]), toListNode([-1])]));
