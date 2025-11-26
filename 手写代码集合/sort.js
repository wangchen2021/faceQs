// https://cloud.tencent.com/developer/article/2079941
var testArr = [123, 203, 23, 13, 34, 65, 65, 45, 89, 13, 1];

//选择排序
function selectSort(arr) {
    const res = [...arr]
    const len = res.length
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (res[j] < res[i]) {
                const temp = res[j]
                res[j] = res[i]
                res[i] = temp
            }
        }
    }
    return res
}

//冒泡排序
function bubbleSort(arr) {
    const res = [...arr]
    const len = res.length
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (res[j] > res[j + 1]) {
                const temp = res[j]
                res[j] = res[j + 1]
                res[j + 1] = temp
            }
        }
    }
    return res
}


//插入排序
function insertSort(arr) {
    const res = [...arr]
    const len = res.length
    let current, preindex
    for (let i = 0; i < len; i++) {
        current = res[i]
        preindex = i - 1
        while (preindex >= 0 && current < res[preindex]) {
            res[preindex + 1] = res[preindex]
            preindex--
        }
        res[preindex + 1] = current
    }
    return res
}


//快速排序
function quickSort(arr) {
    const len = arr.length
    if (len <= 1) {
        return arr
    }
    let referIndex = len >> 1
    let refer = arr[referIndex]
    let left = []
    let right = []
    for (let i = 0; i < len; i++) {
        const current = arr[i]
        if (current > refer) {
            right.push(current)
        } else if (current < refer) {
            left.push(current)
        }
    }
    return [...quickSort(left), refer, ...quickSort(right)]
}


console.log(selectSort(testArr));
console.log(bubbleSort(testArr));
console.log(insertSort(testArr));
console.log(quickSort(testArr));
console.log(testArr);
