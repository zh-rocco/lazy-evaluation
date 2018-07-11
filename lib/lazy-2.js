const _chain = function*(arr) {
  for (let i of arr) {
    // console.log('[range]:', i);
    yield i;
  }
};

const _map = function*(flow, transform) {
  for (const data of flow) {
    // console.log('[map]:', data);
    yield transform(data, this.__index__, this.__value__);
  }
};

const _filter = function*(flow, condition) {
  for (const data of flow) {
    // console.log('[filter]:', data);
    if (condition(data)) {
      yield data;
    }
    this.__index__++;
  }
};

const _stop = function*(flow, condition) {
  for (const data of flow) {
    yield data;
    if (condition(data)) {
      break;
    }
  }
};

const _take = function(flow, number) {
  let count = 0;
  const _filter = function(data) {
    count++;
    return count >= number;
  };
  return _stop(flow, _filter);
};

class Lazy {
  constructor(value) {
    this.__index__ = 0;
    this.__value__ = value;
    this.iterator = _chain(value);
  }

  [Symbol.iterator]() {
    return this.iterator;
  }

  static chain(value) {
    return new Lazy(value);
  }

  map(...args) {
    this.iterator = _map.call(this, this.iterator, ...args);
    return this;
  }

  filter(...args) {
    this.iterator = _filter.call(this, this.iterator, ...args);
    return this;
  }

  take(...args) {
    this.iterator = _take(this.iterator, ...args);
    return this;
  }

  value() {
    const result = [];

    for (let n of this) {
      // console.log('number:', n, '\n');
      result.push(n);
    }

    return result;
  }
}

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
const transform = (item, index, array) => {
  transformCounter++;
  console.log('transform is run.');
  console.log(item, index);
  return {
    name: item.name,
    price: `$${item.price.toFixed(2)}`
  };
};

const result = Lazy.chain(gems)
  .filter(filter)
  .map(transform)
  .take(3)
  .value();

console.log('filterCounter:', filterCounter);
console.log('transformCounter:', transformCounter);
console.log(result);
