'use strict';

const DEFAULT_LOG_FN = console.log;
const DEFAULT_CONFIG = {
    props: [{ namePattern: ".*" }],
    logger: (target, thisArg, argumentsList) => {DEFAULT_LOG_FN(target, argumentsList) }
};

function buildHandler(propConfig, generalConfig) {
    let logger = propConfig.logger || generalConfig.logger || DEFAULT_LOG_FN;
    return {
        apply: (target, ...args)=> {
            logger(target, ...args);
            return target.apply(...args);
        }
    };
}

function findPropConfig(propName, config) {
    return config.props.find(prop=>propName.match(new RegExp(prop.namePattern)));
}

function buildConfig(object, config) {
    if (!config) config = {...DEFAULT_CONFIG};

    if (config.includeProto === undefined && object.constructor !== '[Function: Object]') {
        config.includeProto = true;
    }

    if (!config.props) config.props = DEFAULT_CONFIG.props;
    if (!config.logger) config.logger = DEFAULT_CONFIG.logger;

    return config;
}

function methodLogger(object, config) {
    config = buildConfig(object, config);
    let props = Object.getOwnPropertyNames(object);

    if (config.includeProto) {
        props = props.concat(...Object.getOwnPropertyNames(object.__proto__));
    }

    for (let i = 0; i < props.length; i++) {
        let propName = props[i];

        if (typeof object[propName] !== 'function') continue;

        let propConfig = findPropConfig(props[i], config);
        if (!propConfig) continue;

        object[propName] = new Proxy(object[propName], buildHandler(propConfig, config));
    }

    return object;
}

module.exports = methodLogger;
