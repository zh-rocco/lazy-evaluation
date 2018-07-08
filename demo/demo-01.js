const range = require('../lib/range');

const arr = range(50);

let map_count = 0;
let filter_count = 0;

const result = arr
  .map(val => {
    map_count++;
    return val + 1;
  })
  .filter(val => {
    filter_count++;
    return val > 40;
  });

console.log('result:', result);
console.log('map_count:', map_count);
console.log('filter_count:', filter_count);
