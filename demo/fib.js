const memoize = fn => {
  let cache = new Map();
  return _ => {
    if (!cache.has(_)) {
      cache.set(_, fn(_));
    }
    return cache.get(_);
  };
};

let count = 0;

const fib = n => {
  count++;
  switch (n) {
    case 0:
      return 0;
    case 1:
      return 1;
    default:
      return fib(n - 1) + fib(n - 2);
  }
};

const memoizeFib = memoize(fib);

// const f10 = fib(10);
const f10 = memoizeFib(3);
console.log(f10, count);
