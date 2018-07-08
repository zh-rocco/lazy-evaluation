const memoize = function(func) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }

  const cache = new Map();
  const memorized = function(...args) {
    const key = typeof args[0] === undefined ? func : args[0];

    if (!cache.has(key)) {
      cache.set(key, func.apply(this, args));
    }

    return cache.get(key);
  };

  memorized.isMemorized = true;

  return memorized;
};

module.exports = memoize;
