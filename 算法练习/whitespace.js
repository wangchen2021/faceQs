function add(...oldArgs) {
  if (oldArgs === 0) return 0
  const args = [...oldArgs]

  function sum() {
    return args.reduce((cur, val) => {
      return cur + val
    }, 0)
  }

  return function curry(...newArgs) {
    if (newArgs.length === 0) {
      return sum()
    } else {
      args.push(...newArgs)
      return curry
    }
  }

}

let a = add(1, 2)(2)()

console.log(a);
