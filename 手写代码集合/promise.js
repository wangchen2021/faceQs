class MyPromise {
    static PENDING = "pending"
    static FULFILLED = "fulfilled"
    static REJECTED = "rejected"

    resolve = undefined
    reject = undefined

    constructor(executor) {
        this.state = MyPromise.PENDING
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallBacks = []
        this.onRejectCallBacks = []

        const resolve = (value) => {
            if (this.state === MyPromise.PENDING) {
                this.state = MyPromise.FULFILLED
                this.value = value
                this.onFulfilledCallBacks.forEach(callback => callback())
            }
        }

        const reject = (reason) => {
            if (this.state === MyPromise.PENDING) {
                this.state = MyPromise.REJECTED
                this.reason = reason
                this.onRejectCallBacks.forEach(callback => callback())
            }
        }

        try {
            executor(resolve, resolve)
        } catch (err) {
            reject(err)
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
        onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason }
        const subPromise = new MyPromise((resolve, reject) => {
            if (this.state === MyPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value)
                        this.resolve
                    } catch (err) {

                    }
                }, 0);
            }
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }

    //固定返回promise 是就直接返回 不是就包装成promise返回
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value
        }
        return new MyPromise((resolve, _reject) => resolve(value))
    }

    static reject(reason) {
        return new Promise((_resolve, reject) => reject(reason))
    }

}