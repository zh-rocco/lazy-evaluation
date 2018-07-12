const _chain = function*(arr) {
  for (let i of arr) {
    // console.log('[range]:', i);
    yield i;
    this.__index__++;
  }
};

const _filter = function*(flow, condition) {
  for (const data of flow) {
    // console.log('[filter]:', data);
    if (condition(data)) {
      yield data;
    }
  }
};

const _map = function*(flow, transform) {
  for (const data of flow) {
    // console.log('[map]:', data);
    yield transform(data, this.__index__, this.__value__);
  }
};

const _stop = function*(flow, condition) {
  for (const data of flow) {
    yield data;
    if (condition()) {
      break;
    }
  }
};

const _take = function(flow, num) {
  let _count = 0;
  const _filter = function() {
    _count++;
    return _count >= num;
  };
  return _stop(flow, _filter);
};

class Lazy {
  constructor(value) {
    this.__index__ = 0;
    this.__value__ = value;
    this.__iterator__ = _chain.call(this, value);
  }

  [Symbol.iterator]() {
    return this.__iterator__;
  }

  static chain(value) {
    return new Lazy(value);
  }

  map(callback) {
    this.__iterator__ = _map.call(this, this.__iterator__, callback);
    return this;
  }

  filter(callback) {
    this.__iterator__ = _filter.call(this, this.__iterator__, callback);
    return this;
  }

  take(num) {
    this.__iterator__ = _take.call(this, this.__iterator__, num);
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
  // console.log(item, index);
  return {
    name: item.name,
    price: `$${item.price.toFixed(2)}`
  };
};

// const result = Lazy.chain(gems)
//   .filter(filter)
//   .map(transform)
//   .take(3)
//   .value();

const a = Lazy.chain(gems);
const b = a.filter(filter);
const c = b.map(transform);
const d = c.take(3);
const result = d.value();

console.log('filterCounter:', filterCounter);
console.log('transformCounter:', transformCounter);
console.log(result);
