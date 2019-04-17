# method-logger
    Pattern based logger for object/class methods

You can simply trace which function is called and what is passed.

With this you can easy add logs for all object/class methods.

Uses js Proxy.

## Usage

For now every method can have only one logger.

### Simplest case

By default wraps all methods in object or class.

```js
const logify = require('method-logger')

testObj = logify(testObj);
```


### General objects

```js
const logify = require('method-logger')

let testObj = {
    fn: (a)=>a,
    fn2: (a, b)=>a + b,
    fn3: (a, b)=>{throw new Error('error name')},
    prop: 1,
    strProp: 'prop',
    objProp: {},
};

let proxyLoggerConfig = {
    props: [{
        namePattern: 'fn.*'
    }],
    logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
};

testObj = logify(testObj, proxyLoggerConfig);

testObj.fn(1)           // stdout >> [Function: fn] [ 1 ]
testObj.fn2(1, 2)       // stdout >> [Function: fn2] [ 1, 2 ]
testObj.fn3()           // stdout >> [Function: fn3] []
```

### Classes

Module tries to recognise is this class or object by comparing constructor to string `[Function: Object]`.
This should work in most cases, but you can specify that it is class by manually passing `includeProto: true` in config object

```js
const logify = require('method-logger')

class TestClass {
    fn (a) { return a }
    fn2 (a, b) { return a + b }
    fn3 (a, b) { throw new Error('error name') }
};

let proxyLoggerConfig = {
    props: [{
        namePattern: 'fn.*',
    }],
    logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) },
    includeProto: true
};

let testObj = logify(new TestClass(), proxyLoggerConfig);

testObj.fn(1)           // stdout >> [Function: fn] [ 1 ]
testObj.fn2(1, 2)       // stdout >> [Function: fn2] [ 1, 2 ]
testObj.fn3()           // stdout >> [Function: fn3] []
```

### Different loggers for functions with similar names

In next case for `fn$` functions console.trace will be used,
for `fn(3|2)` console.warn will be used,
and in other cases default logger - console.log will be used

```js

let config = {
    props: [
        {
            namePattern: 'fn$',
            logger: (target, thisArg, argumentsList) => {console.trace(target, argumentsList) }
        },
        {
            namePattern: 'fn(3|2)',
            logger: (target, thisArg, argumentsList) => {console.warn(target, argumentsList) }
        }
        {
            namePattern: 'customFunction',
        },
        {
            namePattern: '.*',
        },
    ],
    logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
};
```