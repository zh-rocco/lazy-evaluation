// [Lazy Evaluation in Javascript]: https://hackernoon.com/lazy-evaluation-in-javascript-84f7072631b7

// call-by-name or call-by-need strategies

// Call by need is a memoized version of call by name.

// In short, memoization is an optimization technique to store pre-computed results (cache), to avoid recomputation for the same inputs.

class Stream {
  constructor(value) {
    this.value = value;

    Object.defineProperty(this, 'next', {
      get() {
        return new Stream(value + 1);
      }
    });
  }

  static chain(value) {}

  filter(callback) {}

  map(callback) {}

  take(n) {}

  value() {}

  takeUntil(n, accumulator = []) {
    if (n < this.value) {
      return;
    }

    if (n === this.value) {
      return accumulator;
    }

    accumulator.push(this.value);

    return this.next.takeUntil(n, accumulator);
  }
}

const stream = new Stream(10);
console.log(stream.takeUntil(20));
