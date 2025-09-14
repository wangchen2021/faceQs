/**
 * @link https://leetcode.cn/problems/divide-two-integers/
 */

/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
var divide = function (dividend, divisor) {

    let power = 1
    let res = 0
    const leftLimit = Math.pow(-2, 31)
    const rightLimit = Math.pow(2, 31) - 1

    //计算结果符号 两个参数同号正数
    if (dividend < 0) {
        power = -power
        dividend = -dividend
    }
    if (divisor < 0) {
        power = -power
        divisor = -divisor
    }

    while (dividend >= divisor) {

        let dividendLength = dividend.toString().length
        let divisorLength = divisor.toString().length
        const tenPower = dividendLength - divisorLength - 1

        if (tenPower <= 0) {
            dividend = dividend - divisor
            res = res + 1
        } else {
            const tenPowerZeros = new Array(tenPower).fill(0).join("");
            dividend = dividend - Number(divisor.toString() + tenPowerZeros)
            res = res + Math.pow(10, tenPower)
        }
    }

    res = res * power

    if (res < leftLimit) res = leftLimit
    else if (res > rightLimit) res = rightLimit

    return res

};

console.log(divide(100, 3));
