// // 1. require
// // console.log('main.js ', require('./a.js'));
// // console.log('main.js ', require('./b.js'));

// // setTimeout(() => {
// //   console.log('main.js ', require('./b.js'));
// //   console.log('main.js ', require('./a.js'));
// // }, 2000);


// // 2. 输出顺序
// // setTimeout(function() {
// //   console.log(1)
// // }, 0);
// // new Promise(function executor(resolve) {
// //   console.log(2);
// //   for( var i=0 ; i<10000 ; i++ ) {
// //     i == 9999 && resolve();
// //   }
// //   console.log(3);
// // }).then(function() {
// //   console.log(4);
// // });
// // console.log(5);


// // const doSomethingElse = (value) => {
// //   console.log('doSomethingElse', value)
// // }

// // const doSomething = () => Promise.resolve(10)

// // doSomething().then(function () {
// //   return console.log('else1')
// // }).then(doSomethingElse)

// // doSomething().then(function () {
// //   console.log('else2')
// // }).then(doSomethingElse)

// // doSomething().then(doSomethingElse()).then(doSomethingElse)

// // doSomething().then(doSomethingElse);

// setImmediate(() => {
//   //运行一些东西
//   console.log('setImmediate')
// })

// process.nextTick(() => {
//   console.log('next tickkkkkkkk')
// })

// // setTimeout(() => {
// //   console.log('setTimeout') 
// // });


// function test() { 
//   console.log('tick')
//   process.nextTick(() => test());
//   console.log('tick end')

//   setTimeout(() => {
//     console.log('settimeout')
//   }, 1000);
// }

// // function test() { 
// //   console.log('tick', 'setTimeout')
// //   setTimeout(() => test(), 1000);
// //   process.nextTick(() => {
// //     console.log('next tick2')
// //   })
// // }

// test()


// process.stdout.setEncoding('utf-8');

// const console2 = (any) => process.stdout.write(any)

// console2('123')


var a = {
  index: 1
};
// 然后
console.log( a ); // ??
// 再然后
a.index++;