// 需求
// (1) price 转换为两位小数, 价格前面添加货币单位 $
// (2) 取出两个价格高于 10 的商品

const _ = require('lodash');

const gems = [
  { name: 'Sunstone', price: 4 },
  { name: 'Amethyst', price: 15 },
  { name: 'Prehnite', price: 20 },
  { name: 'Sugilite', price: 7 },
  { name: 'Diopside', price: 3 },
  { name: 'Feldspar', price: 13 },
  { name: 'Dioptase', price: 2 },
  { name: 'Sapphire', price: 20 }
];

let filterCounter = 0;
let mapCounter = 0;

const filter = item => {
  filterCounter++;
  return item.price > 10;
};
const transform = item => {
  mapCounter++;
  return {
    name: item.name,
    price: `$${item.price.toFixed(2)}`
  };
};

const result = _
  .chain(gems)
  .filter(filter)
  .map(transform)
  .take(2)
  .value();

console.log('filterCounter:', filterCounter);
console.log('mapCounter:', mapCounter);
console.log(result);

// console:

// filterCounter: 3
// mapCounter: 2
// [
//   { name: 'Amethyst', price: '$15.00' },
//   { name: 'Prehnite', price: '$20.00' }
// ]
