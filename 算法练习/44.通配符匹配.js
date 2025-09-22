/**
 * @link https://leetcode.cn/problems/wildcard-matching/
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {

    let res = false
    let end = false

    function checkSP(si, pi) {

        const mode = p.charAt(pi) ? p.charAt(pi) : ""
        const value = s.charAt(si) ? s.charAt(pi) : ""

        if (mode === "?" || mode === value) {
            checkSP(si + 1, pi + 1)
        } else if (mode === "*") {
            for (let i = si; i < s.length; i++) {
                checkSP(i, pi + 1)
                if (end) return
            }
        }
    }

    checkSP(0, 0)

    return res
};

