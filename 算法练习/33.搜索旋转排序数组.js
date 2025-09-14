/**
 * @link https://leetcode.cn/problems/search-in-rotated-sorted-array/description/
 */

/**
 * @param {number[]} nums 整数数组 nums 按升序排列，数组中的值 互不相同 。
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    const mid = nums.length >> 1
    const left = nums.slice(0, mid)
    const right = nums.slice(mid)

    //情况1 ： 左0>左尾 左包含升序到某一段数变小重新升序  右完全升序 
    //情况2 ： 左0<左尾 左完全升序 右升序到某一段数变小重新升序
    // 如果target在升序序列 直接二分查找
    // 如果target不在升序序列  对另一个继续二分重新查找

    if (left[0] < left[left.length - 1]) {

    } else {

    }
};

// console.log(search([4, 5, 6, 7, 0, 1, 2], 2));
