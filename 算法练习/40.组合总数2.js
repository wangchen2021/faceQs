/**
 * 
 * @link https://leetcode.cn/problems/combination-sum-ii/
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
    let res = []
    candidates.sort((a, b) => a - b)

    function getAllGroup(start, path, sum) {
        if (sum === target) {
            res.push([...path])
            return
        } //找到结果
        if (sum > target) {
            return
        } //超过后无意义
        for (let i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] === candidates[i - 1]) continue
            path.push(candidates[i])
            sum = sum + candidates[i]
            getAllGroup(i + 1, path, sum)
            path.pop()
            sum = sum - candidates[i]
        }
    }
    getAllGroup(0, [], 0)
    return res
};

console.log(combinationSum2([1, 2], 4));
