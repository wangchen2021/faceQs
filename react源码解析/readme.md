# react源码解析

## react官网
https://zh-hans.react.dev/learn

## 视频解析
https://www.bilibili.com/video/BV198mKYYEKN/?spm_id_from=333.337.search-card.all.click&vd_source=2e335378575371c0ee42c4dc7ddc2978

https://www.bilibili.com/video/BV1NvCzYvEBT/?spm_id_from=333.337.search-card.all.click&vd_source=2e335378575371c0ee42c4dc7ddc2978

`curent:` https://www.bilibili.com/video/BV1NvCzYvEBT?spm_id_from=333.788.videopod.episodes&vd_source=2e335378575371c0ee42c4dc7ddc2978&p=16

***

## react迭代变化

1. 16.3 引入`fiber`
2. 16.8 引入`hook`

3. 17.0 垫脚石版本

- jsx转换 
老版本 `jsx` - > `React.createElement()`
需要引入`React`

新版本
可以单独使用jsx 不需要额外引用

- 事件委托
老版本都委托到`document`

新版本只委托到`react根节点`

4. 18.0 

老版本useState同步需要黑科
```javascript
// 这里会渲染两次处理
setTimeout(()=>{
    setData(newValue)
    setFlag(newFlag)
},1000)
```

新版本无效，用黑科技也是一次，可以用特点接口
```javascript
 flushSync(()=>{
    //...todo
 })
```

增加`<Suspense>`等待组件


## react基础规则

1. 组件化
2. 状态

- 数据变页面变的 `useState`
- 数据变页面不变的 `useRef`
- 数据变纯需要缓存 `useMemo`||`useCallBack`

***

- `useMemo`

（useMemo 是一个 React Hook，它在每次重新渲染的时候能够**缓存计算的结果**。）

你需要给 useMemo 传递两样东西：

一个没有任何参数的 calculation 函数，像这样 () =>，并且返回任何你想要的计算结果。
一个由包含在你的组件中并在 calculation 中使用的所有值组成的 依赖列表。
在初次渲染时，你从 useMemo 得到的 值 将会是你的 calculation 函数执行的结果。

在随后的每一次渲染中，React 将会比较前后两次渲染中的 所有依赖项 是否相同。如果通过 Object.is 比较所有依赖项都没有发生变化，那么 useMemo 将会返回之前已经计算过的那个值。否则，React 将会重新执行 calculation 函数并且返回一个新的值。

***

- `useCallback`
  
useCallback 是一个允许你在多次渲染中**缓存函数**的 React Hook。
当函数需要作为 props 传递给子组件时，若子组件是 React.memo 包裹的纯组件（避免不必要渲染），useCallback 可防止因「父组件重新渲染导致函数引用变化」而触发子组件无效渲染。
***

3. 单向数据流

## 状态共享

1. 状态提升
2. 第三方库
***
- redux工作流程
1. `store` 存储状态
2. `action` 描述发生什么的对象 修改状态的唯一途径
3. `reducer` 根据action修改状态
4. `middleware` 扩展处理 redux，异步action

state状态 页面发出action 通知reducer修改state
***

## `state` 和 `props`

1. `state`
变量改变  页面更新

2. `props`
不能修改，来源于父组件传递


## react组件

1. react dom组件
`<div/> <input>`

2. 类组件
3. 函数组件
4. react内置组件`<></>`
5. `SomeContent.Provider`||`SomeContent.Consumer`
6. `forwordRef`||`momo`||`lazy`||`createPortal`=`vue:<teleport>`


## context

1. 创建context
```javascript
// src/contexts/ThemeContext.js
import { createContext } from 'react';

// 创建主题上下文，默认值为 { theme: 'light', toggle: () => {} }
const ThemeContext = createContext({
  theme: 'light',
  toggle: () => {},
});

export default ThemeContext;
```

2. 传递
```javascript
// src/App.js
import { useState } from 'react';
import ThemeContext from './contexts/ThemeContext';
import Child from './Child';

function App() {
  // 定义需要共享的状态和方法
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    {/* 提供 Context：向子组件传递 theme 和 toggleTheme */}
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <h1>当前主题：{theme}</h1>
        <Child /> {/* 子组件（可多层嵌套） */}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
```

3. 使用
- useContext `const { theme } = useContext(ThemeContext);`
- `Context.Consumer` : 
```javascript
  <ThemeContext.Consumer>
        {/* 回调函数接收 value 并返回 JSX */}
        {({ theme, toggleTheme }) => (
          <div>
            <p>类组件主题：{theme}</p>
            <button onClick={toggleTheme}>切换</button>
          </div>
        )}
      </ThemeContext.Consumer>
```

- `类组件中使用 contextType`


## 脚手架
1. create-react-app
2. next.js 全栈框架
3. umi
4. vite
5. antd pro
6. Umi
7. Dva

## 性能优化

1. 复用组件
patchChild 深度优先 同层对比 注意key值使用

2. 避免不必要更新
- `memo`组件 两个参数 组件 和 对比函数（prev，next）
- `shouldComponentUpdate` 类组件专用
- `pureComponent` 类组件专用

3. 缓存策略 减少运算
- `useMomo`