/**
 * @link https://leetcode.cn/problems/reverse-nodes-in-k-group/
 */

import { ListNode, showListNodeRes, toListNode } from "./common.js";
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
// var reverseKGroup = function (head, k) {

//     let res = new ListNode()
//     let resP = res

//     let tempList = new ListNode()
//     let p = tempList

//     let times = 0

//     while (head) {
//         p.next = head
//         times++
//         p = p.next
//         head = head.next
//         if (times === k) {
//             p.next = null
//             let reverseList = reverseListNode(tempList.next)
//             resP.next = reverseList
//             resP = tempList.next
//             //reset
//             tempList = new ListNode()
//             p = tempList
//             times = 0
//         }
//     }

//     resP.next = tempList.next


//     function reverseListNode(list) {
//         let res = new ListNode()
//         let p = res
//         p.next = list //0->1
//         while (list.next) {
//             let end = list.next.next
//             list.next.next = p.next
//             p.next = list.next
//             list.next = end
//         }
//         return res.next
//     }

//     return res.next

// };


// 几种情况
// 1. 不够k 返回head
// 2. 够K 翻转
var reverseKGroup = (head, k) => {

    let pre = null
    let cur = head
    let p = head

    for (let i = 0; i < k; i++) {
        if (p === null) return head
        p = p.next
    }

    for (let i = 0; i < k; i++) {
        let next = cur.next
        cur.next = pre
        pre = cur
        cur = next
    }

    head.next = reverseKGroup(cur, k)

    return pre

}

showListNodeRes(reverseKGroup(toListNode([1, 2, 3, 4, 5]), 2))