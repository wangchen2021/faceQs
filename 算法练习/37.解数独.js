/**
 * @link https://leetcode.cn/problems/sudoku-solver/
 */

/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */


// 递归
// 每次获得新的board
// 找到下一个空格子 计算空格子结果
// 1. 结果为单一数字 将数字填入空格继续寻找下一个空格子
// 2. 结果为数组 循环数组 尝试每一种可能组成新的board 重复执行递归函数
// 3. 结果为空 上次预判错误 尝试上次预判的下一种可能 退出当前函数 返回上一层递归
// 结束条件 全场再无空格子
var solveSudoku = function (board) {

    const allNums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    let finish = false

    function findNextNullGrid() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === ".") return { r, c }
            }
        }
        return null
    }

    function findSuitGridNum(c, r) {
        // 寻找可能数字
        // 行数字
        let rowArr = board[r].filter((item) => {
            return item != "."
        })

        // 列数字
        let columnArr = []
        for (let item of board) {
            if (item[c] != ".")
                columnArr.push(item[c])
        }

        // 格数字
        let g = Math.floor(r / 3) * 3 + Math.floor(c / 3)
        let gridArr = []
        const startR = Math.floor(g / 3) * 3
        const startC = Math.floor(g % 3) * 3
        for (let r = startR; r < startR + 3; r++) {
            for (let c = startC; c < startC + 3; c++) {
                if (board[r][c] !== ".")
                    gridArr.push(board[r][c])
            }
        }

        const exclude = new Set([...rowArr, ...columnArr, ...gridArr]);

        //计算可能数
        const possibleArr = allNums.filter((item) => {
            return !exclude.has(item)
        })

        return possibleArr
    }


    function trySuitNum() {
        const nextNullGrid = findNextNullGrid()
        if (!nextNullGrid) {
            finish = true
            return  //结束
        }

        const { c, r } = nextNullGrid
        const possibleArr = findSuitGridNum(c, r)

        for (let item of possibleArr) {
            board[r][c] = item
            trySuitNum()
            if (finish) return  //结束
        }

        board[r][c] = "."
    }

    trySuitNum()


};

solveSudoku([[".", ".", ".", ".", ".", ".", ".", ".", "."], [".", "9", ".", ".", "1", ".", ".", "3", "."], [".", ".", "6", ".", "2", ".", "7", ".", "."], [".", ".", ".", "3", ".", "4", ".", ".", "."], ["2", "1", ".", ".", ".", ".", ".", "9", "8"], [".", ".", ".", ".", ".", ".", ".", ".", "."], [".", ".", "2", "5", ".", "6", "4", ".", "."], [".", "8", ".", ".", ".", ".", ".", "1", "."], [".", ".", ".", ".", ".", ".", ".", ".", "."]])
