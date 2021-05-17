
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)

    if (poolLimit <= array.length) {
      const e = p.then(executing.splice(executing.indexOf(e), 1))
      executing.push(e)

      if (poolLimit <= executing.length) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

// 返回结果顺序不一定
const p_all_limit = (list, max, fn) => {
  const queue = list.slice()
  const result = []
  let cnt = 0

  return new Promise((resolve) => {
    const next = async () => {
      if (!queue.length) {
        if(cnt === list.length) {
          resolve(result)
        }
        return
      }

      const item = queue.shift()
      const res = await fn(item)
      result.push(res)
      cnt++
      next()
    }

    Array.from(new Array(max)).map(() => {
      next()
    })
  })
}

const p_all_limit_queue = (list) => {
  return new Promise(async (resolve) => {
    const res = list.reduce((acc, cur) => {
      return acc.then(cur)
    }, Promise.resolve())

    resolve(res)
  })
}

const p_all_limit_concurrent = (list, max, fn) => {
  const queue = []
  let result = []
  return new Promise(async res => {
    for (let i = 0; i < list.length; i+=max) {
      queue.push(list.slice(i, i + max))
    }

    for await(const item of queue) {
      result = result.concat(await Promise.all(item.map(fn)))
    }

    res(result)
  })
}

const test = (a = 1) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(a)
    }, a * 1000)
  })
}
const list = [1, 2, 3, 6, 5, 4]

p_all_limit(list, 2, test).then((res) => {
  console.log('p_all_limit result', res)
})

class LimitQueue {
  constructor(options) {
    this.concurrent = options.concurrent
    this.queue = options.list || []
    this.stop = false
    this.result = []
  }

  add(item) {
    this.queue.push(item)
  }

  run() {
    if(!this.queue.length || this.stop) {
      return
    }

    const item = this.queue.shift()
    const res = item.call(null)
    this.result.push(res)
    this.run()
  }

  start() {
    for(let i = 0; i < this.concurrent; i++) {
      this.run()
    }
  }

  stop() {
    this.stop = true
  }

  getSize() {
    return this.queue.length
  }

  getResult() {
    return this.result
  }
}

const limit = new LimitQueue({concurrent: 4, list: list.map(() => test)})

limit.start()