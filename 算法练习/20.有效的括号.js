/**
 * @link https://leetcode.cn/problems/valid-parentheses/
 */

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    const map = {
        "{": "}",
        "(": ")",
        "[": "]"
    }
    let buffer = []
    let keys = Object.keys(map)
    let values = Object.values(map)
    for (let i = 0; i < s.length; i++) {
        const target = s.charAt(i)
        if (keys.includes(target) && i !== s.length - 1) {
            //左括号且不为最后一项
            buffer.push(target)
        } else if (values.includes(target)) {
            //右括号
            const key = buffer.pop()
            if (key && map[key] === target) {
                continue
            } else {
                return false
            }
        } else {
            //都不是
            return false
        }
    }
    if (buffer.length === 0)
        return true
    else
        return false
};

console.log(isValid("([])"));
