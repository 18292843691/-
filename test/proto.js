function Person(name) {
  this.name = name
 }

const newFunc = (objectFunction, ...args) => {
  // console.log(objectFunction)
  // objectFunction = {
  //   prototype: {
  //     constructor: objectFunction,
  //     __proto__: {
  //       constructor: Object,
  //     }
  //   },
  //   __proto__: Function
  // }

  const object = Object.create(objectFunction.prototype)

  const result = objectFunction.apply(object, args)

  // console.log('result', result, object)
  return typeof result === 'object' ? result : object
}

const p = newFunc(Person, 'xinxin')

console.log('p', p, p.name)

const p2 = new Person('xinxin2')
console.log('p2', p2, p2.name)