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

    //动态规划
    //规划方程 
    // len=height.length
    // len=1|0  res=0
    // len=2  res=Min(height[s],height[e])*(e-s) s=0;e=1
    // len=>3
    // 前最高计算，非最高跳过
    // 后最高计算，非最高跳过

    // 头指针循环
    let preMaxHeight = 0
    let res = 0
    for (let s = 0; s < height.length; s++) {
        const startValue = height[s]
        if (startValue <= preMaxHeight) continue

        // 尾指针循环
        let endMaxHeight = 0
        for (let e = height.length - 1; e > s; e--) {
            const endValue = height[e]
            if (endValue <= endMaxHeight) continue
            res = Math.max(res, Math.min(startValue, endValue) * (e - s))
            endMaxHeight = endValue
            if (startValue < endValue) break //如果头比尾矮 直接结束
        }
        preMaxHeight = startValue
    }
    return res
};

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));


