// 需求
// (1) price 转换为两位小数, 价格前面添加货币单位 $
// (2) 取出三个价格低于 10 的商品

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
let transformCounter = 0;

const filter = item => {
  filterCounter++;
  console.log('filter is run.');
  return item.price < 10;
};
const transform = item => {
  transformCounter++;
  console.log('transform is run.');
  return {
    name: item.name,
    price: `$${item.price.toFixed(2)}`
  };
};

const result = gems
  .filter(filter)
  .map(transform)
  .slice(0, 3);

console.log('filterCounter:', filterCounter);
console.log('transformCounter:', transformCounter);
console.log(result);

// console:

// filter is run.
// filter is run.
// filter is run.
// filter is run.
// filter is run.
// filter is run.
// filter is run.
// filter is run.
// transform is run.
// transform is run.
// transform is run.
// transform is run.
// filterCounter: 8
// transformCounter: 4
// [
//   { name: 'Sunstone', price: '$4.00' },
//   { name: 'Sugilite', price: '$7.00' },
//   { name: 'Diopside', price: '$3.00' }
// ]
