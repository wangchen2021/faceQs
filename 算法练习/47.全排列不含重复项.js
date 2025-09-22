
/**
* @link https://leetcode.cn/problems/permutations/
* @param {number[]} nums
* @return {number[][]}
*/
var permute = function (nums) {
    const res = []
    function dfs(arr, path) {

        if (path.length === nums.length) {
            res.push([...path])
            return
        }

        for (let i = 0; i < arr.length; i++) {
            if (i > 0 && arr[i] === arr[i - 1]) continue
            path.push(arr[i])
            let newArr = arr.filter((_item, index) => {
                return index !== i
            })
            dfs(newArr, path)
            path.pop()
        }

    }

    nums.sort((a, b) => a - b)
    dfs(nums, [])
    return res
};

console.log(permute([1, 1, 2]));
