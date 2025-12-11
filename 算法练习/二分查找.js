function halfSearch(arr, target, start) {
    const len = arr.length
    if (len === 0) return -1
    const mid = len >> 1
    const midValue = arr[mid]
    if (target < midValue) {
        return halfSearch(arr.slice(0, mid), target, start)
    } else if (target > midValue) {
        return halfSearch(arr.slice(mid + 1), target, start + mid + 1)
    } else {
        return mid + start
    }
}

console.log(halfSearch([1, 2, 4, 5, 7, 9], 9, 0));
