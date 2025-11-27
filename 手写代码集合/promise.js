class MyPromise {
  // 定义三种状态
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = MyPromise.PENDING; // 初始状态
    this.value = undefined; // 成功值
    this.reason = undefined; // 失败原因
    this.onFulfilledCallbacks = []; // 成功回调队列
    this.onRejectedCallbacks = []; // 失败回调队列

    // 成功回调
    const resolve = (value) => {
      // 只有 pending 状态才能改变
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED;
        this.value = value;
        // 执行所有成功回调
        this.onFulfilledCallbacks.forEach(callback => callback());
      }
    };

    // 失败回调
    const reject = (reason) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED;
        this.reason = reason;
        // 执行所有失败回调
        this.onRejectedCallbacks.forEach(callback => callback());
      }
    };

    // 执行器函数可能抛出异常
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then 方法（核心）
  then(onFulfilled, onRejected) {
    // 参数默认值处理（透传）
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    // 返回新的 Promise 实现链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      // 处理成功状态
      if (this.status === MyPromise.FULFILLED) {
        // 异步执行（确保 promise2 已初始化）
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      // 处理失败状态
      if (this.status === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      // 处理 pending 状态（收集回调）
      if (this.status === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  // 处理 then 回调返回值（Promise 解决过程）
  resolvePromise(promise2, x, resolve, reject) {
    // 避免循环引用
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // x 是 Promise 实例
    if (x instanceof MyPromise) {
      x.then(resolve, reject);
    } 
    // x 是对象或函数（可能是其他 Promise 实现）
    else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false; // 防止多次调用
      try {
        const then = x.then;
        // x 是 thenable 对象
        if (typeof then === 'function') {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } 
        // x 是普通对象
        else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } 
    // x 是普通值
    else {
      resolve(x);
    }
  }

  // catch 方法（语法糖）
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // finally 方法
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason; })
    );
  }

  // 静态 resolve 方法
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value));
  }

  // 静态 reject 方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  // 静态 all 方法
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('参数必须是数组'));
      }

      const results = [];
      let completed = 0;

      if (promises.length === 0) return resolve(results);

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          (res) => {
            results[index] = res;
            completed++;
            if (completed === promises.length) {
              resolve(results);
            }
          },
          (err) => reject(err)
        );
      });
    });
  }

  // 静态 race 方法
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('参数必须是数组'));
      }

      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
}



// ------------------- 测试用例 -------------------
// 基础测试
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
    // reject('失败');
  }, 1000);
}).then((res)=>{
    console.log(res);
})

// promise
//   .then(res => {
//     console.log(res); // 成功
//     return new MyPromise(resolve => resolve('链式调用'));
//   })
//   .then(res => {
//     console.log(res); // 链式调用
//     throw new Error('手动抛出异常');
//   })
//   .catch(err => {
//     console.log(err.message); // 手动抛出异常
//   })
//   .finally(() => {
//     console.log('finally 执行');
//   });

// // Promise.all 测试
// MyPromise.all([
//   MyPromise.resolve(1),
//   2,
//   new MyPromise(resolve => setTimeout(() => resolve(3), 500))
// ]).then(res => console.log(res)); // [1, 2, 3]

// // Promise.race 测试
// MyPromise.race([
//   new MyPromise((resolve, reject) => setTimeout(() => reject('超时'), 1000)),
//   new MyPromise(resolve => setTimeout(() => resolve('快速响应'), 500))
// ]).then(res => console.log(res)); // 快速响应