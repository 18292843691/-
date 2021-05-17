# Question

## 其他

### 实现 ajax

```js
const fetch = (data) => {
  const xhr = new XMLHttpRequest();

  xhr.open("post", "https://localhost:9000/cors");

  xhr.onreadystatechange = (state) => {
    console.log('onreadystatechange', state);
  };

  xhr.

  xhr.onload = (state) => {
    console.log('onload', state)
  }

  xhr.send(data);
};
```

## Object.defineProperty 和 Proxy

- Proxy 更强大、可以监听到数组的变更、拦截 delete、defineProperty 等操作

### defineProperty

1. configurable

- enumerable
- value
- writable

2. get
3. set
4. get / set 会被继承

```js
const obj = { a: 1, b: 2 };

Object.defineProperty(obj, "a", {
  // enumerable: true, // 是否可以被 for in / Object.keys() 枚举
  // value: 3, // 值; 不可与 get / set 同时配置
  // writable: false, // 是否可写; 不可与 get / set 同时配置
  // configurable: false,  //  是否可以被删除
  set(value) {
    console.log("set", value);
  },
  get() {
    console.log("get");
    return this.value + "get";
  },
});
```

### Proxy

```js
const proxyObj = new Proxy(obj, {
  defineProperty(value) {
    console.log("defineProperty", value);
    return {};
  },
  deleteProperty() {
    console.log("delete");
  },
  apply(oTarget, that, args) {
    console.log("apply call bind");
  },
  construct(oTarget, args) {
    console.log("new construct");
    var obj = Object.create(base.prototype);
    this.apply(oTarget, obj, args);
    return obj;
  },
  get(oTarget, prop) {
    console.log("get", oTarget, prop);
    return prop in oTarget ? oTarget[prop] : 37;
  },
  set(oTarget, prop, value) {
    console.log("set", oTarget, prop, value);
    oTarget[prop] = value;
    return true;
  },
  ownKeys: function (oTarget, sKey) {
    console.log("ownKeys");
    return oTarget.keys();
  },
  enumerate: function (oTarget, sKey) {
    console.log("enumerate");
    return oTarget.keys();
  },
  has: function (oTarget, sKey) {
    console.log("has");
    return sKey in oTarget || oTarget.hasItem(sKey);
  },
  getOwnPropertyDescriptor() {
    console.log("getOwnPropertyDescriptor");
    return { getOwnPropertyDescriptor: "getOwnPropertyDescriptor" };
  },
  getPrototypeOf() {
    return { getPrototypeOf: "getPrototypeOf" };
  },
});
```

## http 和 https 的区别？ http 和 http2 呢？ http3 ？

## 跨域问题怎么解决？
1. jsonp => script => script 执行方法传入参数 => 全局定义方法，接受参数
2. cors
简单请求(get, post, get)： `ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');`
(1) 请求方法是以下三种方法之一：

HEAD
GET
POST
（2）HTTP的头信息不超出以下几种字段：

Accept
Accept-Language
Content-Language
Last-Event-ID
Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

非简单请求：
1. 预检请求和回应 
req: 
`Access-Control-Request-Method`
`Access-Control-Request-Headers`

res: 
`Access-Control-Allow-Methods`(必须)
`Access-Control-Allow-Headers`(预检请求如果有，则是必须)
`Access-Control-Allow-Credentials`(可选)
`Access-Control-Allow-Max-Age` (可选)

1. 如果设置请求头'Content-Type': 'application/x-www-form-urlencoded'，这种情况则为简单请求；
2. 如果设置请求头'Content-Type': 'application/json'，这种情况则为非简单请求

## Event Loop 是什么？

## cookie、session、localStorage、sessionStorage 有什么区别？如何计算 localStorage 已经存的大小

可以通过枚举+统计size的方式

## react

### React 怎么优化渲染

## Webpack

### Webpack 是什么？怎么优化？

## Node

## node cluster 如何开启多进程的，一个端口可以被多个进程监听吗？进程和线程间怎么通信？

2. 一个端口可以被多个进程监听吗？
理论上不可以、cluster 是通过底层复用了同一个 socket 连接实现的

3. 进程和线程间怎么通信？
信号量、socket、

# 算法
## 有序数组找到指定值 => 二分查找

## 实现 36 进制转换
```js
const from10ToAny = (num, dig = 36) => {
  return Number(num).toString(dig)
}

const from10ToAny = (num, dig = 36) => {
  const stack = []
  let current = num
  while(current >= 1) {
    stack.push(current % dig) // 取余
    current = Math.floor(current / dig)  // 值--
  }

  return stack.reverse().join('')
}
```
## 判断对称二叉树
```js
const isSymmetricByRecursion = (root) => {
  const isSampleChild = (leftNode, rightNode) => {
    if (!leftNode && !rightNode) return true;
    if (!leftNode || !rightNode) return false;
    if (
      leftNode.val === rightNode.val
    ) {
      return (
        isSampleChild(leftNode.left, rightNode.right) &&
        isSampleChild(leftNode.right, rightNode.left)
      );
    } else {
      return false;
    }
  };

  return isSampleChild(root, root);
};

const isSymmetric = (root) => {
  const bfs = (node) => {
    const stack = []
    const result = []
    stack.push(node)
    while(stack.length) {
      const cur = stack.shift()

      result.push(cur.val)

      cur.left && stack.push(cur.left)
      cur.right && stack.push(cur.right)
    }
    return result
  }

  console.log(bfs(root.left), bfs(root.right))

  return bfs(root.left).join('') === bfs(root.right).join('')
}
```
## 层次遍历

## 合并乱序区间

## 老师分饼干

## 正数数列 a，对其每个区间都可以计算一个 x 值， x 值定义如下，对于任意区间， x 等于区间内最小的数乘上区间内所有数的和；找到区间内 x 最大的区间

`[3, 1, 6, 4, 5, 2] 最大的区间为 6、4、5; X = 4 * (6+4+5)=60`
```js
const getMaxtRect2 = (nums) => {
  const result = [];
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const rect = nums.slice(left, right + 1);
    const min = Math.min.apply(Array, rect);
    const acc = rect.reduce((acc, cur) => acc + cur);

    result.push(min * acc);

    if (nums[left] > nums[right]) {
      right--;
    } else {
      left++;
    }
  }

  console.log("result", result);

  return Math.max.apply(Array, result);
};
```
## 割绳子
长度为n的绳子、怎么割能使乘最大
<!-- 3 => 3 -->
4 => 2 * 2
5 => 2 * 3
6 => 2 * 4
7 => 2 * 2 * 3
8 => 2 * 6 => 2 * 2 * 4
9 => 2 * 7 => 3 * 3 * 3
10 => 1 * 9 => 2 * 8 => 2 * 2 * 6 => 2 * 2 * 2 * 2 * 2

```js
const getMaxMutli = (n) => {
  if (n < 4) return n

  const dp = [1, 2, 3, 4]

  const result = []

  for(let i = 4; i < n; i++) {
    // for(let j = i; j < 0; j--) {
    //   // const max = n
    //   const value = 2 * n - i
    // }

    const value = dp[n - i] * dp[n - i - i]
  }
}
```
## 接雨水
<!-- [0,1,0,2,1,0,1,3,2,1,2,1] -->
```js
const getMaxRect = (nums = []) => {
  if (nums.length === 1) return nums[0]
  
  let max = -1

  let left = 0
  let right = nums.length - 1

  while(left < right) {
    if (nums[left] < nums[left - 1]) {
      left++
      break
    }

     if (nums[right] < nums[right + 1]) {
      right--
      break
    }
    const lVal = nums[left]
    const rVal = nums[right]
    const min = Math.min(lVal, rVal)
    const rect = min * (right - left)
    max = Math.max(rect, max)

    if (lVal > rVal) {
      right--
    } else {
      left++
    }
  }
}

```
