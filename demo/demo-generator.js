const test = function*() {
  for (let i = 1; i <= 5; i++) {
    yield i;
  }
};

for (let i of test()) {
  console.log(i);
}

// console:

// 1
// 2
// 3
// 4
// 5
