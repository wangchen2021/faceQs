React 源码的执行流程可以分为 **初始化渲染** 和 **更新** 两大阶段，核心围绕 **虚拟 DOM（Virtual DOM）**、**协调（Reconciliation）** 和 **渲染（Commit）** 三个关键环节展开。以下是简化后的核心流程解析：


### **1. 初始化渲染流程**
当组件首次挂载（如 `ReactDOM.createRoot(root).render(<App />)`）时，执行流程如下：

#### **步骤 1：创建 Fiber 树（协调阶段 - Reconciliation）**
- **JSX 转换**：JSX 语法糖被 Babel 转换为 `React.createElement` 调用，生成 **虚拟 DOM 对象**（描述组件结构的纯 JS 对象）。
  ```jsx
  // JSX
  <div className="app">Hello</div>
  
  // 转换后
  React.createElement("div", { className: "app" }, "Hello");
  ```
- **Fiber 树构建**：虚拟 DOM 被转换为 **Fiber 节点树**（React 16+ 引入的工作单元结构）。每个 Fiber 节点对应一个组件/元素，包含：
  - `type`：组件类型（如 `div`、`FunctionComponent`）
  - `props`：传入的属性
  - `child`/`sibling`：指向子节点/兄弟节点（形成链表结构）
  - `stateNode`：对应的真实 DOM 节点（或类组件实例）
- **协调（Reconciliation）**：通过 **深度优先遍历（DFS）** 遍历 Fiber 树，确定哪些节点需要创建或更新。


#### **步骤 2：提交阶段（Commit）**
协调阶段完成后，进入提交阶段，执行真实 DOM 操作：
- **创建 DOM 节点**：根据 Fiber 树的叶子节点（如 `div`、`span`）创建真实 DOM 元素，并设置属性（`className`、`onClick` 等）。
- **挂载 DOM 树**：将创建的 DOM 节点插入到页面的根容器（如 `#root`）中。
- **执行副作用**：调用类组件的 `componentDidMount` 或函数组件的 `useEffect`（无依赖项的回调）。


### **2. 更新流程（状态/属性变化时）**
当组件状态（`setState`）或属性（`props`）变化时，触发更新流程：

#### **步骤 1：触发更新**
- 状态变化（如 `setState`、`useState` 的更新函数）会创建一个 **更新对象（Update）**，并加入到对应 Fiber 节点的更新队列中。
- React 调度器（`Scheduler`）根据更新优先级（如用户输入 > 动画 > 普通更新），决定何时处理该更新。


#### **步骤 2：重新协调（Reconciliation）**
- **创建新 Fiber 树**：以当前 Fiber 树（`current`）为基准，重新构建一棵 **新的 Fiber 树（`workInProgress`）**。
- **Diff 算法**：通过对比新旧 Fiber 节点的 `type` 和 `key`，判断节点是否可复用：
  - 若 `type` 和 `key` 相同，则复用节点并更新属性。
  - 若不同，则标记旧节点为删除，创建新节点。
- **标记副作用**：在遍历过程中，标记需要执行的副作用（如 DOM 插入、更新、删除，或 `useEffect` 清理函数）。


#### **步骤 3：提交更新（Commit）**
- **执行删除操作**：先删除标记为“删除”的旧节点，并调用对应的清理函数（如 `componentWillUnmount`、`useEffect` 的清理函数）。
- **执行更新操作**：更新需要修改的节点属性（如 `style`、`className`）。
- **执行插入操作**：将新创建的节点插入到 DOM 树中。
- **执行副作用**：调用类组件的 `componentDidUpdate` 或函数组件的 `useEffect` 回调。


### **3. 核心模块协作**
React 源码的执行依赖多个核心模块的协作：
- **React Core**：提供 `createElement`、`useState`、`useEffect` 等核心 API。
- **Reconciler**：负责协调阶段的 Fiber 树构建和 Diff 算法。
- **Scheduler**：调度更新任务的优先级，避免长时间阻塞主线程（通过 `requestIdleCallback` 或 `setTimeout` 模拟）。
- **Renderer**：不同平台的渲染实现（如 `react-dom` 负责浏览器 DOM，`react-native` 负责原生组件）。
- **Fiber 架构**：通过链表结构和可中断的遍历（利用 `requestIdleCallback`），实现“时间切片（Time Slicing）”，避免渲染卡顿。


### **简化流程图**
```
初始化渲染:
JSX → createElement → 虚拟DOM → Fiber树构建 → 提交（创建DOM并挂载）

更新流程:
状态变化 → 调度更新 → 新Fiber树构建（Diff） → 提交（更新/删除/插入DOM）
```

React 的核心设计目标是通过 **虚拟 DOM 和 Diff 算法** 减少真实 DOM 操作，通过 **Fiber 架构和时间切片** 优化渲染性能，最终实现高效的 UI 渲染。