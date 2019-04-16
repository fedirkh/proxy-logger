'use strict';

const DEFAULT_LOG_FN = console.log;

/*
let proxyLoggerConfig = {
    props: [{name: "send", logger: tgBotLogger.info.bind(tgBotLogger), handlers: {apply: {}}}],
    includeProto: true
};
*/

function buildHandler(config) {
    let handler = {};
    let logger = config.logger || DEFAULT_LOG_FN;

    if (config.handlers.apply) {
        handler.apply = (target, thisArg, argArray)=> {
            logger(target, JSON.stringify(argArray));
            return target.apply(thisArg, argArray);
        }
    }

    return handler;
}

function findPropConfig(propName, config) {
    return config.props.find(prop=>{
        return propName.match(new RegExp(prop.name))
    });
}

function log(object, config) {
    let props = Object.getOwnPropertyNames(object);

    if (config.includeProto) {
        props = props.concat(...Object.getOwnPropertyNames(object.__proto__));
    }

    for (let i = 0; i < props.length; i++) {
        let propName = props[i];
        let propConfig = findPropConfig(props[i], config);
        if (!propConfig) continue;
        console.log(propName);
        object[propName] = new Proxy(object[propName], buildHandler(propConfig));
    }

    return object;
}

module.exports = log;