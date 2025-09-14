/**
 * @link https://leetcode.cn/problems/remove-element/description/
 */

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
    let p = 0
    let cur = null
    while (p < nums.length) {
        cur = nums[p]
        if (cur === val) {
            nums.splice(p, 1)
        } else {
            p++
        }
    }
    return nums.length
};