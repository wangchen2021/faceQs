/**
 * @link https://leetcode.cn/problems/spiral-matrix/
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
    if (!matrix?.length || !matrix[0]?.length) return [];
    const res = [];
    let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;

    // 核心：用边界交叉作为循环终止条件（比长度判断更严谨，从根源避免无效遍历）
    while (top <= bottom && left <= right) {
        // 左→右（仅遍历当前top行，left到right）
        for (let i = left; i <= right; i++) res.push(matrix[top][i]);
        top++; // 上边界下移
        if (top > bottom) break; // 提前判断，避免单行重复遍历

        // 上→下（仅遍历当前right列，top到bottom）
        for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
        right--; // 右边界左移
        if (left > right) break; // 提前判断，避免单列重复遍历

        // 右→左（仅遍历当前bottom行，right到left）
        for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);
        bottom--; // 下边界上移
        if (top > bottom) break; // 提前判断

        // 下→上（仅遍历当前left列，bottom到top）
        for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);
        left++; // 左边界右移
    }

    return res;
};