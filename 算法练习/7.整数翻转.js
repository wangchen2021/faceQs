/**
 * 
 * @link https://leetcode.cn/problems/reverse-integer/
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
    let pow = 1
    if (x < 0) {
        pow = -1
        x = -x
    }
    let res = pow * Number(x.toString().split("").reverse().join(""))
    if (res > Math.pow(2, 31) - 1 || res < -Math.pow(2, 31)) res = 0
    return res
};