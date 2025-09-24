/**
 * @link https://leetcode.cn/problems/container-with-most-water/
 * @description 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
返回容器可以储存的最大水量。
 */

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
    let start = 0
    let end = height.length - 1
    let max = 0

    while (start < end) {
        const startHeight = height[start]
        const endHeight = height[end]
        const width = end - start
        max = Math.max(max, Math.min(startHeight, endHeight) * width)
        startHeight > endHeight ? end-- : start++
    }

    return max
};

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));


