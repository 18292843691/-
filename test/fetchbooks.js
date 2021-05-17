const dbList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

const getBooksInfo = () => {
  const fetchBooksInfo = (list) =>
    list.map((i) => {
      return dbList.find((d) => d.id === i);
    });

  // 对 id 重复进行处理
  const uniqArr = (arr) => Array.from(new Set(arr));

  let lastCall = Date.now();
  let isFirst = true
  let reqIds = []

  const fetchData = (list) => {
    const resultList = fetchBooksInfo(uniqArr(list));
    const rejIds = [];
    // 要考虑服务端出错的情况，比如批量接口请求 [123, 446] 书目信息，但是服务端只返回了书目 123 的信息。此时应该进行合理的错误处理。
    reqIds.forEach((i) => {
      if (resultList.findIndex((r) => r?.id === i) === -1) {
        rejIds.push(i);
      }
    });

    return {
      success: resultList,
      rejctList: rejIds
    }
  }

  return (ids) => {
    typeof ids === "number" ? reqIds.push(ids) : reqIds = reqIds.concat(ids);

    // fetchBooksInfo 已经给出，但是这个接口最多只支持 100 个 id 的查询。
    if (reqIds.length > 100) {
      const result = fetchData(reqIds)
      console.log('result', result)
      res(result)
      return
    }

    // 注意这里必须只发送一个请求，也就是说调用了一次 fetchBooksInfo。
    if (Date.now() - lastCall < 200 && !isFirst) {
      return
    }
    isFirst = false

    return new Promise((res) => {
      setTimeout(() => {
        const result = fetchData(reqIds)
        console.log('result', result)
        res(result)
        reqIds = [];
      }, 200);
    });
  }
};
const bk = getBooksInfo()

bk(1)
bk(2)
bk([1,2,3,5])

setTimeout(() => {
  bk([1,2,3,5])
}, 1500);