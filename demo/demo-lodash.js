const _ = require('lodash');

let map_count_1 = 0;
_.chain(_.range(50))
  .map(val => {
    map_count_1++;
    return val + 1;
  })
  .take(10)
  .value();

console.log('map_count_1:', map_count_1); // 10

let map_count_2 = 0;
let filter_count_2 = 0;
_.chain(_.range(200))
  .map(val => {
    map_count_2++;
    return val + 1;
  })
  .filter(val => {
    filter_count_2++;
    return val > 10;
  })
  .take(10)
  .value();

console.log('map_count_2:', map_count_2); // 20
console.log('filter_count_2:', filter_count_2); // 20
