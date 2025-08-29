/**
 * @link https://leetcode.cn/problems/longest-common-prefix/
 */

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    const length = strs.length
    if (length === 1) return strs[0]
    let res = ""
    let firstStr = strs[0]
    for (let i = 0; i < firstStr.length; i++) {
        const refer = firstStr.charAt(i)
        const newLength = strs.filter((item) => {
            return item.startsWith(res + refer)
        }).length
        if (length != newLength) break
        res = res + refer
    }
    return res
}

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
