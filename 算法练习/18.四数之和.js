/**
 * @link https://leetcode.cn/problems/4sum/description/
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
    const res = []
    nums = nums.sort((a, b) => a - b)

    for (let p1 = 0; p1 < nums.length - 1; p1++) {
        if (p1 > 0 && nums[p1] === nums[p1 - 1]) continue //相同数不处理

        for (let p2 = p1 + 1; p2 < nums.length - 1; p2++) {
            if (p2 > p1 + 1 && nums[p2] === nums[p2 - 1]) continue //相同数不处理

            let p4 = nums.length - 1
            for (let p3 = p2 + 1; p3 < p4; p3++) {
                if (p3 > p2 + 1 && nums[p3] === nums[p3 - 1]) continue

                const referValue = target - (nums[p1] + nums[p2] + nums[p3])
                while (nums[p4] > referValue) {
                    p4--
                }

                if (p4 <= p3) break

                if (nums[p4] === referValue) {
                    res.push([nums[p1], nums[p2], nums[p3], nums[p4]])
                }

            }
        }
    }
    return res
};

console.log(fourSum([-3, -2, -1, 0, 0, 1, 2, 3], 0));
