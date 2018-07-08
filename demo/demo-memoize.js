const memoize = require('../lib/memoize');

const func = function() {
  // console.log(this.name);
  console.log('func is executed!');
  return 'func';
};

const func2 = function() {
  console.log('func2 is executed!');
  return 'func2';
};

const memorizedFunc = memoize(func);
const memorizedFunc2 = memoize(func2);

console.log(memorizedFunc());
console.log(memorizedFunc());
console.log(memorizedFunc2());

// const a = {
//   name: 'memorizedFunc',
//   memorizedFunc: memoize(memorizedFunc)
// };

// console.log(a.memorizedFunc());
