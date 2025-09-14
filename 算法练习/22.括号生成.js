/**
 * @link https://leetcode.cn/problems/generate-parentheses/
 */

// /**
//  * @param {number} n
//  * @return {string[]}
//  */
// var generateParenthesis = function (n) {
//     let buffer = []
//     for (let i = 0; i < n; i++) {

//         //推入左括号
//         if (buffer.length === 0) {
//             buffer.push("1(")
//         } else {
//             buffer = buffer.map((item) => {
//                 return Number(Number(item.charAt(0)) + 1) + item.slice(1) + "("  //每次左括号长度+1 加一个左括号
//             })
//         }

//         let newBuffer = []
//         while (buffer.length > 0) {
//             const target = buffer.shift()
//             const leftLength = Number(target.charAt(0))
//             let tempValue = target.slice(1)

//             if (i < n - 1) {
//                 if (target.endsWith("(")) {
//                     newBuffer.push(target)
//                 }
//                 for (let j = 1; j <= leftLength; j++) {
//                     tempValue = tempValue + ")"
//                     newBuffer.push(Number(leftLength - j) + tempValue)
//                 }
//             } else {
//                 for (let j = 1; j <= leftLength; j++) {
//                     tempValue = tempValue + ")"
//                 }
//                 newBuffer.push(tempValue)
//             }

//         }
//         buffer = newBuffer
//     }
//     return buffer
// };

// 1,2, 结束 树结构 一层层分析
// 1 (  left<n
// 2 )  right<left
// end right = n
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
    let buffer = []
    let res = []
    function callBack(left, rigth) {

        if (rigth === n) {
            res.push(buffer.join(""))
        }

        if (left < n) {
            buffer.push("(")
            callBack(left + 1, rigth)
            buffer.pop()
        }

        if (rigth < left) {
            buffer.push(")")
            callBack(left, rigth + 1)
            buffer.pop()
        }

    }

    callBack(0, 0)

    return res
};


console.log(generateParenthesis(3));
