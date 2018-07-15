## 求值策略

> 在计算机科学中，求值策略(Evaluation strategy)是确定编程语言中表达式的求值的一组（通常确定性的）规则。重点典型的位于函数或算子上——求值策略定义何时和以何种次序求值给函数的实际参数，什么时候把它们代换入函数，和代换以何种形式发生。 -- [维基百科](https://en.wikipedia.org/wiki/Evaluation_strategy)

### 严格求值（Strict evaluation）

严格求值下，传给函数的实际参数总是在调用这个函数之前被求值。

> 多数现存编程语言对函数使用严格求值。

### 非严格求值 / 惰性求值（Non-strict evaluation）

非严格求值下，传给函数的实际参数并不会立即求值，是否需要求值依赖于这个实际参数在函数执行中有没有被使用。

## JS 中的惰性计算

### 缓存

> 注意：对 [纯函数](https://zh.wikipedia.org/wiki/%E7%BA%AF%E5%87%BD%E6%95%B0) 缓存才有意义

memoize.js

```javascript
const memoize = function(func) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }

  const cache = new Map();
  const memorized = function(...args) {
    const key = args.join(',') || 'default';

    if (!cache.has(key)) {
      cache.set(key, func.apply(this, args));
    }

    return cache.get(key);
  };

  memorized.isMemorized = true;

  return memorized;
};
```

示例 1：

```javascript
const func = function() {
  // some expensive operation
  console.log('func is executed!');
  return 'func';
};

const memorizedFunc = memoize(func);

console.log(memorizedFunc());
console.log(memorizedFunc());
console.log(memorizedFunc());

// console:

// func is executed!
// func
// func
// func
```

func 只会执行一次

示例 2（斐波那契函数）：

```javascript
let counter = 0;

let fib = function(n) {
  counter++;
  switch (n) {
    case 0:
      return 0;
    case 1:
      return 1;
    default:
      return fib(n - 1) + fib(n - 2);
  }
};

console.log('fib 20:', fib(20));
console.log('counter:', counter, '\n');

counter = 0; // 重置 counter
fib = memoize(fib); // 重写 fib

console.log('memorizedFib 20:', fib(20));
console.log('counter:', counter);

// console:

// fib 20: 6765
// counter: 21891

// memorizedFib 20: 6765
// counter: 21
```

斐波那契函数时间复杂度为 `O(n) = 2^n`，性能极差。

缓存后的 fib 函数只会执行 n 次（0 ~ n）函数体。

### 惰性数组

**问题：**

```javascript
// (1) 商品名转为大写
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
```

#### 解法 1（函数式迭代）

```javascript
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
    name: item.name.toUpperCase(),
    price: item.price
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
//   { name: 'SUNSTONE', price: 4 },
//   { name: 'SUGILITE', price: 7 },
//   { name: 'DIOPSIDE', price: 3 }
// ]
```

**图示：**

![normal](https://github.com/zh-rocco/lazy-evaluation/blob/master/demo/normal.gif?raw=true)

#### 解法 2（常规方式）

```javascript
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
    name: item.name.toUpperCase(),
    price: item.price
  };
};

const result = [];

for (let i = 0, len = gems.length; i < len; i++) {
  const item = gems[i];
  if (filter(item)) {
    result.push(transform(item));
  }
  if (result.length > 2) {
    break;
  }
}

console.log('filterCounter:', filterCounter);
console.log('transformCounter:', transformCounter);
console.log(result);

// console:

// filter is run.
// transform is run.
// filter is run.
// filter is run.
// filter is run.
// transform is run.
// filter is run.
// transform is run.
// filterCounter: 5
// transformCounter: 3
// [
//   { name: 'SUNSTONE', price: 4 },
//   { name: 'SUGILITE', price: 7 },
//   { name: 'DIOPSIDE', price: 3 }
// ]
```

**图示：**

![normal](https://github.com/zh-rocco/lazy-evaluation/blob/master/demo/lazy.gif?raw=true)

#### 解法 3（Lodash、Lazy.js）

```javascript
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
    name: item.name.toUpperCase(),
    price: item.price
  };
};

let result;

result = _
  .chain(gems)
  .filter(filter)
  .map(transform)
  .take(3)
  .value();

console.log('filterCounter:', filterCounter);
console.log('transformCounter:', transformCounter);
console.log(result);

// console:

// filter is run.
// transform is run.
// filter is run.
// filter is run.
// filter is run.
// transform is run.
// filter is run.
// transform is run.
// filterCounter: 5
// transformCounter: 3
// [
//   { name: 'SUNSTONE', price: 4 },
//   { name: 'SUGILITE', price: 7 },
//   { name: 'DIOPSIDE', price: 3 }
// ]
```

TODO: 实现一个简易的 Lazy.js

### 短路求值（Short-circuit evaluation）\*

> 《JavaScript 面向对象编程指南》2.3.4.3

```javascript
const func = function() {
  console.log('func is executed!');
  return 'some value form func.';
};

console.log('a1: start');
const a1 = true || func(); // func 未执行
console.log('a1: end\n');

console.log('a2: start');
const a2 = false || func(); // func 执行了
console.log('a2: end\n');

console.log('b1: start');
const b1 = true && func(); // func 执行了
console.log('b1: end\n');

console.log('b2: start');
const b2 = false && func(); // func 未执行
console.log('b2: end\n');

// console:

// a1: start
// a1: end

// a2: start
// func is executed!
// a2: end

// b1: start
// func is executed!
// b1: end

// b2: start
// b2: end
```

### ES6 中的默认参数 \*

> 参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。 -- [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/function)

```javascript
// 默认参数
// 参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。

let counter = 0;

const func = function() {
  console.log('func is executed!');
  counter++;
  return 10;
};

const a = function(val = func()) {
  console.log('before use "val"');
  console.log('val:', val);
};

console.log('第 1 次执行');
a();
console.log('counter:', counter);
console.log('第 1 次结束\n');

console.log('第 2 次执行');
a();
console.log('counter:', counter);
console.log('第 2 次结束\n');

console.log('第 3 次执行');
a(20);
console.log('counter:', counter);
console.log('第 3 次结束\n');

// console:

// 第 1 次执行
// func is executed!
// before use "val"
// val: 10
// counter: 1
// 第 1 次结束

// 第 2 次执行
// func is executed!
// before use "val"
// val: 10
// counter: 2
// 第 2 次结束

// 第 3 次执行
// before use "val"
// val: 20
// counter: 2
// 第 3 次结束
```

**从第 1 次调用 `a` 方法可以看出：**

- 默认参数 `func` 并不会在 `a` 方法定义时执行
- 默认参数 `func` 在 `a` 方法体执行前调用，而不是实际参数被使用时调用

**从第 1、2 次调用 `a` 方法可以看出（观察 counter 值）：**

- 每次 `a` 方法被调用时，默认参数 `func` 都会重新执行，即：每次都重新计算默认值表达式的值，属于 `Call By Name` 求值策略

**从第 2、3 次调用 `a` 方法可以看出（观察 counter 值）：**

- `a` 方法被传入参数后，默认参数 `func` 不会执行

### 延时加载 \*

> 《高性能 JavaScript》 第 8 章 - 避免重复工作

#### 初版

```javascript
const addHandler = function(target, eventType, handler) {
  document.body.addEventListener
    ? // DOM2 Events
      target.addEventListener(eventType, handler, false)
    : // IE
      target.addEventListener('on' + eventType, handler);
};

const removeHandler = function(target, eventType, handler) {
  document.body.removeEventListener
    ? // DOM2 Events
      target.removeEventListener(eventType, handler, false)
    : // IE
      target.detachEvent('on' + eventType, handler);
};
```

每次调用时都会判断事件类型，然后再执行 add / remove 事件方法

#### 优化版（条件预加载）

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

脚本加载时会进行条件检测，而不是加载后

#### 优化版（延时加载）

```javascript
function addHandler(target, eventType, handler) {
  if (target.addEventListener) {
    // DOM2 Events
    addHandler = function(target, eventType, handler) {
      target.addEventListener(eventType, handler, false);
    };
  } else {
    // IE
    addHandler = function(target, eventType, handler) {
      target.attachEvent('on' + eventType, handler);
    };
  }

  addHandler(target, eventType, handler);
}

function removeHandler(target, eventType, handler) {
  if (target.addEventListener) {
    // DOM2 Events
    removeHandler = function(target, eventType, handler) {
      target.removeEventListener(eventType, handler, false);
    };
  } else {
    // IE
    removeHandler = function(target, eventType, handler) {
      target.detachEvent('on' + eventType, handler);
    };
  }

  addHandler(target, eventType, handler);
}
```

调用延时加载函数时，第一次总会消耗较长的时间

## 参考

- [如何用 JavaScript 实现一个数组惰性求值库](https://zhuanlan.zhihu.com/p/26535479)
- [lazy.js 惰性求值实现分析](https://zhuanlan.zhihu.com/p/24138694)
- [How to Speed Up Lo-Dash ×100? Introducing Lazy Evaluation.](http://filimanjaro.com/blog/2014/introducing-lazy-evaluation/)
- [ECMAScript 6 入门](http://es6.ruanyifeng.com/)
- [Javascript 中的求值策略](https://zhuanlan.zhihu.com/p/33035557)
- [Lodash memoize](https://github.com/lodash/lodash/blob/master/memoize.js)

## 相关笔记：

- [JavaScript 中的参数传递策略](https://github.com/zh-rocco/fe-notes/issues/3)
- [快速求斐波那契算法](https://gist.github.com/zh-rocco/cacafafa9c20dc998500cceff7f558be)
