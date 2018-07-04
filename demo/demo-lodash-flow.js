const range = require('lodash/fp/range');
const flow = require('lodash/fp/flow');
const map = require('lodash/fp/map');
const filter = require('lodash/fp/filter');
const take = require('lodash/fp/take');
const value = require('lodash/fp/value');

let map_count = 0;
let filter_count = 0;

const result = flow(
  map(val => {
    map_count++;
    return val + 1;
  }),
  filter(val => {
    filter_count++;
    return val > 10;
  })
)(range(200));

console.log(result);
console.log('map_count:', map_count);
console.log('filter_count:', filter_count);
