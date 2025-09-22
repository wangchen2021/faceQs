/**
 * 
 * @link https://leetcode.cn/problems/jump-game-ii/
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
    //跳的步数s+落点的潜力  就是这一步的最大价值
    //找最大潜力的步一直往后 直到一步就到终点 返回次数
    let p = 0
    let res = 0
    const len = nums.length
    if(len===1) return 0
    while (p < len) {
        if (len - p - 1 <= nums[p]) {
            return res + 1
        }
        let value = 0
        let target
        for (let i = p + 1; i <= p + nums[p]; i++) {
            const targetValue = nums[i] + i - p
            if (targetValue > value) {
                value = targetValue
                target = i
            }
        }
        res++
        p = target
    }
    return res
};

console.log(jump([2, 3, 1, 1, 4]));
