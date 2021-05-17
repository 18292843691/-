
# 基础
## 引用传递
1. js 中什么类型是引用传递, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?
[https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language](https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language)

`对象是引用传递, 基础类型是值传递, 通过将基础类型包装 (boxing) 可以以引用的方式传递.`
`将参数的地址复制一份，按值传递地址，即引用复制（reference-copy）传递，对于变量的成员进行修改时，会直接影响原变量；而如果对传递过来的变量进行重新赋值，则不会影响原变量，并且此后再修改变量的成员，也不会影响原变量。`
- 简单类型（如数值、字符串）主要是2种参数传递方式，就是值传递和引用传递。（ 还有 pass by name、pass by value-copy 等其他方式
- 复杂类型，实际上有3种传递方式。
- - 将参数的值完全复制一份，按值传递
- - 将参数的地址复制一份，按值传递地址，即引用复制（reference-copy）传递
- - 对于参数的完全引用传递

## 内存
1. JavaScript 中不同类型以及不同环境下变量的内存都是何时释放?[GC 分代垃圾回收算法](./gc.md)
`引用类型是在没有引用之后, 通过 v8 的 GC 自动回收, 值类型如果是处于闭包的情况下, 要等闭包没有引用才会被 GC 回收, 非闭包的情况下等待 v8 的新生代 (new space) 切换的时候回收.`

# 模块
## 模块机制
1. 模块
- AMD AMD规范则是非同步加载模块，允许指定回调函数。
```javascript
// test.js
define(['package/lib',...], function(lib) {
    function foo () {
        lib.log('hello world');
    }

    return {
      foo: foo
    }
});

// main.js
require(['test'], function(test) {
  test.foo()
})
```
- CMD
CMD 是同步模块定义、是 SeaJS 在推广过程中对模块定义的规范化产出。和 AMD 的区别是前者是对于依赖的模块提前执行，而后者是延迟执行。 前者推崇依赖前置，而后者推崇依赖就近，即只在需要用到某个模块的时候再 require。
```javascript
//所有模块都通过define来定义
define(function(require, exports, module) {  
  // 通过require引入依赖
  var $ = require('jquery');
  var Spinning = require('./spinning');
  exports.doSomething = ...
  module.exports = ...
})
```
- CommonJS
`CommonJS的核心思想就是通过 require 方法来同步加载所要依赖的其他模块，然后通过 exports 或者 module.exports 来导出需要暴露的接口。`
```javascript
// test.js
exports.area = function(r) {
   return Math.PI * r * r;
}
exports.circleCumference= function(r) {
   return Math.PI * r * r;
}

// main.js
const {area, circleCumference} = require('test')
```
- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，
- 以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

1. module.exports属性
`module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量`
2. 加载规则
- /usr/local/lib/node/bar.js
- /home/user/projects/node_modules/bar.js
- /home/user/node_modules/bar.js
- /home/node_modules/bar.js
- /node_modules/bar.js
`这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。`

3. 模块的循环加载
`如果发生模块的循环加载，即A加载B，B又加载A，则B将加载A的不完整版本。`
4. require的内部处理流程
`require命令是CommonJS规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的module.require命令，而后者又调用Node的内部命令Module._load。`

```js
Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
};
```

- ES6
`在导入一个模块时，对于CommonJs来说是得到了一个导出值的拷贝；而在ES6Module中则是值的动态映射，并且这个映射是只读的。`


`CommonJs与ES6Module最本质的区别在于前者对模块依赖的解决是动态的，而后者是静态的。`

- 动态：模块依赖关系的建立是发生在代码运行阶段；
- 静态：模块依赖关系的建立是发生在代码编译阶段；

```js
import App from './App.vue'
export default {
   props: ['num']
}
```
CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由 于Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。

## 热更新
`在 Node.js 中做热更新代码, 牵扯到的知识点可能主要是 require 会有一个 cache, 有这个 cache 在, 即使你更新了 .js 文件, 在代码中再次 require 还是会拿到之前的编译好缓存在 v8 内存 (code space) 中的的旧代码. 但是如果只是单纯的清除掉 require 中的 cache, 再次 require 确实能拿到新的代码, 但是这时候很容易碰到各地维持旧的引用依旧跑的旧的代码的问题. 如果还要继续推行这种热更新代码的话, 可能要推翻当前的架构, 从头开始从新设计一下目前的框架.`

# 事件/异步

## Promise
1. Promise 中 .then 的第二参数与 .catch 有什么区别?
- 如果在 then 的第一个函数里抛出了异常，后面的 catch 能捕获到，而 then 的第二个函数捕获不到。
- then 的第二个参数和 catch 捕获错误信息的时候会就近原则，如果是p romise 内部报错，reject抛出错误后，then 的第二个参数和 catch 方法都存在的情况下，只有 then 第二个参数能捕获到，如果then的第二个参数不存在，则 catch 方法会捕获到。


## Event
- Eventemitter 的 emit 是同步还是异步?

The EventListener calls all listeners synchronously in the order in which they were registered. This is important to ensure the proper sequencing of events and to avoid race conditions or logic errors.

## 阻塞/异步
Q: 如何判断接口是否异步? 是否只要有回调函数就是异步?
  开放性问题, 每个写 node 的人都有一套自己的判断方式.
- 看文档
- console.log 打印看看
- 看是否有 IO 操作
- 单纯使用回调函数并不会异步, IO 操作才可能会异步, 除此之外还有使用 setTimeout 等方式实现异步.

# 进程
## Process 
熟悉与进程有关的基础命令, 如 top, ps, pstree 等命令.
1. process.nextTick
```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare（系统内部使用） 
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll 轮询      │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```
每个阶段都有一个 FIFO 队列来执行回调。
1. 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
2. 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
3. idle, prepare：仅系统内部使用。
4. 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
5. 检测：setImmediate() 回调函数在这里执行。
6. 关闭的回调函数：一些关闭的回调函数，如：socket.on('close', ...)。

process.nextTick 并不属于 Event loop 中的某一个阶段, 而是在 Event loop 的每一个阶段结束后, 直接执行 nextTickQueue 中插入的 "Tick", 并且直到整个 Queue 处理完. 所以面试时又有可以问的问题了, 递归调用 process.nextTick 会怎么样? (doge
```js
function test() { 
  process.nextTick(() => test());
}
// 死循环、会阻塞eventloop
```
这种情况与以下情况, 有什么区别? 为什么?
```js
function test() { 
  setTimeout(() => test(), 0);
}

// 不会阻塞 eventloop
```
## 标准流
1. console.log 是同步还是异步? 如何实现一个 console.log?
`process.stdout and process.stderr 与 Node.js 中其他 streams 在重要的方面有不同:

console.log() 和 console.error() 内部分别是由它们实现的。
写操作是否为同步，取决于连接的是什么流以及操作系统是 Windows 还是 POSIX :
文件：在 Windows 和 POSIX 上是同步的。
TTY（终端）：在 Windows 上是异步的，在 POSIX 上是同步的。
管道（和 socket）：在 Windows 上是同步的，在 POSIX 上是异步的。`

```js
this._stdout.write(util.format.apply(this, arguments) + '\n');
```

## Child Process
1. child_process.fork 与 POSIX 的 fork 有什么区别?
node.js 的 child_process.fork() 在 Unix 上的实现最终调用了 POSIX fork(2), 而 POSIX 的 fork 需要手动管理子进程的资源释放 (waitpid), child_process.fork 则不用关心这个问题, Node.js 会自动释放, 并且可以在 option 中选择父进程死后是否允许子进程存活.

## Cluster
cluster 是常见的 Node.js 利用多核的办法. 它是基于 child_process.fork() 实现的, 所以 cluster 产生的进程之间是通过 IPC 来通信的, 并且它也没有拷贝父进程的空间, 而是通过加入 cluster.isMaster 这个标识, 来区分父进程以及子进程, 达到类似 POSIX 的 fork 的效果

## 进程间通信
1. 在 IPC 通道建立之前, 父进程与子进程是怎么通信的? 如果没有通信, 那 IPC 是怎么建立的?
这个问题也挺简单, 只是个思路的问题. 在通过 child_process 建立子进程的时候, 是可以指定子进程的 env (环境变量) 的. 所以 Node.js 在启动子进程的时候, 主进程先建立 IPC 频道, 然后将 IPC 频道的 fd (文件描述符) 通过环境变量 (NODE_CHANNEL_FD) 的方式传递给子进程, 然后子进程通过 fd 连上 IPC 与父进程建立连接.
2. 什么情况下需要 IPC, 以及使用 IPC 处理过什么业务场景等.

3. 了解守护进程的实现的.

# IO

## Buffer

## TypedArray
## Stream
## pipe 
## File 
## 编码
1. UTF8, GBK, es6 中对编码的支持, 如何计算一个汉字的长度


# Network

## DNS
1. DNS 服务主要基于 UDP, DNS 模块中 .lookup 与 .resolve 的区别?
当你要解析一个域名的 ip 时, 通过 .lookup 查询直接调用 getaddrinfo 来拿取地址, 速度很快, 但是如果本地的 hosts 文件被修改了, .lookup 就会拿 hosts 文件中的地方, 而 .resolve 依旧是外部正常的地址.

由于 .lookup 是同步的, 所以如果由于什么不可控的原因导致 getaddrinfo 缓慢或者阻塞是会影响整个 Node 进程的
2. hosts 文件是什么? 什么叫 DNS 本地解析?
hosts 文件是个没有扩展名的系统文件, 其作用就是将网址域名与其对应的 IP 地址建立一个关联“数据库”, 当用户在浏览器中输入一个需要登录的网址时, 系统会首先自动从 hosts 文件中寻找对应的IP地址.

当我们访问一个域名时, 实际上需要的是访问对应的 IP 地址. 这时候, 获取 IP 地址的方式, 先是读取浏览器缓存, 如果未命中 => 接着读取本地 hosts 文件, 如果还是未命中 => 则向 DNS 服务器发送请求获取. 在向 DNS 服务器获取 IP 地址之前的行为, 叫做 DNS 本地解析.

## ZLIB
1. GZIP？
gzip的基础是DEFLATE，DEFLATE是LZ77与哈夫曼编码的一个组合体。
2. 哈夫曼编码？
霍夫曼编码是一种无前缀编码。解码时不会混淆。其主要应用在数据压缩，加密解密等场合。
## HTTP


# OS

# utils

# 正则

# 存储

1. 数据库范式
[数据库范式那些事](https://www.cnblogs.com/CareySon/archive/2010/02/16/1668803.html)
范式是为了消除重复数据减少冗余数据，从而让数据库内的数据更好的组织，让磁盘空间得到更有效利用的一种标准化标准，满足高等级的范式的先决条件是满足低等级范式。(比如满足2nf一定满足1nf)
- 第一范式(1NF)
如果一个关系模式R的所有属性都是不可分的基本数据项，则R∈1NF。`简单的说,第一范式就是每一个属性都不可再分。不符合第一范式则不能称为关系数据库`
- 第二范式(2NF)
若关系模式R∈1NF，并且每一个非主属性都完全函数依赖于R的码，则R∈2NF。`简单的说，是表中的属性必须完全依赖于全部主键，而不是部分主键.所以只有一个主键的表如果符合第一范式，那一定是第二范式。`
- 第三范式(3NF)
关系模式R<U，F> 中若不存在这样的码X、属性组Y及非主属性Z（Z  Y）, 使得X→Y，Y→Z，成立，则称R<U，F> ∈ 3N。
- BC范式(BCNF)
设关系模式R<U，F>∈1NF，如果对于R的每个函数依赖X→Y，若Y不属于X，则X必含有候选码，那么R∈BCNF。`简单的说，bc范式是在第三范式的基础上的一种特殊情况，既每个表中只有一个候选键（在一个数据库中每行的值都不相同，则可称为候选键）`
- 第四范式(4NF)

-----------

数据库范式进行分解的过程中不难看出，应用的范式登记越高，则表越多。表多会带来很多问题：

1 查询时要连接多个表，增加了查询的复杂度

2 查询时需要连接多个表，降低了数据库查询性能
-----------
1. 主键与唯一索引的区别?
- 主键ID，可以一列或多列，主键既是约束也是索引且是唯一索引，同时也用于对象缓存的键值。主键等于索引，索引不一定等于主键
- 一个表中可以有多个唯一性索引，但只能有一个主键
- 主键列不允许空值，而唯一性索引列允许空值
## 数据一致性
1. 什么情况下数据会出现脏数据? 如何避免?

# 安全
[实用性 WEB 开发人员安全须知](https://github.com/FallibleInc/security-guide-for-developers/blob/master/README-zh.md)
## Crypto
在客户端加密, 是增加传输的过程中被第三方嗅探到密码后破解的成本. 对于游戏, 在客户端加密是防止外挂/破解等. 在服务端加密 (如 md5) 是避免管理数据库的 DBA 或者攻击者攻击数据库之后直接拿到明文密码, 从而提高安全性.
## TLS/SSL
早期的网络传输协议由于只在大学内使用, 所以是默认互相信任的. 所以传统的网络通信可以说是没有考虑网络安全的. 早年的浏览器大厂网景公司为了应对这个情况设计了 SSL (Secure Socket Layer), SSL 的主要用途是:

认证用户和服务器, 确保数据发送到正确的客户机和服务器;
加密数据以防止数据中途被窃取;
维护数据的完整性, 确保数据在传输过程中不被改变.
存在三个特性:

机密性：SSL协议使用密钥加密通信数据
可靠性：服务器和客户都会被认证, 客户的认证是可选的
完整性：SSL协议会对传送的数据进行完整性检查

## HTTPS
公钥基础设施 (Public Key Infrastructure, PKI) 是一种遵循标准的, 利用公钥加密技术为电子商务的开展提供一套安全基础平台的技术和规范. 其基础建置包含认证中心 (Certification Authority, CA) 、注册中心 (Register Authority, RA) 、目录服务 (Directory Service, DS) 服务器.
由 RA 统筹、审核用户的证书申请, 将证书申请送至 CA 处理后发出证书, 并将证书公告至 DS 中. 在使用证书的过程中, 除了对证书的信任关系与证书本身的正确性做检查外, 并透过产生和发布证书废止列表 (Certificate Revocation List, CRL) 对证书的状态做确认检查, 了解证书是否因某种原因而遭废弃. 证书就像是个人的身分证, 其内容包括证书序号、用户名称、公开金钥 (Public Key) 、证书有效期限等.
## XSS
跨站脚本 (Cross-Site Scripting, XSS) 是一种代码注入方式, 为了与 CSS 区分所以被称作 XSS.
## CSP 策略

## CSRF
跨站请求伪造 (Cross-Site Request Forgery, CSRF, https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet) 是一种伪造跨站请求的攻击方式. 例如利用你在 A 站 (攻击目标) 的 cookie / 权限等, 在 B 站 (恶意/钓鱼网站) 拼装 A 站的请求.
- A 站 (预防站) 检查 http 请求的 header 确认其 origin
- - Origin Header
- - Referer Header
- 检查 CSRF token
- - 简单来说, 对需要预防的请求, 通过特别的算法生成 token 存在 session 中, 然后将 token 隐藏在正确的界面表单中, 正式请求时带上该 token 在服务端验证, 避免跨站请求.

## 中间人攻击
 如 wifi => HTTPS
## SQL/NoSQL 注入
