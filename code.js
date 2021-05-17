const { default: axios } = require("axios");

// =============================== //
const a = [1, 2, 3];
a.join = a.shift;
if (a == 1 && a == 2 && a == 3) {
  // a.shift(join) == 1 &&  a.shift(join) == 2 &&  a.shift(join) == 3
  console.log("ok");
}
// ok
//  [1] == '1' => [1].join() == '1' 对比时会隐式调用join，此时被换成了shift，弹出了头部元素
// =============================== //
const pipe = (...functions) => (input) => {
  console.log("functions", functions);
  return functions.reduce((acc, fn) => {
    console.log("acc", acc);
    return fn(acc);
  }, input);
};

const func1 = (a) => {
  console.log("func1", a);
  return a;
};

const func2 = (a) => {
  console.log("func2", a);
  return a;
};

const func3 = (a) => {
  console.log("func3", a);
  return a;
};

pipe(func1, func2, func3)(3);

// =============================== //
// reduce 实现
Function.prototype.reduce =
  Function.prototype.reduce ||
  function (func, initValue) {
    const arrs = this;
    const startValue = initValue || arrs[0];
    const startIndex = initValue ? 0 : 1;
    let result = startValue;

    arrs.slice(startIndex).forEach((item, idx) => {
      result = func(result, item, idx + startIndex, arrs);
    });
  };

// =============================== //

const compose = (...funcs) => {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((acc, cur) => (...arg) => {
    return cur(acc(arg));
  });
};

// =============================== //

const dbList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

const getBooksInfo = (ids) => {
  const fetchBooksInfo = (list) =>
    list.map((i) => {
      return dbList.find((d) => d.id === i);
    });
  const uniqArr = (arr) => Array.from(new Set(arr));
  let shouldOnceCall = false;
  let reqIds = ids === "number" ? reqIds.push(ids) : [].concat(ids);

  const fetchData = (list) => {
    const resultList = fetchBooksInfo(uniqArr(list));
    const rejIds = [];
    reqIds.forEach((i) => {
      if (resultList.findIndex((r) => r.id === i) === -1) {
        rejIds.push(i);
      }
    });

    return {
      success: resultList,
      rejctList: rejIds
    }
  }

  return (() => {
    console.log('shouldOnceCall', shouldOnceCall)
    return new Promise((res, rej) => {
      if (shouldOnceCall) {
        typeof ids === "number" ? reqIds.push(ids) : reqIds.concat(ids);
        if (reqIds.length > 100) {
          const result = fetchData(uniqArr(reqIds))
          console.log('result', result)
          res(result)
          return
        }
        return
      }
      shouldOnceCall = true
      console.log('set shouldOnceCall', shouldOnceCall)

      setTimeout(() => {
        console.log("setTimeout", uniqArr(reqIds));
        const result = fetchData(uniqArr(reqIds))
        console.log('result', result)
        res(result)
        shouldOnceCall = false;
        reqIds = [];
      }, 200);
    });
  })()
};
getBooksInfo(1)
getBooksInfo(2)

// =============================== //