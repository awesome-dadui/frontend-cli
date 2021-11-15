const fs = require('fs');
const filename = `${__dirname}/data.txt`;

function compile (content) {
  fs.appendFile(filename, content, err => {
    if (err) {
      console.error(err)
      return
    }
    run()
  })
}

function run () {
  const content = fs.readFileSync(filename, 'utf-8');
  const arr = content.replace(/\s*/g, '').split('@');
  const result = sort(removeDuplicates(arr));
  console.log('--- 最新榜单 ---')
  result.forEach(item => {
    console.log(`${item.name}: ${item.time}`);
  })
}

// 计数
function removeDuplicates (arr = []) {
  let tempArr = [];
  for (let i = 0; i < arr.length; i++) {
    const index = tempArr.findIndex(k => k.name === arr[i])
    if (index > -1) {
      tempArr[index].time++;
    } else if (!!arr[i]) {
      tempArr.push({
        name: arr[i],
        time: 1
      });
    }
  }
  return tempArr;
}

// 排序
function sort (arr = []) {
  for (let i = 0; i < arr.length; i++) {
    let maxIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j].time > arr[maxIndex].time) {
        maxIndex = j;
      }
    }

    let temp = arr[i];
    arr[i] = arr[maxIndex];
    arr[maxIndex] = temp;
  }
  return arr;
}

module.exports = {
  compile
}