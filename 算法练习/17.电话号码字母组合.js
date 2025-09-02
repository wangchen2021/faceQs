/**
 * @link https://leetcode.cn/problems/letter-combinations-of-a-phone-number/description/
 */

/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {

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


    for (let i = 0; i < digits.length; i++) {
        gropStrs.push(digitsMap[digits.charAt(i)])
    }

    for (let i = 0; i < gropStrs.length; i++) {
        const targetStrs = gropStrs[i]
        res = strGruops(targetStrs, res)
    }

    function strGruops(targetStrs, res = []) {

        let groupRes = []
        for (let j = 0; j < targetStrs.length; j++) {
            if (res.length > 0) {
                for (let p = 0; p < res.length; p++) {
                    groupRes.push(res[p] + targetStrs[j])
                }
            } else {
                groupRes.push(targetStrs[j])
            }

        }
        return groupRes
    }

    return res

};

console.log(letterCombinations("234"));
