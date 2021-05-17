# React 的理解
是一个由数据驱动的UI框架。从当初的手动操作 dom 、进化到由数据驱动，前端不用将精力过多的关注在 dom 中，框架通过 diff 算法算出最优的 dom 节点移动条件，大大简化了前端的开发中对 dom 心智负担。可以将更多的精力放在业务层。在业务层可以通过组件化的方式进行相同功能复用。 有时候业务过于定制性过高、可复用的时图层较少， react 16.7开始，出了 hooks ，将副作用从视图层抽离出去，没有了生命周期的概念、和以往的开发思想不太一样。

## Q: 什么是 hooks，为什么要引入 hooks
1. 组件之间难以复用状态逻辑 
  - 过去常见的解决方案是context、高阶组件HOC、render props 及状态管理(Redux、Mobx)框架

hooks 解决了 functionComponents 没有状态的处境、
对比 classComponents 、更好的实践了 React UI = Fn(data) 函数式编程的思想；
对比 classCOmponents 书写的代码量更少一些、有组合优于继承的思想，class 继承过重、为了一个西瓜得到了整片森林(比如我只需要某一个类中的某一个方法，我却不得不继承整个类)

### why hooks 的限制
1. 不要在循环、条件或嵌套函数中调用 Hook；
2. 在 React 的函数组件中调用 Hook。

hooks 在 fiber 中是以链表的形式存储的，如果被循环或者条件判断影响，就会导致拿到的 hook 不正确

#### 对比 Redux 和 Mobx、对比现有的状态管理框架 recoil、hox、useReducer、context、useSWR/useRequest/useGral
1. Redux

action => reduce(state, action) => state

- 纯函数
- 通过提交一个 action 触发 reducer、返回新的 state、数据流比较容易掌控
- reducer 中也可通过 immer 插件来直接修改 state 值(immer 不可变数据的库)

缺点：
需要书写很多额外代码、比较麻烦

1. Mobx
- 数据是可变的、有时候追溯数据变动困难
- 通过 proxy 代理监听数据、直接修改数据即可触发数据变更、（与其他代理库冲突如：rxjs、TODO:没有尝试过）

## Q: 什么是 diff 算法
由于对比树的变更需要o(n^3)的复杂度、对于庞大的dom树来说成本太大，所以react团队有了三个约定

由于跨层级dom移动的情况比较少见，所以对比时只对比同一层级的节点
对于同一层级的不同type，认为是一次替换，会直接替换他的节点包括他的子孙节点
同一层级的相同type，通过key来区分是移动还是其他操作

- 对于单节点的diff
先对比key、再对比type

1. 都相同则代表可以复用
2. key相同但是type不同，则将该fiber及其兄弟fiber标记为删除
3. key不同，将该fiber标记为删除

- 对于多节点的diff
更新的对象为数组，同级的 fiber 节点则为单链表、所以无法双指针遍历
1. 第一轮遍历，处理更新的节点
- 相同则复用
- key 不同导致不可复用，立即跳出整个遍历，第一轮遍历结束。
- key 相同但是 type 不同、将旧的fiber标记为deletion、继续遍历

- old 遍历完并且 new 遍历完、理想情况，只需一轮遍历，diff结束

1. 第二轮遍历，处理不属于更新的节点
- old 遍历完、new 没有遍历完、则遍历后续 new 的标记为 新增
- new 遍历完、old 没有遍历完、则遍历 old 后续标记为 deletion
- old 和 new 都没遍历完(处理移动节点)
  1. 移动位置需要利用 key，将未处理的 oldfiber 存入以 key 为索引的 Map 中
  2. 遍历 new 数组、根据 new[i].key 可以直接找到 Map 中对应的 oldFiber
`Q: 节点是否移动是以什么为参照物？`
以最后一个可复用的 oldFiber 的索引(`lastPlacedIndex`)作为参考

oldIndex 表示遍历到的可复用节点在 oldFiber 中的位置索引。如果oldIndex < lastPlacedIndex，代表本次更新该节点需要向右移动。

lastPlacedIndex 初始为0，每遍历一个可复用的节点，如果 oldIndex >= lastPlacedIndex，则 lastPlacedIndex = oldIndex。

我们以为从 abcd 变为 dabc，只需要将d移动到前面。

但实际上React保持 d 不变，将 abc 分别移动到了d的后面。

从这点可以看出，考虑性能，我们要尽量减少将节点从后面移动到前面的操作。

## Q: 什么是 fiber 架构
由于 react 16.7 之前采用的是 stack reconciler、每一次触发更新后，会不回头的递归整个dom树并做出变更，当节点树特别大的时候会导致主线程被卡住，无法执行任何操作，违反人机交互。由于之前的架构无法中断操作，所以只能重写了整个架构。

fiber 是由链表构成的元素节点，将递归遍历改成了循环，每次遍历时会检查当前是否有紧急任务，如果有紧急任务会将当前任务中断，执行紧急任务结束后会重新触发更新，整个更新过程分为 render 阶段和 commit 阶段、在 render 阶段将根据mount还是update选择创建fiber或者标记需要变更的操作，形成一条effectlist单链表，然后在 commit 时同步的触发这些变更并触发相应的副作用。

由于 fiber 架构的 render 阶段会被打断重新渲染，由此在 render 触发的生命周期会触发多次，所以被标记为了 unsafe、


# react 生命周期

## Mounting
“Render 阶段”
1. consturctor
2. getDerivedStateFromProps
3. render
“Pre-commit 阶段”

“Commit 阶段”
<!-- 4. UNSAFE_componentWillMount() // delete -->
4. componentDidMount
<!-- componentWillUnmount -->

## Update
### 自己的 state 更新
“Render 阶段” 纯净且不包含副作用。可能会被 React 暂停，中止或重新启动。
<!-- 1. unsafe_componentWillRecevieProps -->
1. getDerivedStateFromProps
2. shouldComponentUpdate
<!-- 3. UNSAFE_componentWillUpdate -->
4. render
“Pre-commit 阶段” 可以读取 DOM。
5. getSnapShotBeforeUpdate
“Commit 阶段” 可以使用 DOM，运行副作用，安排更新。
6. componentDidUpdate
<!-- componentWillUnmount -->