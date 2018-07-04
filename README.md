## 背景

### 示例 1:

```javascript
```

**优化:**

```javascript
```

## Lodash 中的惰性求值

```javascript
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
```

### 问题：不想全量引入 Lodash

使用 `.chain` 方法后，接下来会调用 lodash 的原型方法（`map` `filter` 等），所以需要全量引入 Lodash

**`.mixin` 方法登场:**

## 简易实现

```javascript
const range = function*(from, to) {
  for (let i = from; i < to; i++) {
    console.log('[range]:', i);
    yield i;
  }
};

const map = function*(flow, transform) {
  for (const data of flow) {
    console.log('[map]:', data);
    yield transform(data);
  }
};

const filter = function*(flow, condition) {
  for (const data of flow) {
    console.log('[filter]:', data);
    if (condition(data)) {
      yield data;
    }
  }
};

const stop = function*(flow, condition) {
  for (const data of flow) {
    yield data;
    if (condition(data)) {
      break;
    }
  }
};

const take = function(flow, number) {
  let count = 0;
  const _filter = function(data) {
    count++;
    return count >= number;
  };
  return stop(flow, _filter);
};

class _Lazy {
  constructor() {
    this.iterator = null;
  }

  range(...args) {
    this.iterator = range(...args);
    return this;
  }

  map(...args) {
    this.iterator = map(this.iterator, ...args);
    return this;
  }

  filter(...args) {
    this.iterator = filter(this.iterator, ...args);
    return this;
  }

  take(...args) {
    this.iterator = take(this.iterator, ...args);
    return this;
  }

  [Symbol.iterator]() {
    return this.iterator;
  }
}

function lazy() {
  return new _Lazy();
}

const numbers = lazy()
  .range(0, 100)
  .map(n => n * 10)
  .filter(n => n % 3 === 0)
  .take(2);

for (let n of numbers) {
  console.log('number:', n, '\n');
}
```
