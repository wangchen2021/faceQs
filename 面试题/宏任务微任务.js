// https://blog.csdn.net/weixin_74183307/article/details/148308708

// JavaScript 的事件循环遵循以下流程：

// 执行同步代码（宏任务）：
// 主线程按顺序执行同步代码，遇到异步任务（如 setTimeout、Promise）时将其放入对应队列。
// 执行所有微任务：
// 当前宏任务执行完毕后，立即清空微任务队列。微任务队列中的任务会依次执行，即使在微任务中添加新的微任务也会继续执行。
// 渲染更新（浏览器环境）：
// 如果需要，浏览器会进行 UI 渲染。
// 执行下一个宏任务：
// 从宏任务队列中取出下一个任务执行，重复上述流程。

setTimeout(()=>{
  new Promise(resolve =>{
  	resolve();
  }).then(()=>{
  	console.log('test');
  });

  console.log(4);
});

new Promise(resolve => {
  resolve();
  console.log(1)
}).then( () => {
  console.log(3);
  Promise.resolve().then(() => {
    console.log('before timeout');
  }).then(() => {
    Promise.resolve().then(() => {
      console.log('also before timeout')
    })
  })
})
console.log(2);

// 1
// 2
// 3
// before timeout
// also before timeout
// 4
// test
