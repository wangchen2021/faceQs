/**
 * @link https://leetcode.cn/problems/string-to-integer-atoi/
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
    let resStr = ""
    let i = 0
    let symbol = 1
    //空格：读入字符串并丢弃无用的前导空格（" "）
    s = s.trimStart()
    //检查下一个字符（假设还未到字符末尾）为 '-' 还是 '+'。如果两者都不存在，则假定结果为正
    if (s.charAt(0) === "-") {
        symbol = -1
        i++
    } else if (s.charAt(0) === "+") {
        symbol = 1
        i++
    }

    // 通过跳过前置零来读取该整数，直到遇到非数字字符或到达字符串的结尾。如果没有读取数字，则结果为0。
    while ((s.charAt(i) === "0" || s.charAt(i) === " ") && i < s.length) {
        i++
    }

    if (i === s.length) return 0;

    // 如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] 
    const leftLimit = -Math.pow(2, 31)
    const rightLimit = Math.pow(2, 31) - 1
    for (let p = i; p < s.length; p++) {
        const target = s.charAt(p)
        if (Number.isNaN(Number(target))) {
            break
        }
        resStr += target
    }
    let res = Number(resStr) * symbol
    if (res > rightLimit) res = rightLimit
    else if (res < leftLimit) res = leftLimit
    return res
};

console.log(myAtoi("   +0 123"));
