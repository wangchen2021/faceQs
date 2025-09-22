/**
 * @link https://leetcode.cn/problems/zigzag-conversion/
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
    if(numRows===1) return s
    let l = 0
    let next = true
    let resArr = Array.from({ length: numRows }, () => [])
    for (let i = 0; i < s.length; i++) {
        resArr[l].push(s.charAt(i))
        if (next) {
            if (l < numRows - 1) {
                l++
            } else {
                next = false
                l--
            }
        } else {
            if (l > 0) {
                l--
            } else {
                next = true
                l++
            }
        }
    }
    let res = ""
    for (let item of resArr) {
        res += item.join("")
    }
    return res
};

console.log(convert("PAYPALISHIRING",3));
