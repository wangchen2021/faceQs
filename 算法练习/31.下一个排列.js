/**
 * @link https://leetcode.cn/problems/next-permutation/
 */

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */

// [ 1, 5, 2, 6, 4]  //后往前看 指针为p 寻找恰好大于p-1的最小值 如果都不大于p-1则继续往前
var nextPermutation = function (nums) {
    const numsLast = []

    function findJustLageNumIndexOfNumsLast(arr, target) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > target) {
                return i
            }
        }
        return -1
    }

    while (nums.length > 0) {
        const lastValue = nums.pop()
        numsLast.push(lastValue)
        numsLast.sort((a, b) => a - b)
        const preValue = nums[nums.length - 1]
        const index = findJustLageNumIndexOfNumsLast(numsLast, preValue)
        if (index >= 0) {
            nums[nums.length - 1] = numsLast[index]
            numsLast.splice(index, 1)
            numsLast.push(preValue)
            numsLast.sort((a, b) => a - b)
            break
        }
    }
    nums.push(...numsLast)
    console.log(nums);

};

nextPermutation([3,2,1])
