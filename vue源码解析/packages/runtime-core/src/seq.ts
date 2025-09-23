export function getSequence(arr: Array<number>) {
    const result = [0]
    const p = result.slice(0) // 记录前驱节点的索引
    let start;
    let end;
    let middle;
    const len = arr.length
    for (let i = 0; i < len; i++) {

        const arrI = arr[i]
        if (arrI !== 0) { // 适配vue3
            let resultLastIndex = result[result.length - 1]
            if (arr[resultLastIndex] < arrI) {
                p[i] = resultLastIndex // 记录前驱节点
                result.push(i) // 如果当前元素大于结果数组的最后一个元素，直接添加
                continue
            }
        }

        start = 0
        end = result.length - 1
        while (start < end) {
            middle = (start + end) >> 1 // 使用位运算优化除法
            if (arr[result[middle]] < arrI) {
                start = middle + 1 // 如果当前元素大于中间元素，向右查找
            } else {
                end = middle // 向左查找
            }
        }

        if (arrI < arr[result[start]]) {
            p[i] = result[start - 1] // 记录前驱节点
            result[start] = i // 找到第一个大于等于当前元素的位置，进行替换
        }

    }

    // 倒叙追溯
    let i = result.length
    let last = result[i - 1]
    while (i-- > 0) {
        result[i] = last // 将结果数组的元素替换为前驱节点
        last = p[last] // 追溯前驱节点
    }

    return result
}
