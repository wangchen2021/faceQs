/**
 * 
 * @link https://leetcode.cn/problems/regular-expression-matching/
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {
    const slen = s.length
    const plen = p.length
    const resArr = Array.from({ length: slen + 1 }, () => Array(plen + 1).fill(false))
    resArr[0][0] = true

    for (let si = 0; si <= slen; si++) {
        for (let pi = 1; pi <= plen; pi++) { //如果s>0 p=0不可能匹配 所以从p=1 s=0开始
            if (p.charAt(pi - 1) === "*") {
                resArr[si][pi] = resArr[si][pi - 2]
                if (testMatch(si, pi - 1)) {
                    resArr[si][pi] = resArr[si - 1][pi] || resArr[si][pi - 2]
                }
            } else {
                if (testMatch(si, pi)) {
                    resArr[si][pi] = resArr[si - 1][pi - 1]
                }
            }
        }
    }

    function testMatch(si, pi) { //匹配单个字符
        const value = s.charAt(si - 1)
        const mode = p.charAt(pi - 1)
        if (si === 0) return false
        if (mode === ".") return true
        return Boolean(value === mode)
    }

    console.log(resArr);

    return resArr[slen][plen]
};

console.log(isMatch("aa", "a*"));
