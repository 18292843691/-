// 翻转整数

const reserve = (s) => {
  if (typeof s !== "number") {
    throw new Error("not number");
  }

  let curry = "";
  if (s < 0) {
    curry = "-";
  }

  if (s > Math.pow(2, 31) || s < -Math.pow(2, 31)) {
    return 0;
  }

  const str = Math.abs(s).toString().split("").reverse().join("");

  return curry + str;
};

console.log('reserve', reserve(-123));

// # 有效的字母异位词
// 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。
const isAnagram = (str1, str2) => {
  return str1.split("").sort().join() === str2.split("").sort().join();
};

console.log('isAnagram', isAnagram("anagram", "nagaram"));

// #字符串转换整数
const atoi = (str) => {
  const result = str.trim().match(/^(-|\+)?\d+/g);
  console.log(result);
  return result
    ? Math.max(
        Math.min(Number(result[0]), Math.pow(2, 31) - 1),
        -Math.pow(2, 31)
      )
    : 0;

  // const news = str.trim();
  // if (parseInt(news)) {
  //   return Math.max(Math.min(parseInt(news), Math.pow(2,31)-1), -Math.pow(2,31))
  // } else {
  //   return 0;
  // }
};

// console.log(atoi("123"));
// console.log(atoi("-123"));
console.log('atoi', atoi("-123asd"));

// # 报数
const countAndSay = function (n) {
  const dp = ["0", "1"];

  for (let i = 2; i <= n; i++) {
    console.log(
      dp[i - 1],
      dp[i - 1].replace(/(\d)\1*/g, (item) => `${item.length}${item[0]}`)
    );
    dp[i] = dp[i - 1].replace(/(\d)\1*/g, (item) => `${item.length}${item[0]}`);
  }
  console.log(dp);
  return dp[n];
};

const countAndSay2 = function (n) {
  let result = "1"; // 第一个数为'1'
  for (let i = 1; i < n; i++) {
    // 同方法一
    result = result.replace(/(\d)\1*/g, (item) => `${item.length}${item[0]}`);
  }
  return result;
};

// # 反转字符串
const reverseString = function (s) {
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    const tmp = s[l];
    s[l] = s[r];
    s[r] = tmp;
    l++;
    r--;
  }
  return s;
};

reverseString(["a", "b", "c", "d"]);

// 字符串中的第一个唯一字符
const firstUniqChar = (s) => {
  const hashMap = new Map();

  s.split("").forEach((i, idx) => {
    const cnt = hashMap.get(i) || 0;
    hashMap.set(i, cnt + 1);
  });

  console.log(hashMap);

  let result = [];
  s.split("").forEach((i, idx) => {
    if (hashMap.get(i) === 1) {
      result.push(idx);
    }
  });

  return result[0] || -1;
};

// # 验证回文串
const isPalindrome = (s) => {
  const str = String(s)
    .trim()
    .toLowerCase()
    .replace(/[^A-Za-z0-9]/g, "");

  const newStr = str.split("").reverse().join("");
  // console.log(str, newStr);
  return newStr === str;
};

console.log('isPalindrome', isPalindrome('sbcdedcbs'))

// # 实现strStr()
const strStr = (str, s) => {
  if (s.length === 0) return 0;
  if (s.length > str.length) return -1;
  if (s.length === str.length && s === str) return 0;

  const step = s.length;
  for (let i = 0; i < str.length; i += 1) {
    if (str.slice(i, i + step) === s) {
      return i;
    }
  }

  return -1;
};

console.log('strStr', strStr('asd', 'sd'))

// # 最长公共前缀
const longestCommonPrefix = (strs) => {
  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    const str = strs[i];
    for (j = 0; j <= str.length; j++) {
      const pre = prefix.slice(0, j);
      const cur = str.slice(0, j);
      // console.log("match", pre, cur, pre === cur, j);
      // console.log("prefix", prefix, str);

      if (prefix[j] !== str[j]) {
        prefix = str.slice(0, j);
        // console.log("not match", prefix, pre);
        break;
      } else {
        continue;
      }
    }
  }

  return prefix;
};

const longestCommonPrefix2 = (strs) => {
  if (!strs.length) return "";
  if (strs.length === 1) return strs[0];
  let prefix = strs[0];

  let flag = true;

  let index = 1;

  while (flag && index < strs.length) {
    const str = strs[index];
    if (str[0] !== prefix[0]) {
      flag = false;
      prefix = "";
    }
    for (let j = 0; j < str.length; j++) {
      if (str[j] !== prefix[j]) {
        prefix = str.slice(0, j);
        break;
      }
    }

    index++;
  }

  return prefix;
};

console.log('longestCommonPrefix 1', longestCommonPrefix(['flower', 'flow', 'flight']))
console.log('longestCommonPrefix 2', longestCommonPrefix2(['flower', 'flow', 'flight']))

// #最长回文子串 todo
const longestPalindrome = (s) => {
  let l = 0;
  let r = s.length - 1;

  let max = -1;
  let result = [];

  // while (l < r) {
  //   const str = s.slice(l, r);
  //   if (isPalindrome(str)) {
  //     max = Math.max(str.length, max);
  //     result.push(str);
  //   }
  //   r--;
  // }

  // O(n^2)

  return max;
};
