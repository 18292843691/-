const hours = [10, 5, 4, 2, 1, 1, 2, 9, 9, 9, 5, 6, 9, 1, 3, 2];
// 7

const hours5 = [6, 6, 9, 9, 6, 0, 6, 6, 9];

const hours2 = [9, 9, 6, 0, 6, 6, 9];

const hours3 = [9, 8, 8, 8, 8, 8];
// 6

const hours4 = [6, 9, 9];
// 3

const longestWPI = (hours) => {
  let preSum = new Array(hours.length + 1).fill(0);
  for (let i = 1; i <= hours.length; i++) {
    if (hours[i - 1] > 8) {
      preSum[i] = preSum[i - 1] + 1;
    } else {
      preSum[i] = preSum[i - 1] - 1;
    }
  }

  console.log(preSum)
  let max = 0;

  for (let i = 0; i < preSum.length - 1; i++) {
    for (let j = i + 1; j < preSum.length; j++) {
      if (preSum[j] - preSum[i] > 0) {
        // console.log('preSum', preSum[j], preSum[i], preSum[j] - preSum[i], j - i)
        console.log('map', max, j, i, j - i)
        max = Math.max(max, j - i);
      }
    }
  }
  console.log('max', max)
  return max
};

longestWPI(hours2);
