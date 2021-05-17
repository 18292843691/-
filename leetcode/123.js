// [3, 3, 5, 0, 0, 3, 1, 4]

const arr = [3, 3, 5, 0, 0, 3, 1, 4]
const arr2 = [3,3,5,0,0,3,1,4]

// 只能买卖一次
const compute = (list) => {
  let buy = {
    idx: 0,
    value: 0,
  }
  let sell = {
    idx: 0,
    value: 0,
  }

  const record = []
  const recordMap = new Map()
  // const sellMap = new Map()

  let maxDur = 0

  for (let i = 0; i < list.length; i++) {
    for(let j = i + 1; j < list.length; j++) {
      if (list[j] - list[i] >= maxDur) {
        maxDur = list[j] - list[i]
        buy = {
          idx: i,
          value: list[i],
        }
        sell = {
          idx: j,
          value: list[j],
        }
      }
      // 收益为正数
      if (list[j] - list[i] > 0) {
        const dur = list[j] - list[i]
        const origin = recordMap.get(dur)
        // const originSell = recordMap.get(j)
        recordMap.set(dur, {
          i, j, dur: Math.max(dur, origin?.dur || 0)
        })

        // sellMap.set(j, {
        //   i,j,dur: Math.max(dur, originSell?.dur || 0)
        // })
        record.push({
          i,
          j,
          dur: dur
        })
      }
    }
  }

  record.forEach((i) => {
    
  })

  console.log(buy, sell)

  console.log('\n record=========', record, recordMap)
  return sell.value - buy.value
}

// 可买卖俩次
const compute2 = (list) => {

}

// const result = compute(arr)
const result2 = compute(arr2)

// console.log('result=', result)
console.log('result=', result2)
