function myFlat(depth = Infinity) {
    function dfs(arr, depth) {
        return depth > 0
            ?
            arr.reduce((cur, val) => {
                return cur.concat(Array.isArray(val) ? dfs(val, depth - 1) : val)
            }, [])
            :
            arr.slice()
    }
    return dfs(this, depth)
}


Array.prototype.myFlat = myFlat

let a = [1, 2, 3, 4, [2, 5, [3, 2, [1, 5]]]]

console.log(a.myFlat(1));
