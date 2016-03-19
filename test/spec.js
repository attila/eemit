import chai from 'chai';
import assign from 'object-assign';
import eemit from '../src/eemit.js';

const assert = chai.assert;

describe('Eemit', () => {
  context('Error handling', () => {
    const typeErrorMessage = 'Eemit can only be composed with objects or functions';
    const typeCallbackErrorMessage = 'Callback must be a function';

    describe('TypeErrors', () => {
      it('should not throw for no arguments', () => {
        const compound = () => eemit();
        assert.doesNotThrow(compound, TypeError, typeErrorMessage);
      });

      it('should throw for string', () => {
        const compound = () => eemit('foobar');
        assert.throws(compound, TypeError, typeErrorMessage);
      });

      it('should throw for null', () => {
        const compound = () => eemit(null);
        assert.throws(compound, TypeError, typeErrorMessage);
      });

      it('should not throw for array', () => {
        const compound = () => eemit([]);
        assert.doesNotThrow(compound, TypeError, typeErrorMessage);
      });

      it('factory().on should throw when handler is missing', () => {
        const compound = eemit();
        const handler = () => compound.on('some-event');
        assert.throws(handler, TypeError, typeCallbackErrorMessage);
      });

      it('factory().once should throw when handler is of wrong type', () => {
        const compound = eemit();
        const handler = () => compound.on('some-event', '');
        assert.throws(handler, TypeError, typeCallbackErrorMessage);
      });

      it('factory().off should throw when handler is of wrong type', () => {
        const compound = eemit();
        const handler = () => compound.off('some-event', {});
        assert.throws(handler, TypeError, typeCallbackErrorMessage);
      });
    });
  });

  class Counter {
    constructor() {
      this.counter = 0;
      this.isReset = false;
      this.timesReset = 0;
    }
    tick() {
      this.counter++;
    }
    reset() {
      this.counter = 0;
      this.isReset = true;
      this.timesReset++;
    }
  }

  const objectCounter = {
    counter: 0,
    isReset: false,
    tick() {
      this.counter++;
    },
    reset() {
      this.counter = 0;
      this.isReset = true;
      this.timesReset++;
    },
  };

  const tests = [
    {
      name: 'Class',
      getCounter() {
        const CompoundCounter = eemit(Counter);
        return new CompoundCounter();
      },
    },
    {
      name: 'Object',
      getCounter: () => eemit(assign({}, objectCounter)),
    },
    {
      name: 'empty Object (decorated later)',
      getCounter() {
        const ticker = eemit();
        ticker.counter = 0;
        ticker.isReset = false;
        ticker.timesReset = 0;
        ticker.tick = function tick() {
          ticker.counter++;
        };
        ticker.reset = function reset() {
          ticker.isReset = true;
          ticker.timesReset++;
        };
        return ticker;
      },
    },
  ];

  let ticker;

  // Generate tests.
  tests.forEach((test) => {
    context(`with ${test.name}`, () => {
      beforeEach(() => {
        ticker = test.getCounter();
      });

      describe('factory().on', () => {
        beforeEach(() => {
          ticker.on('tick', ticker.tick);
        });

        it('should not call handler when registered', () => {
          assert.equal(ticker.counter, 0);
        });

        it('should respond to event after registered', () => {
          ticker.trigger('tick');
          assert.equal(ticker.counter, 1);
        });

        it('should respond to event after registered more than once', () => {
          ticker.trigger('tick');
          assert.equal(ticker.counter, 1);
          ticker.trigger('tick');
          assert.equal(ticker.counter, 2);
        });
      });

      describe('factory().off', () => {
        it('should not execute unregistered handler', () => {
          ticker.on('tick', ticker.tick)
          .once('reset', ticker.reset)
          .off('tick')
          .off('reset')
          .trigger('tick')
          .trigger('reset');
          assert.equal(ticker.counter, 0);
          assert.equal(ticker.isReset, false);
        });
      });

      describe('factory().once', () => {
        beforeEach(() => {
          ticker.once('tick', ticker.tick);
        });

        it('should not call handler when registered', () => {
          assert.equal(ticker.counter, 0);
        });

        it('should respond to event only once', () => {
          ticker.trigger('tick');
          assert.equal(ticker.counter, 1);
          ticker.trigger('tick');
          assert.equal(ticker.counter, 1);
        });
      });

      describe('factory()._EemitEvents is own property', () => {
        it('should not respond to unregistered event', () => {
          assert.isOk(ticker.hasOwnProperty('_eemitEvents'));
        });
      });

      describe('Chainable', () => {
        it('should return callee', () => {
          const chain = ticker.
            once('a', () => {}).
            on('b', () => {}).
            off('a').
            trigger('b');
          assert.equal(chain, ticker, 'should return callee');
        });
      });
    });
  });
});
