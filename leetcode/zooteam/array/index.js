const logger = (type, res) => {
  console.log(`[${type}]`, res);
};
// # 买卖股票的最佳时机 II
// [7,1,5,3,6,4]
// 贪心
const maxProfit = (arr) => {
  let max = 0;

  for (let i = 1; i <= arr.length; i++) {
    const cur = arr[i];
    if (cur > arr[i - 1]) {
      max = cur - arr[i - 1] + max;
    }
  }

  return max;
};

// [7,1,5,3,6,4]
const maxProfitByDp = (arr) => {
  const dp = [0];

  for (let i = 1; i < arr.length; i++) {
    dp[i] = Math.max(dp[i - 1], arr[i] - arr[i - 1] + dp[i - 1]);
  }

  return dp[arr.length - 1];
};

logger("maxProfit", maxProfitByDp([7, 1, 5, 3, 6, 4]));
logger("maxProfit", maxProfitByDp([7, 6, 5, 4, 3, 2]));
logger("maxProfit", maxProfitByDp([1, 2, 3, 4, 5, 6]));

logger("maxProfit", maxProfit([7, 1, 5, 3, 6, 4]));
logger("maxProfit", maxProfit([7, 6, 5, 4, 3, 2]));
logger("maxProfit", maxProfit([1, 2, 3, 4, 5, 6]));

// 移动零
// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
// 必须在原数组上操作，不能拷贝额外的数组。
// 尽量减少操作次数。
// [0,0,1,2,0,3,4] =>
// [1,2,3,4,0,0,0]
const moveZeroes = function (nums) {
  let l = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[l] = nums[i];
      l++;
    }
  }

  // 填充 l 之后的值为 0
  return nums.fill(0, l, nums.length);
};

const moveZeroes2 = function (nums) {
  let l = 0;

  // 将不为 0 的值以此换到左指针的位置上
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      const tmp = nums[l];
      nums[l] = nums[i];
      nums[i] = tmp;
      l++;
    }
  }

  return nums.fill(0, l, nums.length);
};

logger("maxProfit", moveZeroes([0, 0, 1, 2, 0, 3, 4]));
logger("maxProfit", moveZeroes2([0, 0, 1, 2, 0, 3, 4]));

// #只出现一次的数字
// [4,1,2,1,2]
const singleNumber = (nums) => {
  const res = nums.map((i) => {
    return nums.filter((num) => num === i);
  });

  return res.filter((i) => i.length === 1)[0];
};

const singleNumber2 = (nums) => {
  return nums.reduce((acc, cur) => {
    return acc ^ cur;
  });
};
// 1^1 => 0; 2^1^2 => 1; 3^3 = 0; 0 ^ x = x; x ^ x = 0
logger("singleNumber", singleNumber([4, 1, 2, 1, 2]));
logger("singleNumber2", singleNumber2([4, 1, 2, 1, 2]));

// 两数之和
const twoSum = (nums, target) => {
  const hashMap = new Map();

  let result = [];
  nums.forEach((i, idx) => {
    const delta = target - i;
    if (typeof hashMap.get(delta) !== "undefined") {
      result = [hashMap.get(delta), idx];
    } else {
      hashMap.set(i, idx);
    }
  });

  return result;
};
logger("twoSum", twoSum([2, 7, 11, 15], 9));

// # 从排序数组中删除重复项
// 不要使用额外的数组空间，你必须在原地修改输入数组并在使用 O(1) 额外空间的条件下完成。
const removeDuplicates = (nums) => {
  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];
    if (current === nums[i + 1]) {
      nums.splice(i, 1);
      i--;
    }
  }

  return nums;
};

// [0,0,1,1,1,2,2,3,4]
// [0,1,2,3,4,1,2,1,1], left = 5
const removeDuplicates2 = (nums) => {
  let left = 0;

  for (let i = 1; i < nums.length; i++) {
    const current = nums[i];
    if (current !== nums[left]) {
      nums[i] = nums[left];
      nums[left + 1] = current;
      left++;
    }
  }

  return nums.slice(0, left);
};

logger(
  "removeDuplicates",
  removeDuplicates([0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6])
);

logger(
  "removeDuplicates2",
  removeDuplicates2([0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6])
);

// 输入: [1,2,3]
// 输出: [1,2,4]
// 解释: 输入数组表示数字 123。
// #加一
const plusOne = function (digits) {
  return (BigInt(digits.join("")) + 1n).toString().split("");
};

const plusOne2 = function (digits) {
  let carry = 0;
  let num = 0;
  let dig = 0;

  for (let i = digits.length - 1; i >= 0; i--) {
    let last = i === digits.length - 1 ? digits[i] + 1 : digits[i] + carry;

    carry = last > 9 ? 1 : 0;
    if (last > 9) {
      last = last % 10;
    }

    num += dig ? last * Math.pow(10, dig) : last;
    dig++;
  }

  return String(num).split("");
};

logger("plusOne1", plusOne([1, 2, 9]));

logger("plusOne2", plusOne2([1, 2, 9]));

// 两个数组的交集
const intersect = (arr1, arr2) => {
  return arr1.filter((i) => arr2.includes(i));
};

logger("intersect", intersect([4, 9, 5], [4, 9, 8, 4]));

// # 一周中的第几天
// 给你一个日期，请你设计一个算法来判断它是对应一周中的哪一天。
const dayOfTheWeek = (day, month, year) => {
  const Month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const Week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // 1970年12月31日为星期四，即初始值为4
  let count = 4;
  // 算上此年前每年的日期，都先当365天算
  count += (year - 1970 - 1) * 365;

  for (let i = 1; i < month; i++) {
    count += Month[i - 1];
  }

  // 算上此月的日期
  count += day;

  // 加上今年之前的闰年天数
  for (let y = 1971; y <= year - 1; y++) {
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
      count++;
    }
  }
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    if (month > 2) {
      count++;
    }
  }
  return Week[count % 7];
};

const dayOfTheWeek2 = function (day, month, year) {
  const date = new Date(Date.parse(`${year}/${month}/${day}`));
  const Week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return Week[date.getDay()];
};

// 除本身之外的数组之积
const productExceptSelf = (nums) => {
  return nums.map((i, idx) => {
    return nums
      .filter((i, index) => index !== idx)
      .reduce((acc, cur, index) => {
        return acc * cur;
      });
  });
};

logger("productExceptSelf", productExceptSelf([1, 2, 3, 4]));

// # 存在重复元素
const containsDuplicate = (nums) => {
  const setMap = new Set();

  for (let i = 0; i < nums.length; i++) {
    if (setMap.has(nums[i])) {
      return false;
    } else {
      setMap.add(num[i]);
    }
  }
  return true
};


