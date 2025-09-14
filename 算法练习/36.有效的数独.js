/**
 * @link https://leetcode.cn/problems/valid-sudoku/
 */

/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function (board) {
    console.table(board);
    
    // 行循环
    for (let p = 0; p < 9; p++) {

        // row_check
        const rowArr = board[p]

        // column_check
        const columnArr = []
        for (let c = 0; c < 9; c++) {
            columnArr.push(board[c][p])
        }

        // grid_check
        const gridArr = []
        const startR = (p % 3) * 3
        const startC = (Math.floor(p / 3)) * 3
        for (let r = startR; r < startR + 3; r++) {
            for (let c = startC; c < startC + 3; c++) {
                gridArr.push(board[r][c])
            }
        }

        if (!checkNoRepeat(rowArr) || !checkNoRepeat(columnArr) || !checkNoRepeat(gridArr)) {
            return false
        }

    }

    function checkNoRepeat(arr) {
        arr = arr.filter((item) => {
            return item != "."
        })
        const length = arr.length
        arr = Array.from(new Set(arr))
        return Boolean(length === arr.length)
    }

    return true

};

console.log(isValidSudoku(
    [[".", ".", "4", ".", ".", ".", "6", "3", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], ["5", ".", ".", ".", ".", ".", ".", "9", "."], [".", ".", ".", "5", "6", ".", ".", ".", "."], ["4", ".", "3", ".", ".", ".", ".", ".", "1"], [".", ".", ".", "7", ".", ".", ".", ".", "."], [".", ".", ".", "5", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."]]
));

