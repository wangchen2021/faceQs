class MyPromise {

    static PENDING = "pending"
    static FULFILLED = "fulfilled"
    static REJECTED = "rejected"

    constructor(executor) {

        this.status = MyPromise.PENDING
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (val) => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.FULFILLED
                this.value = val
                this.onFulfilledCallbacks.forEach((callback) => {
                    callback()
                })
            }
        }

        const reject = (reason) => {
            if (this.status === MyPromise.PENDING) {
                this.status = MyPromise.REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach((callback) => {
                    callback()
                })
            }
        }

        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val
        onRejected = typeof onRejected === "function" ? onRejected : (err) => { throw err }

        const thenPromise = new MyPromise((resolve, reject) => {

            const onFulfilledCallBack = () => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value)
                        this.resolvePromise(thenPromise, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0);
            }

            const onRejectedCallBack = () => {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        this.resolvePromise(thenPromise, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0);
            }

            if (this.status === MyPromise.PENDING) {
                this.onFulfilledCallbacks.push(onFulfilledCallBack)
                this.onRejectedCallbacks.push(onRejectedCallBack)
            }

            else if (this.status === MyPromise.FULFILLED) {
                onFulfilledCallBack()
            }

            else if (this.status === MyPromise.REJECTED) {
                onRejectedCallBack()
            }

        })

        return thenPromise
    }


    resolvePromise(promise, x, resolve, reject) {

        if (promise === x) {
            return reject(new TypeError("循环引用"))
        }

        else if (x instanceof MyPromise) {
            x.then(resolve, reject)
        }

        else if (x !== null && (typeof x === "function" || typeof x === "object")) {
            let called = false
            try {
                const then = x.then
                if (typeof then === "function") {
                    then.call(
                        x,
                        (val) => {
                            if (called) return
                            called = true
                            this.resolvePromise(promise, val, resolve, reject)
                        },
                        (err) => {
                            if (called) return
                            called = true
                            reject(err)
                        }
                    )
                } else {
                    resolve(x)
                }
            } catch (err) {
                if (called) return
                called = true
                reject(err)
            }
        }

        else {
            resolve(x)
        }

    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => { throw reason })
        )
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value
        }
        return new MyPromise(resolve => resolve(value))
    }

    static reject(err) {
        return new MyPromise((_resolve, reject) => reject(err))
    }

    static all(arr) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(arr)) {
                return reject(new TypeError("需要数组类型参数"))
            }

            const len = arr.length
            let finish = 0
            let res = new Array(len)

            if (len === 0) return resolve(res)

            arr.forEach((p, i) => {
                MyPromise.resolve(p).then(
                    (r) => {
                        res[i] = r
                        finish++
                        if (finish === len) {
                            resolve(res)
                        }
                    },
                    (err) => {
                        reject(err)
                    }
                )
            })
        })
    }

    static race(arr) {
        return new MyPromise((resolve, reject) => {

            if (!Array.isArray(arr)) {
                return reject(new TypeError("需要数组类型参数"))
            }

            // 空数组时保持pending状态（符合原生Promise行为）
            if (arr.length === 0) return

            arr.forEach((p) => {
                MyPromise.resolve(p).then(resolve, reject)
            })
            
        })
    }

    static allSettled(arr) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(arr)) {
                return reject(new TypeError("需要数组类型参数"))
            }
            const len = arr.length
            const res = new Array(len)
            let finish = 0
            if (arr.length === 0) return resolve(res)
            arr.forEach((p, i) => {
                MyPromise.resolve(p).then(
                    (r) => {
                        res[i] = { status: MyPromise.FULFILLED, value: r }
                    },
                    (e) => {
                        res[i] = { status: MyPromise.REJECTED, reason: e }
                    }
                ).finally(() => {
                    finish++
                    if (finish === len) {
                        resolve(res)
                    }
                })
            })
        })
    }

    static any(arr) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(arr)) {
                return reject(new TypeError("需要数组类型参数"))
            }
            const len = arr.length
            const errors = new Array(len)
            if (len === 0) return reject(new AggregateError([new Error("all rejected")]))
            let rejects = 0
            arr.forEach((p, i) => {
                MyPromise.resolve(p).then(
                    (r) => {
                        resolve(r)
                    },
                    (e) => {
                        errors[i] = e
                        rejects++
                        if (rejects === len) {
                            return reject(new AggregateError(errors, "all rejected"))
                        }
                    }
                )
            })
        })
    }
}

// const a = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         const value = Math.random() * 10
//         value > 5 ? resolve(value) : reject("small")
//     }, 1000)
// })
//     .then((res) => {
//         console.log(res);
//         return new MyPromise((resolve, reject) => {
//             setTimeout(() => {
//                 reject(555)
//             }, 1000);
//         })
//     })
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err, "err");
//     })

// Promise.all([a]).then((res) => console.log(res))