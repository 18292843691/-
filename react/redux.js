const initState = {
  count: {
    count: 1
  },
  user: {
    name: '123',
  }
}

const plan = (state = initState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}

function createStore(initState, {reducer}) {
  let state = initState

  const listeners = []

  const subscribe = (listener) => {
    listeners.push(listener)
  }

  const dispatch = (action) => {
    state = reducer(state, action)

    listeners.forEach(func => func())
  }

  const getState = () => {
    return state
  }

  dispatch({ type: Symbol() })

  return {
    getState,
    subscribe,
    dispatch,
  }
}

const store = createStore({}, {
  reducer: plan
})

// store.subscribe(() => {
//   let state = store.getState();
//   console.log(state.count);
// });

// /*自增*/
// store.dispatch({
//   type: 'INCREMENT'
// });
// /*自减*/
// store.dispatch({
//   type: 'DECREMENT'
// });
// /*我想随便改 计划外的修改是无效的！*/
// store.dispatch({
//   count: 'abc'
// });