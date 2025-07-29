// https://leetcode.cn/problems/median-of-two-sorted-arrays/description/

// 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。

// 算法的时间复杂度应该为 O(log (m+n)) 。

// 示例 1：

// 输入：nums1 = [1,3], nums2 = [2]
// 输出：2.00000
// 解释：合并数组 = [1,2,3] ，中位数 2
// 示例 2：

// 输入：nums1 = [1,2], nums2 = [3,4]
// 输出：2.50000
// 解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    nums1.push(...nums2)
    nums1.sort((a, b) => a - b)
    const midIndex = nums1.length / 2
    if (Number.isInteger(midIndex)) {
        return (nums1[midIndex - 1] + nums1[midIndex]) / 2
    } else {
        return nums1[Math.floor(midIndex)]
    }
};


console.log(findMedianSortedArrays([1, 2], [3, 4]));
