/**
 * @link https://leetcode.cn/problems/longest-common-prefix/
 */

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    let refer = strs[0]
    while (refer && refer.length > 0) {
        for (let i = 0; i < strs.length; i++) {
            if (!strs[i].startsWith(refer)) {
                break
            } else {
                if (i === strs.length - 1) {
                    return refer
                }
            }
        }
        refer = refer.slice(0, refer.length - 1)
    }
    return ""
}
console.log(longestCommonPrefix(str));



