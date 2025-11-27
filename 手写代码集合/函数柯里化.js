function createCurry(fn, endFlag) {
    let param = null

    function fnCallBack(...oldArgs) {
        const args = [...oldArgs]
        function curry(...newArgs) {
            param = [[...args, ...newArgs,], [...newArgs], [...args]]
            if (endFlag(...param)) {
                fn(...param)
            } else {
                args.push(...newArgs)
                return curry
            }
        }
        curry.execute = () => fn(...param)
        return curry
    }

    return fnCallBack
}


const add = createCurry((allArgs, newArgs, oldArgs) => {
    for (let item of allArgs) {
        console.log(item);
    }
}, (allArgs, newArgs, oldArgs) => {
    return newArgs.includes("xx")
})


add(1)(2)('34')(5, "xx")