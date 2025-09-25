/**
 * @link https://leetcode.cn/problems/3sum/description/
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {

    let res = []

    // 首先排序
    nums.sort((a, b) => a - b)

    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue //相同值不处理
        }

        let s = i + 1
        let e = nums.length - 1

        while (s < e) {
            if (nums[s] + nums[e] > -nums[i]) {
                e--
            } else if (nums[s] + nums[e] < -nums[i]) {
                s++
            } else {
                res.push([nums[i], nums[s], nums[e]])
                while (s < e && nums[s] === nums[s + 1]) {
                    s++
                }
                while (s < e && nums[e] === nums[e - 1]) {
                    e--
                }
                s++
                e--
            }
        }

    }

    return res

};


console.log(threeSum([-1, 0, 1, 2, -1, -4]));
