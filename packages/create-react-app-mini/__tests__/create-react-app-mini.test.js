'use strict';

const createReactAppMini = require('..');
const assert = require('assert').strict;

assert.strictEqual(createReactAppMini(), 'Hello from createReactAppMini');
console.info("createReactAppMini tests passed");
