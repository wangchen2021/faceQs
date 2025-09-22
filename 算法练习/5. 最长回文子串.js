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
    //动态规划
    //len=1 p(0,0) true
    //len=2 p(0,1) Boolean(s0==s1)
    //p(i,j) si===sj&&P(i+1,j-1) 中心扩散 扩散终止条件 s1!===sj

    const len = s.length
    if (len < 2) return s

    let maxLength = 1
    let start = 0

    const p = Array.from({length:len},()=>Array(len).fill(false))
    
    for (let i = 0; i < p.length; i++) {
        p[i][i] = true
    }

    for (let L = 2; L <= len; L++) {
        for (let i = 0; i < len; i++) {
            const j = L + i - 1
            if (j >= len) break
            if (s.charAt(i) !== s.charAt(j)) {
                p[i][j] = false
            } else {
                p[i][j] = L <= 3 ? true : p[i + 1][j - 1]
            }
            if (p[i][j] && L > maxLength) {
                start = i
                maxLength = L
            }
        }
    }

    return s.substring(start, start + maxLength)

};


console.log(longestPalindrome("bb"));

