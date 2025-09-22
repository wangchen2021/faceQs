/**
 * 
 * @param {Number[]} arr 
 */
function getSeq(arr) {
    let result = [0]
    const len = arr.length
    let p = new Array(len).fill(0)
    let start, end, mid

    for (let i = 0; i < len; i++) {
        const lastIndex = result[result.length - 1]
        const target = arr[i]
        if (target > arr[lastIndex]) {
            p[i] = lastIndex
            result.push(i)
            continue
        }

        start = 0
        end = result.length
        while (start < end) {
            mid = (start + end) >> 1
            if (target < arr[result[mid]]) {
                start = mid + 1
            } else {
                end = mid
            }
        }

        if (target < arr[result[start]]) {
            result[start] = i
            p[i] = result[start - 1]
        }
    }

    let i = result.length
    let last = result[i - 1]
    while (i-- > 0) {
        result[i] = last
        last = p[last]
    }

    return result
}

console.log(getSeq([3, 5, 7, 11, 6, 8, 1, 2]));
