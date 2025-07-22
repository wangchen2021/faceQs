/**
 * 
 * @description promise 状态
    待定（pending）: 初始状态，既没有被兑现，也没有被拒绝；
    当执行executor中的代码时，处于该状态；
    已兑现（fulfilled）: 意味着操作成功完成；
    执行了resolve时，处于该状态；
    已拒绝（rejected）: 意味着操作失败；
    执行了reject时，处于该状态；
 */

const promise = new Promise((resolve, reject) => {
    resolve("success")
    reject("fail")
})
    .then((res) => {
        console.log(res);
        return 5 //当then方法中的回调函数返回一个结果时，那么它处于fulfilled状态，并且会将结果作为resolve的参数；
    })
    .then((res) => {
        console.log("1111", res);
        return 6
    })
    .then((res) => {
        console.log("2222", res);
        throw new Error("gg")
    })
    .catch((reject) => {
        console.log("reject", reject);
    })
    .finally(() => {
        console.log("end");
    })
// 一个Promise的then方法是可以被多次调用的：

// 每次调用我们都可以传入对应的fulfilled回调；
// 当Promise的状态变成fulfilled的时候，这些回调函数都会被执行；



// 在我们调用resolve的时候，如果resolve传入的值本身不是一个Promise，那么会将该Promise的状态变成 兑现（fulfilled）；
// 在之后我们去调用reject时，已经不会有任何的响应了（并不是这行代码不会执行，而是无法改变Promise状态）；

new Promise((resolve, reject) => {
    resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("第二个Promise的resolve")
        }, 3000);
    }))
}).then(res => {
    console.log("res:", res)
}).catch(err => {
    console.log("err:", err)
})

// 如果resolve中传入的是另外一个Promise，那么这个新Promise会决定原Promise的状态：


/**
 * @description Promise.all
 * 另外一个类方法是Promise.all：

它的作用是将多个Promise包裹在一起形成一个新的Promise；
新的Promise状态由包裹的所有Promise共同决定：

当所有的Promise状态变成fulfilled状态时，新的Promise状态为fulfilled，并且会将所有Promise的返回值组成一个数组；
当有一个Promise状态为reject时，新的Promise状态为reject，并且会将第一个reject的返回值作为参数；
 */

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("111")
    }, 1000);
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("222")
    }, 2000);
})

const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("333")
    }, 3000);
})

Promise.all([p1, p2, p3]).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})


/**
 * @description Promise.allSettled
 * all方法有一个缺陷：当有其中一个Promise变成reject状态时，新Promise就会立即变成对应的reject状态。
那么对于resolved的，以及依然处于pending状态的Promise，我们是获取不到对应的结果的；
在ES11（ES2020）中，添加了新的API Promise.allSettled：
该方法会在所有的Promise都有结果（settled），无论是fulfilled，还是reject时，才会有最终的状态；
并且这个Promise的结果一定是fulfilled的；
 */


const p11 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("111")
    }, 1000);
})

const p22 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("222")
    }, 2000);
})

const p33 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("333")
    }, 3000);
})

Promise.allSettled([p11, p22, p33]).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})


/**
 * @description Promise.race
 *  race方法
    如果有一个Promise有了结果，我们就希望决定最终新Promise的状态，那么可以使用race方法：
    race是竞技、竞赛的意思，表示多个Promise相互竞争，谁先有结果，那么就使用谁的结果；
 */
const p111 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("111")
    }, 1000);
})

const p222 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("err 222")
    }, 2000);
})

const p333 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("333")
    }, 3000);
})

Promise.race([p111, p222, p333]).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})


/**
 * @description Promise.any
 * any方法是ES12中新增的方法，和race方法是类似的：
   any方法会等到一个fulfilled状态，才会决定新Promise的状态；
   如果所有的Promise都是reject的，那么也会等到所有的Promise都变成rejected状态；
 */