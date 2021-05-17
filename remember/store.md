
状态管理比较

Redux: 
y:
- Pure data

Q:
- 使用较繁琐

Redux-tookit
- 官方提供
- 集成了thunks、
- 支持 slice、将 state、redux、action 集中管理
- ts 支持友好

Mobx: / mobx-react-lite
自动响应式
Q:
- 数据可变
- 代理数据、与其他代理数据有冲突，如rxjs

Akita:
基于class 没看。。。

hooks用法：
```js
export function useUsersFacade(): [UserState, Function, Function] {
  const setActive = (id: ID) => usersService.setActive(id);
  const setUser = (newUser: User) => usersService.updateActive(newUser);
  const [state, setState] = useState({ users: [], active: null } as UserState); 

  /**
   * Load all users and build selectors for `users` or `active` state changes
   * Manage subscriptions with auto-cleanup
   */
  useEffect(() => {
    usersService.loadAll();
    
    const subscriptions: Subscription[] = [
      onEmit<User[]>(usersQuery.users$, users => setState(state => ({ ...state, users  })) ),
      onEmit<User>(usersQuery.active$, active => setState(state => ({ ...state, active })) )
    ];

    return () => { subscriptions.map(it => it.unsubscribe()) };
  },[]);

  return [state, setActive, setUser]
}
```
![](https://user-images.githubusercontent.com/210413/61995713-a2b32600-b051-11e9-9d0f-d1c0bc619980.png)

recoil: hooks state
- api 少
- 基于 hooks
- Pre-Fetching
- Concurrent Requests

```js
const userNameQuery = selectorFamily({
  key: 'UserName',
  get: userID => async () => {
    const response = await myDBQuery({userID});
    if (response.error) {
      throw response.error;
    }
    return response.name;
  },
});

function UserInfo({userID}) {
  const userName = useRecoilValue(userNameQuery(userID));
  return <div>{userName}</div>;
}
```
缺点：
- 有自己的 api 、有学习成本

Rematch
```js
import { createModel } from '@rematch/core'
import { RootModel } from './models'

export const count = createModel<RootModel>()({
    state: 0, // initial state
    reducers: {
        // handle state changes with pure functions
        increment(state, payload: number) {
            return state + payload
        },
    },
    effects: (dispatch) => ({
        // handle state changes with impure functions.
        // use async/await for async actions
        async incrementAsync(payload: number, state) {
            console.log('This is current root state', state);
            await new Promise(resolve => setTimeout(resolve, 1000))
            dispatch.count.increment(payload)
        },
    }),
});
```

- 支持插件

1. immer
2. select(reselect)
3. loading
4. updated
5. persist

```js
init({
  models,
    plugins: [immerPlugin()],
})

export const todo = {
    state: [
        {
            todo: 'Learn typescript',
            done: true,
        },
        {
            todo: 'Try immer',
            done: false,
        },
    ],
    reducers: {
        done(state) {
      // mutable changes to the state
            state.push({ todo: 'Tweet about it' })
            state[1].done = true
            return state
        },
        // when 'reset' reducer is executed, the state will be set
        // to 'undefined' because reducer doesn't return the next state
        reset(state) {
                state[0].done = false
        },
    },
}
```

Hooks
逻辑复用、但数据不互通

React-query
- 缓存结果、跨组件请求会直接返回缓存数据
- Loading、error、处理、自动重试、聚焦自动重新请求数据、

Swr、
- 缓存结果、跨组件请求会直接返回缓存数据
- Loading、error、处理、自动重试、聚焦自动重新请求数据、
- 主要基于get、对post等不友好

graphql

- 真正按需请求数据

- 缓存结果、跨组件请求会直接返回缓存数据
- Loading、error、处理、自动重试、聚焦自动重新请求数据、

- 支持ssr
- 支持mock
- 手动触发


缺点：
基于 graphql 、有学习成本
需要服务器支持
