const range = (length = 0) => {
  return Array.from(new Array(length), (item, index) => index);
};

console.log(range(10)); // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
