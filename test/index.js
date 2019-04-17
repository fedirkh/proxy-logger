'use strict';

let logify = require('../index');

describe('logify', function () {
    it ('tests simplest usage', function () {
        let testObj = {
            fn: (a)=>a,
            fn2: (a, b)=>a + b,
            fn3: (a, b)=>{throw new Error('error name')},
            prop: 1,
            strProp: 'prop',
            objProp: {},
        };

        testObj = logify(testObj);

        testObj.prop;
        testObj.objProp;
        testObj.fn(1).should.be.equal(1);
        testObj.fn2(1, 2).should.be.equal(3);
        try {
            testObj.fn3();
            throw new Error('Fn3 should throw custom error');
        } catch (e) {
            e.message.should.be.equal('error name');
        }
        console.log('1---------------------------\n')
    });

    it('should log object functions call', function () {
        let testObj = {
            fn: (a)=>a,
            fn2: (a, b)=>a + b,
            fn3: (a, b)=>{throw new Error('error name')},
            prop: 1,
            strProp: 'prop',
            objProp: {},
        };

        let config = {
            props: [{
                namePattern: 'fn.*',
                logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }
            }]
        };

        testObj = logify(testObj, config);

        testObj.prop;
        testObj.objProp;
        testObj.fn(1).should.be.equal(1);
        testObj.fn2(1, 2).should.be.equal(3);
        try {
            testObj.fn3();
            throw new Error('Fn3 should throw custom error');
        } catch (e) {
            e.message.should.be.equal('error name');
        }
        console.log('2---------------------------\n')
    });

    it('should log class functions call', function () {
        class TestClass {
            fn (a) { return a }
            fn2 (a, b) { return a + b }
            fn3 (a, b) { throw new Error('error name') }
        };

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

        let testObj = logify(new TestClass(), config);

        testObj.fn(1).should.be.equal(1);
        testObj.fn2(1, 2).should.be.equal(3);
        try {
            testObj.fn3();
            throw new Error('Fn3 should throw custom error');
        } catch (e) {
            e.message.should.be.equal('error name');
        }
        console.log('3---------------------------\n')
    });

    it('should log class functions call with almost no config', function () {
        class TestClass {
            fn (a) { return a }
            fn2 (a, b) { return a + b }
            fn3 (a, b) { throw new Error('error name') }
        }

        let testObj = logify(new TestClass(), {logger: (target, thisArg, argumentsList) => {console.warn(target, argumentsList) }});

        testObj.fn(1).should.be.equal(1);
        testObj.fn2(1, 2).should.be.equal(3);
        try {
            testObj.fn3();
            throw new Error('Fn3 should throw custom error');
        } catch (e) {
            e.message.should.be.equal('error name');
        }
        console.log('4---------------------------\n')
    });


    it('should use general provided logger', function () {
        let testObj = {
            fn: (a)=>a,
            fn2: (a, b)=>a + b,
            fn3: (a, b)=>{throw new Error('error name')},
            prop: 1,
            strProp: 'prop',
            objProp: {},
        };

        let config = {
            props: [
                {namePattern: 'fn($|2)'},
                {namePattern: 'fn3', logger: (target, thisArg, argumentsList) => {console.log(target, argumentsList) }},
            ],
            logger: (target, thisArg, argumentsList) => {console.warn(target, argumentsList) }
        };

        testObj = logify(testObj, config);

        testObj.prop;
        testObj.objProp;
        testObj.fn(1).should.be.equal(1);
        testObj.fn2(1, 2).should.be.equal(3);
        try {
            testObj.fn3();
            throw new Error('Fn3 should throw custom error');
        } catch (e) {
            e.message.should.be.equal('error name');
        }
        console.log('5---------------------------\n')
    });
});