/**
 * @link https://leetcode.cn/problems/integer-to-roman/description/
 */

/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function (num) {

    let res = ""

    const Roman = {
        1: "I",
        5: "V",
        10: "X",
        50: "L",
        100: "C",
        500: "D",
        1000: "M"
    }

    let remain = num

    Object.keys(Roman).reverse().forEach((key) => {
        const times = Math.floor(remain / key)
        res = getTimesStr(res, Roman[key], times)
        remain = remain % key
        const remainStr = remain.toString()
        if (remainStr.startsWith("9")) {
            const power = remainStr.length
            remain = remain - 0.9 * Math.pow(10, power)
            res = res + Roman[Math.pow(10, power - 1)] + Roman[Math.pow(10, power)]
        }
        else if (remainStr.startsWith("4")) {
            const power = remainStr.length
            remain = remain - 0.4 * Math.pow(10, power)
            res = res + Roman[Math.pow(10, power - 1)] + Roman[0.5 * Math.pow(10, power)]
        }
    })

    function getTimesStr(res, str, times) {
        for (let i = 0; i < times; i++) {
            res = res + str
        }
        return res
    }

    return res

};

console.log(intToRoman(3749));
