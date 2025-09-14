/**
 * @link https://leetcode.cn/problems/longest-valid-parentheses/
 */

/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
    //动态规划
    //"()" res[i]=res[i-1]+2
    //"))" if s[i-res[i-1]-1]="("  res[i]=2+res[i-1]+res[i-res[i-1]-2]
    //")(" 0
    //"((" 0
    if (s.length < 2) return 0
    let res = new Array(s.length).fill(0)
    for (let i = 0; i < s.length; i++) {
        if (s.charAt(i) === ")") {
            if (s.charAt(i - 1) === "(") {
                res[i] = (res[i - 2] ? res[i - 2] : 0) + 2
            }
            else if (s.charAt(i - 1) === ")" && s.charAt(i - res[i - 1] - 1) === "(") {
                res[i] = 2 + res[i - 1] + (res[i - res[i - 1] - 2]?res[i - res[i - 1] - 2]:0)
            }
        }
    }
    console.log(res);
    return Math.max(...res)
};

console.log(longestValidParentheses("(()())"));
