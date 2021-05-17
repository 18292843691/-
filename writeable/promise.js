class xPromise {
  reason;
  value;
  status = "PENDING";

  constructor(executor) {
    // 一个 Promise 的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。
    this.status = "PENDING";
    this.reason; // 表示一个 promise 的拒绝原因。
    this.value;

    this.resolveCallBackHandlers = [];
    this.rejectCallBackHandlers = [];

    const resolve = (value) => {
      // console.log(
      //   this.id,
      //   "[called resolve]. current status is",
      //   this.status,
      //   value
      // );

      // 不能迁移至其他任何状态
      const self = this;
      if (self.status === "PENDING") {
        self.value = value;
        self.status = "FULFILLED";
        // console.log(this.id, "[called resolve] timeout. current value is", value);
  
        // 当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
        self.resolveCallBackHandlers.forEach((handle) => handle(self.value));
        self.resolveCallBackHandlers = [];
      }
    };

    const reject = (reason) => {
      // console.log(this.id, "[called reject]. current status is", this.status);
      const self = this;
      // 不能迁移至其他任何状态
      if (self.status !== "PENDING"){
        self.reason = reason;
        self.status = "REJECTED";
        // console.log(
        //   this.id,
        //   "[called reject] timeout. current reason is",
        //   reason,
        //   self.rejectCallBackHandlers
        // );
  
        // 当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调
        self.rejectCallBackHandlers.forEach((handle) => handle(self.reason));
        self.rejectCallBackHandlers = [];
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      // console.log('executor catch error')
      this.reject(error);
    }
  }

  resolve = (value) => {
    return new xPromise((res) => res(value));
  };

  reject = (reason) => {
    return new xPromise((_res, rej) => rej(reason));
  };

  // onFulfilled 和 onRejected 都是可选参数。
  then = (onfulfilled, onrejected) => {
    const onResolved =
      typeof onfulfilled === "function"
        ? onfulfilled
        : function (v) {
            return v;
          };
    const onRejected =
      typeof onrejected === "function"
        ? onrejected
        : function (r) {
            throw r;
          };
    const self = this;

    if (self.status === "FULFILLED") {
      return new xPromise(function (resolve, reject) {
        setTimeout(function () {
          try {
            var x = onResolved(self.value);
            resolve(x);
          } catch (e) {
            return reject(e);
          }
        });
      });
    }

    if (self.status === "REJECTED") {
      return new xPromise(function (resolve, reject) {
        setTimeout(function () {
          try {
            var x = onRejected(self.reason);
            resolve(x);
          } catch (e) {
            return reject(e);
          }
        });
      });
    }

    if (self.status === "PENDING") {
      return new xPromise(function (resolve, reject) {
        self.resolveCallBackHandlers.push((val) => {
          try {
            var x = onResolved(val);
            resolve(x);
          } catch (e) {
            return reject(e);
          }
        });
        self.rejectCallBackHandlers.push((val) => {
          try {
            var x = onRejected(val);
            resolve(x);
          } catch (e) {
            return reject(e);
          }
        });
      });
    }

    return new xPromise((res) => res(self.value));
  };

  catch = (func) => {
    return this.then(null, func);
  };

  finally = (func) => {
    return this.then(
      () => {
        setTimeout(() => {
          func();
        }, 0);
      },
      () => {
        setTimeout(() => {
          func();
        }, 0);
      }
    );
  };
}

const p = (value) => {
  return new xPromise((res, rej) => {
    if (value > 1) {
      setTimeout(() => {
        res(value);
      }, 1000);
    } else {
      rej("[REJECT]: value is too small");
    }
  });
};

console.log("1");

p(7)
  .then(
    (res) => {
      console.log("[Result 1. Then]. value is", res);
      return res + 1;
    },
    (err) => {
      console.log("[Result 1. Error]. value is", err);
      return 1;
    }
  )
  .then()
  .then((res) => {
    console.log("[Result 2. Then]. value is", res);
    return res + 1;
  })
  .then(
    (res) => {
      console.log("[Result 3. Then]. value is", res);
    },
    (err) => {
      console.log("[Result 3. Error]. value is", err);
    }
  )
  .catch((err) => {
    console.log("[Result Catch]: Err is", err);
  })
  .finally(() => {
    console.log("finally promise is success!");
  });

console.log("2");

const res = new xPromise().resolve(3);

res.then(() => {
  console.log('6');
});

console.log("3");

const rej = new xPromise().reject(4);
console.log("4");

console.log("5");

// Promise中的then第二个参数和catch有什么区别？
// 如果在then的第一个函数里抛出了异常，后面的catch能捕获到，而then的第二个函数捕获不到。
// catch只是一个语法糖而己 还是通过then 来处理的
