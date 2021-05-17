```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```
render => beginWrok => completeWork => commit => before Mutation => mutation => layout

通过遍历的方式实现可中断的递归，所以performUnitOfWork的工作可以分为两部分：“递”和“归”。

# “递”阶段
首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用`beginWork`方法

## beginWork
```ts
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  // mount时：根据tag不同，创建不同的子Fiber节点
}
```

## reconcileChildren

- 对于mount的组件，他会创建新的子Fiber节点
- 对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的`Diff算法`），将比较的结果生成新Fiber节点

## effectTag
我们知道，render阶段的工作是在内存中进行，当工作结束后会通知Renderer需要执行的DOM操作。要执行DOM操作的具体类型就保存在fiber.effectTag中。
```js
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

`通过二进制表示effectTag，可以方便的使用位操作为fiber.effectTag赋值多个effect`

# “归”阶段
在“归”阶段会调用`completeWork`处理Fiber节点。
## completeWork
类似beginWork，completeWork也是针对不同fiber.tag调用不同的处理逻辑。

```ts
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // update的情况
  // 1.当update时，Fiber节点已经存在对应DOM节点，所以不需要生成DOM节点。需要做的主要是处理props
  // onClick、onChange等回调函数的注册、处理style prop、处理DANGEROUSLY_SET_INNER_HTML prop、处理children prop


  // mount的情况
  // 1.为Fiber节点生成对应的DOM节点
  // 2. 将子孙DOM节点插入刚生成的DOM节点中
  // 与update逻辑中的updateHostComponent类似的处理props的过程
}
```
## effectList
`Q: ` 还有一个问题：作为DOM操作的依据，commit阶段需要找到所有有effectTag的Fiber节点并依次执行effectTag对应操作。难道需要在commit阶段再遍历一次Fiber树寻找effectTag !== null的Fiber节点么？

`A: `为了解决这个问题，在completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在effectTag的Fiber节点会被保存在一条被称为effectList的单向链表中。

effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。

# Renderer工作的阶段 - Commit 阶段
commit阶段的主要工作（即Renderer的工作流程）分为三部分：

- before mutation阶段（执行DOM操作前）

- mutation阶段（执行DOM操作）

- layout阶段（执行DOM操作后）

## before mutation阶段（执行DOM操作前）

before mutation阶段的代码很短，整个过程就是遍历effectList并调用commitBeforeMutationEffects函数处理。

1. 处理DOM节点渲染/删除后的 autoFocus、blur 逻辑。

2. 调用getSnapshotBeforeUpdate生命周期钩子。

从Reactv16开始，componentWillXXX钩子前增加了UNSAFE_前缀。

究其原因，是因为Stack Reconciler重构为Fiber Reconciler后，render阶段的任务可能中断/重新开始，对应的组件在render阶段的生命周期钩子（即componentWillXXX）可能触发多次。

为此，React提供了替代的生命周期钩子getSnapshotBeforeUpdate。

我们可以看见，getSnapshotBeforeUpdate是在commit阶段内的before mutation阶段调用的，由于commit阶段是同步的，所以不会遇到多次调用的问题。

3. 调度useEffect。

`Q: `我们接下来讨论useEffect如何被异步调度，以及为什么要异步（而不是同步）调度。

在completeWork一节我们讲到，effectList中保存了需要执行副作用的Fiber节点。其中副作用包括

- 插入DOM节点（Placement）
- 更新DOM节点（Update）
- 删除DOM节点（Deletion）
除此外，当一个FunctionComponent含有useEffect或useLayoutEffect，他对应的Fiber节点也会被赋值effectTag。

所以整个useEffect异步调用分为三步：

1. before mutation阶段在scheduleCallback中调度flushPassiveEffects
2. layout阶段之后将effectList赋值给rootWithPendingPassiveEffects
3. scheduleCallback触发flushPassiveEffects，flushPassiveEffects内部遍历rootWithPendingPassiveEffects

与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

可见，useEffect异步执行的原因主要是防止同步执行时阻塞浏览器渲染。

## mutation阶段（执行DOM操作）

类似before mutation阶段，mutation阶段也是遍历effectList，执行函数。这里执行的是commitMutationEffects。

1. 根据ContentReset effectTag重置文字节点
2. 更新ref
3. 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)

## layout阶段（执行DOM操作后）

与前两个阶段类似，layout阶段也是遍历effectList，执行函数。

具体执行的函数是commitLayoutEffects。

### commitLayoutEffects
commitLayoutEffects一共做了两件事：

1. commitLayoutEffectOnFiber（调用生命周期钩子和hook相关操作）

2. commitAttachRef（赋值 ref）

### commitLayoutEffectOnFiber

对于ClassComponent，他会通过current === null?区分是mount还是update，调用componentDidMount或componentDidUpdate。

`触发状态更新的this.setState如果赋值了第二个参数回调函数，也会在此时调用。`

对于FunctionComponent及相关类型，他会调用useLayoutEffect hook的回调函数，调度useEffect的销毁与回调函数

对于HostRoot，即rootFiber，如果赋值了第三个参数回调函数，也会在此时调用。

### commitAttachRef
获取DOM实例，更新ref。

### current Fiber树切换
`root.current = finishedWork;`

至此，整个layout阶段就结束了

# Diff
1. 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用他。

2. 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。
3. 开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定。

我们可以从同级的节点数量将Diff分为两类：

- 当newChild类型为object、number、string，代表同级只有一个节点

- 当newChild类型为Array，同级有多个节点

## 单节点
先判断 key、再判断 type

## 多节点
不同操作的优先级是相同的，在日常开发中，相较于新增和删除，更新组件发生的频率更高。所以Diff会优先判断当前节点是否属于更新。

`在我们做数组相关的算法题时，经常使用双指针从数组头和尾同时遍历以提高效率，但是这里却不行。

虽然本次更新的JSX对象 newChildren为数组形式，但是和newChildren中每个组件进行比较的是current fiber，同级的Fiber节点是由sibling指针链接形成的单链表，即不支持双指针遍历。

即 newChildren[0]与fiber比较，newChildren[1]与fiber.sibling比较。

所以无法使用双指针优化。`

基于以上原因，Diff算法的整体逻辑会经历两轮遍历：

1. 第一轮遍历：处理更新的节点。

2. 第二轮遍历：处理剩下的不属于更新的节点。

## 第一轮遍历
## 第二轮遍历

# Fiber 节点
```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```
对应的Fiber树结构：

![](https://react.iamkasong.com/img/fiber.png)

render阶段会依次执行：
```
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "i am" Fiber beginWork
5. "i am" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork
```

# mount

## renderer
1. beginWork => 建立 fiber 树
2. completeWork => 为 fiber 生成 dom 节点，建立子孙结构，绑定事件、props等

## commit
1. before mutation => 执行 dom 操作前、处理 dom 节点 autofoucs、blur、调用 getSnapshotBeforeUpdate、调用 useEffect
2. mutation => 执行 dom 操作
- 递归调用Fiber节点及其子孙Fiber节点中fiber.tag为ClassComponent的componentWillUnmount (opens new window)生命周期钩子，从页面移除Fiber节点对应DOM节点
- 解绑ref
- 调度useEffect的销毁函数
3. layout => 执行 dom 操作后、
- 遍历effectList、调用 didMount
- current 指向 workInProgress

# update
## renderer
1. beginWork => diff 算法、生成 effectList
2. completeWork => 不需要生成即诶单、主要是处理 props、函数的注册等

## commit
1. before mutation => 执行 dom 操作前、处理 dom 节点 autofoucs、blur、调用 getSnapshotBeforeUpdate、调用 useEffect
2. mutation => 执行 dom 操作
- 递归调用Fiber节点及其子孙Fiber节点中fiber.tag为ClassComponent的componentWillUnmount (opens new window)生命周期钩子，从页面移除Fiber节点对应DOM节点
- 解绑ref
- 调度useEffect的销毁函数
3. layout => 执行 dom 操作后、current 指向 workInProgress
- 遍历effectList、调用 didUpdate
- current 指向 workInProgress