/**
 * @link https://leetcode.cn/problems/multiply-strings/
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function (num1, num2) {

    if (num1 === "0" || num2 === "0") return "0"


    let res = ""
    let power1 = ""
    let power2 = ""
    const resArr = []
    for (let j = num1.length - 1; j >= 0; j--) {
        const target1 = num1.charAt(j)
        for (let i = num2.length - 1; i >= 0; i--) {
            const target2 = num2.charAt(i)
            resArr.push(Number(target1) * Number(target2) + power1 + power2)
            power2 += "0"
        }
        power1 += "0"
        power2 = ""
    }
    let upBit = 0
    const maxLength = resArr[resArr.length - 1].length
    for (let i = 0; i < maxLength; i++) {
        let sum = 0
        let bit = 0
        for (let item of resArr) {
            const target = item[item.length - i - 1] ? item[item.length - i - 1] : 0
            sum += Number(target)
        }
        sum += upBit
        if (sum >= 10) {
            upBit = Math.floor(sum / 10)
            bit = sum % 10
        } else {
            upBit = 0
            bit = sum
        }
        res = bit + res
    }
    if (upBit === 1) res = 1 + res
    return res
};

console.log(multiply("2", "3"));
