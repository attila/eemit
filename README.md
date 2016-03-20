# eemit
Event emitter micro library for Node and the browser

[![Build status](https://travis-ci.org/attila/eemit.svg)](https://travis-ci.org/attila/eemit)
[![Code Climate](https://codeclimate.com/github/attila/eemit/badges/gpa.svg)](https://codeclimate.com/github/attila/eemit)
[![Test Coverage](https://codeclimate.com/github/attila/eemit/badges/coverage.svg)](https://codeclimate.com/github/attila/eemit/coverage)

Attach event handlers easily on arbitrary objects or classes – or have an emitter on its own.

## Browser support

[![Browser matrix](https://saucelabs.com/browser-matrix/eemit.svg)](https://saucelabs.com/u/eemit)

Eemit can be run out of the box on most modern browsers and IE9+.

## Usage

Eemit is written using ES6 (ES2015) syntax and aimed for use in modern modular JavaScript applications built with bundlers. The module is bundled in an UMD module format so eemit can be loaded via a traditional script tag.

### Installation

Install via npm.

```
npm i -S eemit
```

To load the module in a standard script tag use the minified version from the dist folder.

Bundlers that transpile ES6 code can alternatively load `src/eemit.js`, e.g for Rollup users a `"jsnext:main"` field is provided. 

### Initialise

The module 'eemit' returns a single function after import.

```es6
import eemit from 'eemit';
```

When called without arguments, returns an object with API methods.

```es6
// Create an empty emitter.
const emitter = eemit();
```

When called on an object, it returns the object extended with API methods.

```es6
// Extend an already defined object by adding event handler methods.
const obj = {foo: 'bar'};
const emitterObject = eemit(myObject);
```

When called on a class, it returns a new class extending the original.

```es6
// Extend an existing class to ensure every instance can have events.
class myClass {
  constructor(bar) {
    this.foo = bar;
  }
}

// Extend the class with emitter capabilities.
const emitterClass = eemit(myClass);

// Instantiate.
const emitterInstance = new emitterClass('baz');
```

### API

#### on('name', handler)

Attach an event handler function for a new or existing event to the emitter.

```es6
const handler = () => {
  // Handler code here
};

// Attach handler to an event.
emitter.on('name', handler);
```

#### off('name', handler)

Detach an event handler function for a new or existing event to the emitter.
If handler is not specified, all handlers are removed from named event.

```es6
// Detach the specified handler from the event.
emitter.off('name', handler);

// Detach all handlers from the event.
emitter.off('name');
```

#### once('name', handler)

Attach an event handler function ensuring that the handler will only be called once.

```es6
emitter.once('name', handler);
```

#### trigger('name', [arguments])

Trigger an event. This executes all previously attached handlers to the event. Any arguments present will be passed along to the handlers.

```es6
// Trigger an event without arguments.
emitter.trigger('name');

// Trigger an event with arguments.
const handler = (list = [], foo = '') => {
  // handler code here
};
emitter.on('name', handler);
emitter.trigger('name', [1, 2 ,3], 'bar');
```

## Contributing

If you find an bug please open an issue.

Pull requests for bug fixes are also welcome, however in order to keep the library minimalistic I do not plan to introduce new features at the moment.

This project uses standard npm scripts to run the build and tests. Tests for Node are run by [Mocha](http://mochajs.org) and browser tests are run by [Karma](http://karma-runner.github.io) on browsers provided by [SauceLabs](https://saucelabs.com). Code coverage is reported via [Istanbul](http://gotwarlost.github.io/istanbul/) and the coverage report is published on [Code Climate](https://codeclimate.com/) via [Travis](http://travis-ci.org) build runs.

### Install the development environment

To install the development dependencies, make sure you have [Node.js](http://nodejs.org) installed, then run `npm install` in the project folder to install all development dependencies.

#### Running tests

Code style is enforced via eslint. To run it use `npm run test:lint`.

To run tests for Node, use `npm run test:node`.

To run tests for the browser you need to have a SauceLabs account. A SauceLabs user name and an access key needs to be set in order to run the tests. These can be set in `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables or by creating a `sauce.json` file in the repository root folder with the following contents.

```json
{
  "username": "your-sauce-username",
  "accessKey": "your-sauce-access-key"
}
```

Once set up, use `npm run test:browser` to run the suite on all browsers.

## License

Copyright 2016 [Attila Beregszaszi](http://attilab.com/), MIT licensed, see LICENSE for details.
