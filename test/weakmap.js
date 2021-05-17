// weakmap.js
const objNum = 10 * 1024 * 1024;
const useType = 1; // 修改 useType 值来测试Map和WeakMap
const curType = useType == 1 ? "【Map】" : "【WeakMap】";
let arr = new Array(objNum);

function usageSize() {
  const used = process.memoryUsage().heapUsed;
  return Math.round((used / 1024 / 1024) * 100) / 100 + "M";
}

if (useType == 1) {
  global.gc();
  console.log(objNum + "个" + curType + "占用内存：" + usageSize());

  let map = new Map();
  map.set(arr, 1);
  // arr[0] = map

  global.gc();
  console.log(objNum + "个" + curType + "占用内存：" + usageSize());

  arr = null;
  // map = null
  global.gc();
  console.log(objNum + "个" + curType + "占用内存：" + usageSize());

  // 10485760个【Map】占用内存：81.77M
  // 10485760个【Map】占用内存：81.95M
  // 10485760个【Map】占用内存：81.95M
  console.log("=====");
} else {
  global.gc();
  console.log(objNum + "个" + curType + "占用内存：" + usageSize());

  let map = new WeakMap();
  map.set(arr, 1);
  // arr[0] = map

  global.gc();
  console.log(objNum + "个" + curType + "占用内存：" + usageSize());

  arr = null;
  // map = null
  global.gc();
  console.log(objNum + "个" + curType + "占用内存：" + usageSize());

  // 10485760个【WeakMap】占用内存：81.77M
  // 10485760个【WeakMap】占用内存：81.95M
  // 10485760个【WeakMap】占用内存：1.95M
  // =====
  console.log("=====");
}
