// 示例 1：

// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。
// 示例 2：

// 输入：s = "cbbd"
// 输出："bb"

// https://leetcode.cn/problems/longest-palindromic-substring/description/

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    if (s.length <= 1) return s
    let res = ""
    function centerStr(s, index) {
        let head = index
        let tail = index + 1
        let res = ""
        while (tail >= 0 && head < s.length) {
            if (s.charAt(tail) === s.charAt(head)) {
                res = s.charAt(tail) + res + s.charAt(tail)
            } else {
                break
            }
            tail--
            head++
        }
        return res
    }
    for (let i = 0; i < s.length; i++) {
        const targetStr = centerStr(s, i)
        res = res.length > targetStr.length ? res : targetStr
    }
    return res
};


console.log(longestPalindrome("babad"));
