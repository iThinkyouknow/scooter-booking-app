const noOp = () => { };

const apply = (val, fn) => fn(val);
const compose = fnArray => init_val => fnArray.reduce(apply, init_val);

const isPresentType = (type) => (value) => {
    //string, number, boolean, object, array, function
    const isType = (typeof value === type);

    if (type === 'string') {
        return (isType && value.length > 0);
    } else if (type === 'number') {
        return (isType && !Number.isNaN(value));
    } else if (type === 'array') {
        return (Array.isArray(value) && value.length > 0);
    } else if (type === 'object') {
        return (isType && value !== null);
    } else if (type === 'boolean' || type === 'function') {
        return isType;
    }
};

const isNotUndefined = val => val !== undefined;

const isNumber = isPresentType('number');
const isArray = isPresentType('array');
const isString = isPresentType('string');
const isObject = isPresentType('object');
const isBoolean = isPresentType('boolean');
const isFunction = isPresentType('function');

const get = (obj, pathStr, fallback, type) => {
    if (!isString(pathStr)) return fallback;
    const returnValue = pathStr.split(/\.|\[|\]/).reduce((retObj, prop) => {
        if (isObject(retObj)) return retObj[prop];
    }, obj);

    if (isString(type)) {
        return (typeof returnValue === type)
            ? returnValue
            : fallback;
    }

    return (returnValue !== null && returnValue !== undefined)
        ? returnValue
        : fallback;
};

// value at end for easier compose
const jsonStringify = replacer => space => value => {
    try {
        return JSON.stringify(value, replacer, space);
    } catch (error) {
        console.error(error);
        return '';
    }
};

// string at end for easier compose
const jsonParse = reviver => string => {
    if (!isString(string)) throw `Buddy, pass in a valid JSON string: ${string}`;
    try {
        return JSON.parse(string, reviver);
    } catch (error) {
        console.error(error);
        return {};
    }
};

module.exports = {
    noOp,
    compose,
    isPresentType,
    isNotUndefined,
    isNumber,
    isArray,
    isString,
    isObject,
    isBoolean,
    isFunction,
    get,
    jsonStringify,
    jsonParse
}