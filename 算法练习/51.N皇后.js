/**
 * @link https://leetcode.cn/problems/n-queens/
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
    let res = []
    let area = Array.from({ length: n }, () => new Array(n).fill("."))
    const leftBanSet = new Set()
    const rightBanSet = new Set()
    const lineArray = new Array(n).fill(false)

    function putQueen(r, i) {

        area[r][i] = "Q"

        lineArray[i] = true

        const leftFlag = r - i
        const rightFlag = r + i

        leftBanSet.add(leftFlag)
        rightBanSet.add(rightFlag)

        return () => {
            area[r][i] = "."
            lineArray[i] = false
            leftBanSet.delete(leftFlag)
            rightBanSet.delete(rightFlag)
        }

    }

    function setQueenPosition(num, r) {

        if (num === 0) {
            res.push(area.map((row) => {
                return row.join("")
            }))
            return
        }

        for (let i = 0; i < n; i++) {
            const leftFlag = r - i
            const rightFlag = r + i
            if (lineArray[i] || leftBanSet.has(leftFlag) || rightBanSet.has(rightFlag)) continue
            const reset = putQueen(r, i)
            setQueenPosition(num - 1, r + 1)
            reset()
        }
        
    }

    setQueenPosition(n, 0)
    return res
};

console.log(solveNQueens(4));
