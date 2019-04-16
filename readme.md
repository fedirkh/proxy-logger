# method-logger
    Pattern based logger for object/class methods

You can simply trace which function is called and what is passed.

With this you can easy add logs for all object/class methods.

Uses js Proxy.

## Usage

For now every method can have only one logger.

### Simplest case

By default wraps all methods in object.

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
        namePattern: 'fn.*',
        logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
    }]
};

testObj = logify(testObj, proxyLoggerConfig);

testObj.fn(1)           // stdout >> [Function: fn] [ 1 ]
testObj.fn2(1, 2)       // stdout >> [Function: fn2] [ 1, 2 ]
testObj.fn3()           // stdout >> [Function: fn3] []
```

### Classes

In case of classes you need to add `includeProto: true` in config object

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
        logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
    }],
    includeProto: true
};

let testObj = logify(new TestClass(), proxyLoggerConfig);

testObj.fn(1)           // stdout >> [Function: fn] [ 1 ]
testObj.fn2(1, 2)       // stdout >> [Function: fn2] [ 1, 2 ]
testObj.fn3()           // stdout >> [Function: fn3] []
```

## Config examples

### Proxy for every method in class

```js

let config = {
    props: [{
        namePattern: '.*',
        logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
    }],
    includeProto: true
};
```

### Different proxy for functions with similar names

```js

let config = {
    props: [
        {
            namePattern: 'fn$',
            logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
        },
        {
            namePattern: 'fn(3|2)',
            logger: (target, thisArg, argumentsList) => {console.warn(target, argumentsList) }
        }
    ]
};
```