// 需求
// (1) price 转换为两位小数, 价格前面添加货币单位 $
// (2) 取出两个价格高于 10 的商品

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

let counter = 0;

const filter = item => {
  return item.price > 10;
};
const transform = item => {
  return {
    name: item.name,
    price: `$${item.price.toFixed(2)}`
  };
};

const result = [];

for (let i = 0, len = gems.length; i < len; i++) {
  counter++;
  const item = gems[i];
  if (filter(item)) {
    result.push(transform(item));
  }
  if (result.length > 1) {
    break;
  }
}

console.log('counter:', counter);
console.log(result);

// console:

// counter: 3
// [
//   { name: 'Amethyst', price: '$15.00' },
//   { name: 'Prehnite', price: '$20.00' }
// ]
