// auto run gen
const getData = (value) => {
  return Promise.resolve(value)
}

function *genFunc() {
  const data1 = yield getData('1.data')
  // console.log('data1', data1)
  const data2 = yield getData('1.data')
  // console.log('data2', data2)

  return {
    data1,
    data2
  }
}

const run = (gen) => {
  const next = (ret) => {
    if (ret.done) return Promise.resolve(ret.value)
    const res = gen.next(ret.value)
    return next(res)
  }
  const ret = gen.next()
  return next(ret)
}

const g = genFunc()
const result = run(g)
// console.log('result', result)


// isType
const isType = (type) => {
  return (target) => {
    return Object.prototype.toString.call(target) === `[object ${type}]`
  }
}
const isString = isType('String')
isString('123')
isString({})

// instanceof
const xInstanceOf = (obj, target) => {
  let result = false
  while(obj.__proto__) {
    if(obj.__proto__ === target.prototype) {
      result = true
    }
    obj = obj.__proto__
  }
  return result
}

var simpleStr = "This is a simple string";
var myString  = new String();
var newStr    = new String("String created with constructor");
var myDate    = new Date();
var myObj     = {};
var myNonObj  = Object.create(null);

function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

// simpleStr instanceof String; // 返回 false, 非对象实例，因此返回 false
// myString  instanceof String; // 返回 true
// newStr    instanceof String; // 返回 true
// myString  instanceof Object; // 返回 true

// myObj instanceof Object;    // 返回 true, 尽管原型没有定义
// ({})  instanceof Object;    // 返回 true, 同上
// myNonObj instanceof Object; // 返回 false, 一种创建非 Object 实例的对象的方法

// myString instanceof Date; //返回 false

// myDate instanceof Date;     // 返回 true
// myDate instanceof Object;   // 返回 true
// myDate instanceof String;   // 返回 false

// console.log('false', xInstanceOf(simpleStr, String))
// console.log('true', xInstanceOf(myObj, Object))

// console.log('false', xInstanceOf(myNonObj, Object)) //false

// console.log('true', xInstanceOf(myDate, Date))
// console.log('true', xInstanceOf(myDate, Object))
// console.log('false', xInstanceOf(myDate, String)) //false

// console.log('true', xInstanceOf(auto, Car))
// console.log('true', xInstanceOf(auto, Object))

// new 
const xNew = (target, ...args) => {
  const obj = Object.create(target.prototype)

  const result = target.apply(obj, args)
  return typeof result === 'object' ? result : obj
}

function a(a, b) {
  this.a = a
  this.b = b
}

const b = new a('1', '2')
console.log(b)

const c = xNew(a, '1', '2')
console.log('c', c)


Function.prototype.applyFn = function(that, args) {
  if (!args) {
    args = []
  }

  if (!that) {
    that = window
  }

  const targetObject = new Object(that)

  const symbolKey = Symbol('apply')

  targetObject[symbolKey] = this

  const result = targetObject[symbolKey](...args)

  delete targetObject[symbolKey]

  return result
}

Function.prototype.callFn = function(that, ...args) {
  if (!args) {
    args = []
  }

  if (!that) {
    that = window
  }

  const targetObject = new Object(that)

  const symbolKey = Symbol('call')

  targetObject[symbolKey] = this

  const result = targetObject[symbolKey](...args)

  delete targetObject[symbolKey]

  return result
}

Function.prototype.bindFn = function(context) {
  const that = this
  const initArgs = Array.from(arguments).slice(1)

  const F = new Function()
  F.prototype = this.prototype

  function binder() {
    const lastArgs = initArgs.concat(Array.from(arguments))

    return that.apply(this instanceof F ? this : context, lastArgs)
  }

  binder.prototype = new F()

  return binder
}

function bindFunc(name) {
  this.name = name
}

const obj = {
  name: 'obj',
}

const a = bindFunc.bind(obj, 'hello a')

const newA = new a('new a')

const b = bindFunc.bindFn(obj, 'hello b')

const newB = new a('new b')
