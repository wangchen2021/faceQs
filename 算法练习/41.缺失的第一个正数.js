/**
 * @link https://leetcode.cn/problems/first-missing-positive/
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function (nums) {
    nums.sort((a, b) => a - b)
    nums=Array.from(new Set(nums))
    if (nums[0] > 1) return 1
    if (nums[nums.length - 1] < 1) {
        return 1
    }
    for (let i = 1; i < nums.length; i++) {
        if (nums[i - 1] + 1 !== nums[i]) {
            if (nums[i] > 1) {
                return nums[i - 1] + 1 > 1 ? nums[i - 1] + 1 : 1
            }
        }
    }
    return nums[nums.length - 1] + 1 > 1 ? nums[nums.length - 1] + 1 : 1
};

console.log(firstMissingPositive([3, 4, -1, 1]));
