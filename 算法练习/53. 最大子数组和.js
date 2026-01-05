/**
 * @license https://leetcode.cn/problems/maximum-subarray/
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    //双指针 当前和大于0移动尾巴 当前和小于0移动头尾
    const length = nums.length
    if (length <= 1) return nums[0]
    let maxSum = -Infinity
    let sum = 0
    for (let i = 0; i < length; i++) {
        const value = nums[i]
        sum += value
        if (sum > 0) {
            maxSum = Math.max(sum, maxSum)
        } else {
            sum = 0
            maxSum = Math.max(value, maxSum)
        }
    }
    return maxSum
};

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
