/**
 * 
 * @link https://leetcode.cn/problems/powx-n/
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
    if (n === 0) return 1
    let res = 1
    function getRes(n) {
        let base = 1
        while (n > 0) {
            base = base * x
            res = res * base
            n = n >> 1
        }
        return res
    }
    return n >= 0 ? getRes(n) : 1 / getRes(-n)
};

console.log(myPow(2, 2));
