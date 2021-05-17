const child = {
  val: 2,
  left: null,
  right: null,
};

const tree = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: null,
  },
  right: {
    val: 2,
    left: null,
    right: null,
  },
};

const isSymmetricByRecursion = (root) => {
  const isSampleChild = (leftNode, rightNode) => {
    if (!leftNode && !rightNode) return true;
    if (!leftNode || !rightNode) return false;
    if (leftNode.val === rightNode.val) {
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
    const stack = [];
    const result = [];
    stack.push(node);
    while (stack.length) {
      const cur = stack.shift();

      result.push(cur.val);

      cur.left && stack.push(cur.left);
      cur.right && stack.push(cur.right);
    }
    return result;
  };

  console.log(bfs(root.left), bfs(root.right));

  return bfs(root.left).join("") === bfs(root.right).join("");
};

console.log("call");
console.log("isSymmetric", isSymmetric(tree));
console.log("call end");

const getMaxRect = (nums = []) => {
  if (nums.length === 1) return nums[0];

  let max = -1;

  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    if (nums[left] < nums[left - 1]) {
      left++;
      continue;
    }

    if (nums[right] < nums[right + 1]) {
      right--;
      continue;
    }
    const lVal = nums[left];
    const rVal = nums[right];
    const min = Math.min(lVal, rVal);
    const rect = min * (right - left);
    console.log(left, right, lVal, rVal, min, right - left, rect);
    max = Math.max(rect, max);

    if (lVal > rVal) {
      right--;
    } else {
      left++;
    }
  }
  return max;
};

// console.log('getMaxRect()', getMaxRect([4,8,0,3,2,6]))
const getMaxtRect = (nums) => {
  const result = [];
  // 区间从 1 => nums.length
  for (let i = 1; i < nums.length; i++) {
    // 每个区间最大的数
    for (let j = 0; j < nums.length; j++) {
      const rect = nums.slice(j, j + i);
      const min = Math.min.apply(Array, rect);
      const acc = rect.reduce((acc, cur) => acc + cur);
      const value = acc * min;

      result.push(value);
    }
  }
  return Math.max.apply(Array, result);
};

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

console.log("getMaxtRect", getMaxtRect2([6, 2, 1]));
console.log("getMaxtRect", getMaxtRect2([3, 1, 6, 4, 5, 2]));

const getMaxMutli = (n) => {
  if (n < 2) return n;
  const result = [];
  const dp = [1, 1, 2];

  for (let i = 3; i < n + 1; i++) {
    for (let j = 2; j < i; j++) {
      const cur = j * (n - i);
      const last = j * dp[i - j];

      console.log(i, j, cur, last);
      result.push(Math.max(cur, last));
    }
  }

  console.log(dp);
  return result;
};

console.log("getMaxMutli", getMaxMutli(4));

// [1, 2, -2, 1 , 4, -1]
const gexMaxLenCount = (nums) => {
  let max = nums[0];
  const result = [nums[0]]
  const dp = [nums[0]];
  
  for (let i = 1; i < nums.length; i++) {
    const element = nums[i];
    console.log(dp[i-1], element)
    dp[i] = Math.max(dp[i - 1], max + element);
    max += element
    result.push(max)
  }

  console.log(dp, result, max)
  return dp[nums.length - 1];
};

console.log("gexMaxLenCount", gexMaxLenCount([1, 2, -2, 1, 4, -1]));
