/**
 * React 内部使用的特殊 Symbol，用于标识元素类型、属性等
 * 这些 Symbol 确保 React 能正确识别特殊结构，避免与用户定义的属性/类型冲突
 */

// 1. 标识 React 元素类型
export const REACT_ELEMENT_TYPE = Symbol.for('react.element');
// 用于判断一个对象是否为 React 元素（如 <div /> 会被标记为此类型）

export const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
// 标识 Fragment 元素（<>...</> 或 <Fragment>...</Fragment>）

export const REACT_PORTAL_TYPE = Symbol.for('react.portal');
// 标识 Portal 元素（用于将子节点渲染到不同 DOM 树中）

export const REACT_MEMO_TYPE = Symbol.for('react.memo');
// 标识被 React.memo 包装的组件（用于记忆化优化）

export const REACT_LAZY_TYPE = Symbol.for('react.lazy');
// 标识被 React.lazy 包装的懒加载组件


// 2. 标识特殊属性或行为
export const REACT_PROPS_SYMBOL = Symbol.for('react.props');
// 内部用于存储元素的 props 信息

export const REACT_KEY_SYMBOL = Symbol.for('react.key');
// 标识元素的 key 属性（用于列表 diff 算法）

export const REACT_REF_SYMBOL = Symbol.for('react.ref');
// 标识元素的 ref 属性（用于获取 DOM 节点或组件实例）


// 3. 标识 Hooks 相关类型
export const REACT_HOOK_TYPE = Symbol.for('react.hook');
// 内部用于标记 Hooks 函数（如 useState、useEffect）

export const REACT_CONTEXT_TYPE = Symbol.for('react.context');
// 标识 Context 对象（用于 Context.Provider 和 useContext）


// 4. 服务器端渲染（SSR）相关
export const REACT_SERVER_COMPONENT_TYPE = Symbol.for('react.server.component');
// 标识服务器组件（React 18+ 服务器组件特性）