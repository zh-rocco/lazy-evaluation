const _ = require('lodash/wrapperLodash');
const mixin = require('lodash/mixin');
const range = require('lodash/range');
const chain = require('lodash/chain');
const map = require('lodash/map');
const filter = require('lodash/filter');
const take = require('lodash/take');
const value = require('lodash/value');

mixin(_, { range, chain, map, filter, take, value });

let map_count = 0;
let filter_count = 0;
const result = _
  .chain(_.range(50))
  .map(val => {
    map_count++;
    return val + 1;
  })
  .filter(val => {
    filter_count++;
    return val > 10;
  })
  .take(10)
  .value();

console.log(result);
console.log('map_count:', map_count); // 20
console.log('filter_count:', filter_count); // 20
