/**
 * @link https://leetcode.cn/problems/substring-with-concatenation-of-all-words/
 */



/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
// 树形结构
// 每层有新的决策
// 取一个其他的决策
// 退出
var findSubstring = function (s, words) {

    let res = []
    let resGroup = []
    let strLength = words.join("").length
    let wordsStrLength = words[0] ? words[0].length : 0
    let start = 0
    let end = strLength - 1


    while (end <= s.length - 1) {

        let tempWords = [...words]
        let target = s.substring(start, end + 1)
        if (resGroup.includes(target)) {
            res.push(start)
        } else {
            while (target.length >= 0) {
                const index = tempWords.indexOf(target.slice(0, wordsStrLength))
                if (index >= 0) {
                    target = target.slice(wordsStrLength)
                    if (target.length === 0) {
                        res.push(start)
                        resGroup.push(s.substring(start, end + 1))
                        break
                    }
                    tempWords = tempWords.filter((_item, itemIndex) => {
                        return itemIndex != index
                    })

                } else {
                    break
                }
            }
        }

        start++
        end++
    }

    return res

};

console.log(findSubstring("aaaaaaaaaaaaaa", ["aa", "aa"]));
