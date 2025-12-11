/**
 * @link https://leetcode.cn/problems/jump-game/
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
    let maxMove = 0
    const length = nums.length
    if (length <= 1) return true
    for (let i = 0; i < length - 1; i++) {
        if (i > maxMove) return false
        maxMove = Math.max(maxMove, i + nums[i])
        if (maxMove >= length - 1) return true
    }
    return false
};