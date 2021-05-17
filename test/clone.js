// Object.assgin()
// {...{}}
// JSON.stringify() => JSON.parse()

const b = new Function();

const c = new Date();

const obj = {
  a: {
    value: 1,
    b: b,
    c: c,
  },
  b: b,
  c: c,
  [Symbol("hx")]: 123,
  valueOf: function () {
    return 124;
  },
};

obj.__proto__ = { a: b };
obj.obj = obj;

Reflect.defineProperty(obj, "c", {
  enumerable: false,
});

const clone = (target) => {
  let newObj = Object.create({});
  for (item in target) {
    if (typeof item === "object") {
      clone(item);
    } else {
      newObj[item] = target[item];
    }
  }
  return newObj;
};

// 相比Map之下，原生的 WeakMap 持有的是每个键对象的“弱引用”，这意味着在没有其他引用存在时垃圾回收能正确进行。原生 WeakMap 的结构是特殊且有效的，其用于映射的 key 只有在其没有被回收时才是有效的。
// 正由于这样的弱引用，WeakMap 的 key 是不可枚举的 (没有方法能给出所有的 key)。如果key 是可枚举的话，其列表将会受垃圾回收机制的影响，从而得到不确定的结果。因此，如果你想要这种类型对象的 key 值的列表，你应该使用 Map。
const deepClone = (target, hash = new WeakMap()) => {
  if (Object.prototype.toString.call(target) === "object Date")
    return new Date(target); // 日期对象直接返回一个新的日期对象
  if (Object.prototype.toString.call(target) === "object RegExp")
    return new RegExp(target);

  if (hash.has(target)) {
    return hash.get(target);
  }
  let allDesc = Object.getOwnPropertyDescriptors(target);

  // 继承原型链
  let cloneObj = Object.create(Object.getPrototypeOf(target), allDesc);

  // 遍历传入参数所有键的特性
  hash.set(target, cloneObj);
  for (let key of Reflect.ownKeys(target)) {
    // console.log('obj[key]', key, target[key])
    cloneObj[key] =
      typeof target[key] === "object" && !target[key] instanceof Function
        ? deepClone(target[key], hash)
        : target[key];
  }

  // console.log(cloneObj)
  return cloneObj;
};

const temp1 = clone(obj);
const temp2 = deepClone(obj);

temp1.a = 0;
temp1.obj.a = 0;

temp2.b = 0;
temp2.obj.b = 0;

console.log(obj);
console.log(temp1, temp2);


var set1 = ";,/?:@&=+$";  // 保留字符
var set2 = "-_.!~*'()";   // 不转义字符
var set3 = "#";           // 数字标志
var set4 = "ABC abc 123"; // 字母数字字符和空格

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

const new2 = (func, ...args) => {
  const target = Object.create(func.prototype)

  const result = func.apply(target, [...args])

  return typeof result === 'object' ? result : target
}

const apply = (func, context, ...args) => {
  const self = context || window

  const target = Object.create(func)
  const selfKey = Symbol('key')
  target[selfKey] = func

  const result = target[selfKey].apply(self, args)

  delete target[selfKey]

  return result
}