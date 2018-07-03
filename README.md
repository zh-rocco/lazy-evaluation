## 背景

### 示例 1:

```javascript
const someValue = expensiveFunction()
... // 一系列其他操作
console.log(someValue) // 使用 console.log 模拟 someValue 使用
```

`expensiveFunction` 首先执行, 很久后才使用它的返回值.

**优化:**

```javascript
console.log(expensiveFunction());
```

### 示例 2:

```javascript
const addHandler = document.body.addEventListener
  ? function(target, eventType, handler) {
      // DOM2 Events
      target.addEventListener(eventType, handler, false);
    }
  : function(target, eventType, handler) {
      // IE
      target.attachEvent('on' + eventType, handler);
    };

const removeHandler = document.body.removeEventListener
  ? function(target, eventType, handler) {
      // DOM2 Events
      target.removeEventListener(eventType, handler, false);
    }
  : function(target, eventType, handler) {
      // IE
      target.detachEvent('on' + eventType, handler);
    };
```

脚本加载时会进行条件检测, 而不是加载后.

**优化:**

```javascript
function addHandler(target, eventType, handler) {
  if (target.addEventListener) {
    // DOM2 Events
    addHandler = function(target, eventType, handler) {
      target.addEventListener(eventType, handler, false);
    } else {
        // IE
    addHandler = function(target, eventType, handler) {
      target.attachEvent('on' + eventType, handler);
    }
    }
  }
}

function removeHandler(target, eventType, handler) {
  if (target.addEventListener) {
    // DOM2 Events
    removeHandler = function(target, eventType, handler) {
      target.removeEventListener(eventType, handler, false);
    } else {
        // IE
    removeHandler = function(target, eventType, handler) {
      target.detachEvent('on' + eventType, handler);
    }
    }
  }
}
```

### 示例 3:

## 惰性计算 DEMO

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
