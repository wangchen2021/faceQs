# React-reconciler

## `Fiber`

纤程 react16引入
是VDOM的增强渲染，使VDOM可以进行增量式渲染 

- 把渲染工作拆分成多个块，分到多个帧进行处理
- 支持暂停 中止或者复用的工作单元
- 给不同类型的work赋予优先级
- 为并发提供基础 
- 更好的支持边界错误

一个组件可以有一个或者多个fiber

```typescript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */


// A Fiber is work on a Component that needs to be done or was done. There can
// be more than one per component.
export type Fiber = {
  // These first fields are conceptually members of an Instance. This used to
  // be split into a separate type and intersected with the other Fiber fields,
  // but until Flow fixes its intersection bugs, we've merged them into a
  // single type.

  // An Instance is shared between all versions of a component. We can easily
  // break this out into a separate object to avoid copying so much to the
  // alternate versions of the tree. We put this on a single object for now to
  // minimize the number of objects created during the initial render.

  // Tag identifying the type of fiber.
  // 标记组件类型 原生，函数组件，类组件，fragment等
  tag: WorkTag,

  // Unique identifier of this child.
  // 在当前层级的唯一性id
  key: ReactKey,

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  // 和type一样
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  type: any,

  // The local state associated with this fiber.
  // 原生就是dom 函数组件就是函数 类组件就是类 说白了就是vue vnode的type
  stateNode: any,

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  // 指向父fiber
  return: Fiber | null,

  // Singly Linked List Tree Structure.
  // 第一个子fiber
  child: Fiber | null,
  // 下一个兄弟fiber
  sibling: Fiber | null,
  // 记录在当前层级的位置下标
  index: number,

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref:
    | null
    | (((handle: mixed) => void) & {_stringRef: ?string, ...})
    | RefObject,

  refCleanup: null | (() => void),

  // Input is the data coming into process this fiber. Arguments. Props.
  // 新的props
  pendingProps: any, // This type will be more specific once we overload the tag.

  // 老的props
  memoizedProps: any, // The props used to create the output.

  // A queue of state updates and callbacks.
  // 更新队列
  updateQueue: mixed,

  // The state used to create the output
  //  函数组件 存hook0
  //  类组件 存class的state
  memoizedState: any,

  // Dependencies (contexts, events) for this fiber, if it has any
  // 依赖 例如context
  dependencies: Dependencies | null,

  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  mode: TypeOfMode,

  // Effect 当前组件要干嘛 首次渲染,更新等 也是类似vue节点type的二进制运算
  flags: Flags,
  subtreeFlags: Flags,
  // 记录要删除的子节点
  deletions: Array<Fiber> | null,

  lanes: Lanes,
  childLanes: Lanes,

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  // 存储更新前的fiber
  alternate: Fiber | null,

  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only

  _debugInfo?: ReactDebugInfo | null,
  _debugOwner?: ReactComponentInfo | Fiber | null,
  _debugStack?: Error | null,
  _debugTask?: ConsoleTask | null,
  _debugNeedsRemount?: boolean,

  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null,
};


```