## 个人笔记

https://zh-hans.react.dev/learn

视频资料：https://www.bilibili.com/video/BV1rz42167A6?spm_id_from=333.788.videopod.episodes&vd_source=2e335378575371c0ee42c4dc7ddc2978&p=4


1. 脚手架官网
https://cra.nodejs.cn/docs/getting-started/


2. 安装router
pnpm i react-router-dom 


3. 路由配置


上古版本：在页面中配置
  <BrowserRouter>
    <App />
  </BrowserRouter>,

现在都是配置，类似vue
（1）配置文件第一种依旧是使用jsx的方式，不支持写起来麻烦。
（2）对象方式配置，详细查看router.tsx


4. 路由模式
history和hash 同vue


5. ant desin react
https://4x-ant-design.antgroup.com/docs/react/introduce-cn


6. redux
https://www.redux.org.cn/


7. nestJs
https://www.nestjs.com.cn/controllers


8. axios
https://axios-http.com/zh/docs/intro


9. [useEffect]
    
(1)
`
  // 每次渲染后都会执行
  useEffect(() => {
    console.log('Effect executed');
    document.title = `Count: ${count}`;
  });
`

(2)
`
 // 只在挂载时执行
  useEffect(() => {
      fn() 
  },[]);
`

(3)
`
// 只在count变化时执行
 useEffect(() => {
    console.log('Count updated:', count);
    document.title = `Count: ${count}`;
  }, [count]); // 依赖 count
`

(4)
` 
// 清理函数 return会在组件卸载时执行
  useEffect(() => {
    let intervalId;
    
    if (isRunning) {
      // 启动定时器
      intervalId = setInterval(() => {
        console.log('Timer running...');
      }, 1000);
    }
    
    // 清理函数
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Timer cleaned up');
      }
    };
  }, [isRunning]);
`


