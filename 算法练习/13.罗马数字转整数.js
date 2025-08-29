/**
 * @link https://leetcode.cn/problems/roman-to-integer/
 */

/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
    let res = 0
    let numArray = []
    const Roman = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    }
    for (let i = 0; i < s.length; i++) {
        const str = s.charAt(i)
        numArray.push(Roman[str])
    }


    while (numArray.length > 0) {
        if (numArray.length === 1) {
            res = res + numArray[0]
            break
        }
        else {
            if (numArray[0] >= numArray[1]) {
                res = res + numArray[0]
                numArray.shift()
            } else {
                res = res + numArray[1] - numArray[0]
                numArray.shift()
                numArray.shift()
            }
        }
    }
    return res
};

console.log(romanToInt("MCMXCIV"));

