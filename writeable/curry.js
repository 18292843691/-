// curry
function add(num1, num2) {
  return num1 + num2;
}
function curry(func) {
  const len = func.length
  let args = Array.prototype.slice.call(arguments, 1)
  console.log('start', arguments, args)

  return function replay() {
    
    const innerArgs = Array.prototype.slice.call(arguments)
    console.log('call', arguments, innerArgs)
    const finallyArgs = args.concat(innerArgs)
    console.log('fin', innerArgs, finallyArgs, len)
    if (finallyArgs.length >= len) {
      args = []
      const res = func.apply(this, finallyArgs)
      return res
    } else {
      args = args.concat(innerArgs)
      return replay
    }
  }
}

var curriedAdd = curry(add)
console.log(add.length, add.name)

console.log(curriedAdd(1,2))
console.log(curriedAdd(1)(2))

curriedAdd(1)
curriedAdd(2)

const compose = (...funcs) => {
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((acc, cur) => (...arg) => {
    return cur(acc(arg));
  });
};