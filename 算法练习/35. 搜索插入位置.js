/**
 * @link https://leetcode.cn/problems/search-insert-position/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {

    function halfSearch(arr, start) {
        const length = arr.length
        if (length === 0) {
            nums.splice(start,0,target)
            return start
        }

        const mid = length >> 1
        const midValue = arr[mid]

        if (midValue > target) {
            return halfSearch(arr.slice(0, mid), start)
        } else if (midValue < target) {
            return halfSearch(arr.slice(mid + 1), start + mid + 1)
        } else {
            return start + mid
        }
    }

    return halfSearch(nums, 0)

};