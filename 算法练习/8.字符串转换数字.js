// 请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数。

// 函数 myAtoi(string s) 的算法如下：

// 空格：读入字符串并丢弃无用的前导空格（" "）
// 符号：检查下一个字符（假设还未到字符末尾）为 '-' 还是 '+'。如果两者都不存在，则假定结果为正。
// 转换：通过跳过前置零来读取该整数，直到遇到非数字字符或到达字符串的结尾。如果没有读取数字，则结果为0。
// 舍入：如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被舍入为 −231 ，大于 231 − 1 的整数应该被舍入为 231 − 1 。
// 返回整数作为最终结果。
https://leetcode.cn/problems/string-to-integer-atoi/description/

/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {

    function processStr(s) {
        //去掉所有前置空格
        s = s.trimStart()
        //检测第一位是否是符号
        if (s.charAt(0) === '+') {
            return {
                str: s.slice(1),
                power: 1
            }
        } else if (s.charAt(0) === "-") {
            return {
                str: s.slice(1),
                power: -1
            }
        } else {
            return {
                str: s,
                power: 1
            }
        }
    }


    function getStrNum(str, power) {
        //去掉前置0
        while (str.startsWith("0")) {
            str = str.slice(1)
        }
        const leftLimit = Math.pow(-2, 31)
        const rightLimit = Math.pow(2, 31) - 1
        let resStr = ""
        for (let i = 0; i < str.length; i++) {
            let strValue = str[i]
            let value = strValue === " " ? NaN : Number(strValue)
            if (Number.isNaN(value)) {
                break
            }
            else {
                resStr = resStr + strValue
            }
        }
        let res = resStr.length > 0 ? Number(resStr) * power : 0
        if (res < leftLimit) {
            res = leftLimit
        } else if (res > rightLimit) {
            res = rightLimit
        }
        return res
    }

    const { str, power } = processStr(s)
    return getStrNum(str, power)
};

console.log(myAtoi("   +0 123"));