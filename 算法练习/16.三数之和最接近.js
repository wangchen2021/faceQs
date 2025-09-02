/**
 * @link https://leetcode.cn/problems/3sum-closest/
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {

    nums = nums.sort((a, b) => a - b)
    
    let res = nums[0] + nums[1] + nums[2]
    let referValue = Math.abs(target - res)
  

    for (let i = 0; i < nums.length - 1; i++) {

        if (i > 0 && nums[i] === nums[i - 1]) {
            continue //相同数不处理
        }

        let e = nums.length - 1

        for (let s = i + 1; s < e; s++) {

            if (s > i + 1 && nums[s] === nums[s - 1]) {
                continue //相同数不处理
            }

            judgeSum(i, s, e)

            while (s < e && nums[i] + nums[s] + nums[e] >= target) {
                judgeSum(i, s, e)
                e--
            }

            if (s === e) break
            else judgeSum(i, s, e)

        }
    }

    function judgeSum(i, s, e) {
        const sum = nums[i] + nums[s] + nums[e]
        const newReferValue = Math.abs(target - sum)
        if (referValue > newReferValue) {
            res = sum
            referValue = newReferValue
        }
    }

    return res

};

console.log(threeSumClosest([-1000, -5, -5, -5, -5, -5, -5, -1, -1, -1], -14));

