/**
 * @link https://leetcode.cn/problems/combination-sum/
 */

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
    let res = []
    function getAllGroup(path, sum) {
        if (path.length > 1 && path[path.length - 1] < path[path.length - 2]) {
            return
        } //去除重复情况
        if (sum === target) {
            res.push([...path])
            return
        } //找到结果
        if (sum > target) {
            return
        } //超过后无意义
        for (let item of candidates) {
            path.push(item)
            sum = sum + item
            getAllGroup(path, sum)
            path.pop()
            sum = sum - item
        }
    }
    getAllGroup([], 0)
    return res
};

console.log(combinationSum([2, 3, 6, 7], 7));
