/**
 * @link https://leetcode.cn/problems/wildcard-matching/
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */

/**
 * 遇到*之前 正常判断
 * 1. 遇到si=a 要求pi=a
 * 2. 遇到si=? s和p同时后移继续
 * 遇到*之后 递归寻找*后的函数
 * 寻找*后的函数表现为 传入*后的p 传入si后s
 * si后移 找到符合*后串的 
 */
var isMatch = function (s, p) {
    let res = true
    function findMatch(si, pi) {
        
    }
    return res
};

console.log(isMatch("acdcb", "a*c?b"));
