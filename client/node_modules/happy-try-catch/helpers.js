'use strict'; 

/**
 * determines whether the given value is a callable function
 * 
 * @param {*} f 
 *  value to check for function-ness
 */
/*bool*/ function isFunction(f) {
    return f && {}.toString.call(f) === '[object Function]';
}

/**
 * determines whether the given value is defined 
 * 
 * @param {*} v     
 *  value to check 
 */
/*bool*/ function isDefined(v) {
    return typeof v !== 'undefined'; 
}


module.exports = {
    isFunction, 
    isDefined
};
