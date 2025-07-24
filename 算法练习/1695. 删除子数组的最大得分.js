// 给你一个正整数数组 nums ，请你从中删除一个含有 若干不同元素 的子数组。删除子数组的 得分 就是子数组各元素之 和 。

// 返回 只删除一个 子数组可获得的 最大得分 。

// 如果数组 b 是数组 a 的一个连续子序列，即如果它等于 a[l],a[l+1],...,a[r] ，那么它就是 a 的一个子数组。



// 示例 1：

// 输入：nums = [4,2,4,5,6]
// 输出：17
// 解释：最优子数组是 [2,4,5,6]
// 示例 2：

// 输入：nums = [5,2,1,2,5,2,1,2,5]
// 输出：8
// 解释：最优子数组是 [5,2,1] 或 [1,2,5]


// 提示：

// 1 <= nums.length <= 105
// 1 <= nums[i] <= 104


/**
 * @param {number[]} nums
 * @return {number}
 */
// var maximumUniqueSubarray = function (nums) {
//     if (nums.length === 0) return 0
//     let res = 0
//     let index = 0
//     while (index < nums.length) {
//         let subArray = []
//         for (let i = index; i < nums.length; i++) {
//             const item = nums[i]
//             if (!subArray.includes(item)) {
//                 subArray.push(item)
//             } else {
//                 break
//             }
//         }
//         const sum = subArray.reduce((pre, cur) => pre + cur)
//         res = sum > res ? sum : res
//         index++
//     }
//     return res
// };


//暴力解法 失败~


var maximumUniqueSubarray = function(nums) {
    const n = nums.length;
    const psum = new Array(n + 1).fill(0);
    const cnt = new Map();
    let ans = 0, pre = 0;
    for (let i = 0; i < n; ++i) {
        psum[i + 1] = psum[i] + nums[i]; //psum存了每一位的合
        pre = Math.max(pre, cnt.get(nums[i]) || 0); //存了最后出现的坐标
        ans = Math.max(ans, psum[i + 1] - psum[pre]); //合等于总减去相同数上次出现的位置
        cnt.set(nums[i], i + 1);
    }
    return ans;
};

const res= maximumUniqueSubarray([4, 2, 4, 5, 6])
console.log(res);

//官方解法