
/**
 * @link https://leetcode.cn/problems/trapping-rain-water/
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
    //向后遍历 记录高度最大值
    //height[i]
    //情况1 height[i] = 0  res[i]=res[i-1] 继续走
    //情况2 向前走 直到找到height[j]大于height[i]截止  res[i] = res[j] + height[i]*[i-j-1] - sum(height[i-1]...height[j+1])
    //如果没有比height[j]大的 找到前面最高的h[j] res[i] = res[j] + height[j]*[i-j-1] - sum(height[i-1]...height[j+1])
    let tempSum = 0
    let sum = new Array(height.length).fill(0)
    let resArr = new Array(height.length).fill(0)
    for (let i = 0; i < height.length; i++) {
        const item = height[i]
        let j = 0
        let validHeight = 0
        for (let p = i - 1; p >= 0; p--) {
            let targetHeight = height[p]
            if (targetHeight >= item) {
                j = p
                validHeight = item
                break
            } else if (targetHeight > validHeight) {
                validHeight = targetHeight
                j = p
            }
        }
        resArr[i] = resArr[j] + validHeight * (i - j - 1) - (sum[i - 1] ? sum[i - 1] : 0) + sum[j]
        tempSum = tempSum + item
        sum[i] = tempSum
    }
    return resArr[resArr.length - 1]
};

console.log(trap([2, 6, 3, 8, 2, 7, 2, 5, 0]));

