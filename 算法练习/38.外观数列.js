/**
 * @link https://leetcode.cn/problems/count-and-say/
 */

/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function (n) {

    let res = "1"
    
    for (let i = 1; i < n; i++) {
        res = getCountStr(res)
    }

    function getCountStr(str) {
        let countStr = ""
        let temTarget = ""
        let temTargetTimes = 0
        for (let i = 0; i < str.length; i++) {
            const target = str.charAt(i)
            if (target === temTarget) {
                temTargetTimes++
            } else {
                if (i > 0) countStr = countStr + `${temTargetTimes}${temTarget}`
                temTarget = target
                temTargetTimes = 1
            }
        }
        countStr = countStr + `${temTargetTimes}${temTarget}`
        return countStr
    }

    return res
};

console.log(countAndSay(4));
