/**
 * 
 * @link https://leetcode.cn/problems/4sum/
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
    nums.sort((a, b) => a - b)
    const len = nums.length
    const res = []
    for (let i = 0; i < len - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue
        for (let j = i + 1; j < len - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue

            const min = nums[i] + nums[j] + nums[j + 1] + nums[j + 2]
            const max = nums[i] + nums[j] + nums[len - 2] + nums[len - 1]

            if (min > target) {
                break
            } else if (max < target) {
                continue
            }

            let start = j + 1
            let end = len - 1
            const refer = target - nums[i] - nums[j]

            while (start < end) {
                if (nums[start] + nums[end] > refer) {
                    end = endMove(start, end)
                } else if (nums[start] + nums[end] < refer) {
                    start = startMove(start, end)
                } else {
                    res.push([nums[i], nums[j], nums[start], nums[end]])
                    start = startMove(start, end)
                    end = endMove(start, end)
                }
            }

        }
    }

    function startMove(start, end) {
        while (nums[start] === nums[start + 1] && start < end) {
            start++
        }
        start++
        return start
    }
    
    function endMove(start, end) {
        while (nums[end] === nums[end - 1] && start < end) {
            end--
        }
        end--
        return end
    }
    return res
};

console.log(fourSum([-3, -2, -1, 0, 0, 1, 2, 3], 0));
