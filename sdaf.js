const fibArray = [];
const fibCalculate = (index) => {
  const fibArray = [];
  for (let i = 0; i <= index; i++) {
    i < 2 ? fibArray.push(i) : fibArray.push(fibArray[i - 1] + fibArray[i - 2]);
  }
  return fibArray[index];
};

console.log(fibCalculate(11));