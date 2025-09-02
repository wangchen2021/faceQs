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
    const sortNums = nums.sort((a, b) => a - b)

    for (let i = 0; i < sortNums.length - 1; i++) {

        if (i > 0 && sortNums[i] === sortNums[i - 1]) {
            continue //相同值不处理
        }

        const target = -sortNums[i] //目标值
        let e = sortNums.length - 1

        for (let s = i + 1; s < e; s++) {

            if (sortNums[s] === sortNums[s - 1] && s > i + 1) {
                continue //相同值不处理
            }


            while (sortNums[s] + sortNums[e] > target && s < e) {
                e--
            }

            if (s === e) {
                break;
            }

            if (sortNums[s] + sortNums[e] === target) {
                res.push([sortNums[i], sortNums[s], sortNums[e]])
            }

        }

    }

    return res

};


console.log(threeSum([-1, 0, 1, 2, -1, -4]));
