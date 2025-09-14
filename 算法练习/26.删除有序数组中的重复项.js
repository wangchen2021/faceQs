/**
 * @link https://leetcode.cn/problems/remove-duplicates-from-sorted-array/
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
    let p = 0
    let pre = null
    let cur = null
    while (p < nums.length) {
        cur = nums[p]
        if (cur === pre) {
            nums.splice(p - 1, 1)
        } else {
            p++
        }
        pre = cur
    }
    return nums.length
};

console.log(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]));

