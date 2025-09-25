/**
 * @link https://leetcode.cn/problems/integer-to-roman/
 * @param {number} num
 * @return {string}
 */
var intToRoman = function (num) {
    const RomanRecord = {
        1: "I",
        4: "IV",
        5: "V",
        9: "IX",
        10: "X",
        40: "XL",
        50: "L",
        90: "XC",
        100: "C",
        400: "CD",
        500: "D",
        900: "CM",
        1000: "M"
    }
    const unit = Object.keys(RomanRecord).reverse()
    let res = ""
    let i = 0
    while (num > 0) {
        const value = unit[i]
        if (value > num) {
            i++
            continue
        }
        num = num - value
        res = res + RomanRecord[value]
    }
    return res
};

console.log(intToRoman(1994));
