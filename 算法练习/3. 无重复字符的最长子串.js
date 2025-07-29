// 示例 1:

// 输入: s = "abcabcbb"
// 输出: 3 
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
// 示例 2:

// 输入: s = "bbbbb"
// 输出: 1
// 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
// 示例 3:

// 输入: s = "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
//      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

// https://leetcode.cn/problems/longest-substring-without-repeating-characters/

// /**
//  * @param {string} s
//  * @return {number}
//  */
// var lengthOfLongestSubstring = function (s) {
//     if (s.length <= 1) return s.length
//     let head = 0
//     let tail = 0
//     let res = 1
//     while (head < s.length) {
//         tail = head + 1
//         while (tail < s.length) {
//             const subStr = s.substring(head, tail)
//             if (subStr.includes(s.charAt(tail))) {
//                 break
//             }
//             res = res > subStr.length + 1 ? res : subStr.length + 1
//             if (tail === s.length - 1) {
//                 return res
//             }
//             tail++
//         }
//         head++
//     }
//     return res
// };

// console.log(lengthOfLongestSubstring("abcabcbb"));

//双指针暴力法


/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    const map = new Map()
    let res = 0
    let pre = 0
    for (let i = 0; i < s.length; i++) {
        const value = s.charAt(i)
        pre = Math.max(pre, map.get(value) || 0)
        res = Math.max(res, i + 1 - pre)
        map.set(value, i + 1)
    }
    return res
};

console.log(lengthOfLongestSubstring("abcabcbb"));


//哈希表解法