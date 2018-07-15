const memoize = require('../lib/memoize');

const func = function() {
  // some expensive operation
  console.log('func is executed!');
  return 'func';
};

const memorizedFunc = memoize(func);

console.log(memorizedFunc());
console.log(memorizedFunc());
console.log(memorizedFunc());

// console:

// func is executed!
// func
// func
// func
