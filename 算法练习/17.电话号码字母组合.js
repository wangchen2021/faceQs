/**
 * @link https://leetcode.cn/problems/letter-combinations-of-a-phone-number/description/
 */

/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {

    if (digits.length === 0) return []

    let res = []

    const digitsMap = {
        "2": "abc",
        "3": "def",
        "4": "ghi",
        "5": "jkl",
        "6": "mno",
        "7": "pqrs",
        "8": "tuv",
        "9": "wxyz"
    }
    const gropStrs = []
    const len = digits.length

    for (let i = 0; i < len; i++) {
        gropStrs.push(digitsMap[digits.charAt(i)])
    }

    function dfs(floor, path) {
        if (floor === len) {
            res.push(path)
            return
        }
        const floorStr = gropStrs[floor]
        const prePath = path
        for (let i = 0; i < floorStr.length; i++) {
            path = path + floorStr.charAt(i)
            dfs(floor + 1, path)
            path = prePath
        }
    }

    dfs(0, "")

    return res

};

console.log(letterCombinations("234"));
