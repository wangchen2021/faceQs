/**
 * @link https://leetcode.cn/problems/climbing-stairs/solutions/286022/pa-lou-ti-by-leetcode-solution/
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    //f(0)=1
    //f(1)=1
    //f(2)=2
    //f(x)=f(x-1)+f(x-2)
    let f1 = 0
    let f2 = 0
    let f3 = 1
    for (let i = 0; i < n; i++) {
        f1 = f2
        f2 = f3
        f3 = f1 + f2
    }
    return f3
};