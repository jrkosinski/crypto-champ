'use strict'; 

const helpers = require('../helpers'); 

/**
 * Encapsulates a combined finite set of default options, with optional overrides. 
 * Returns the appropriate value for each option when requested. 
 * 
 * @param {json} defaults
 *  flat json structure containing defaults for each option 
 * @param {json} overrides
 *  optional overrides for selected properties
 */
function Options(defaults, overrides) {
    const _this = this; 
    const _defaults = defaults; 
    const _overrides = overrides; 

    // PROPERTY GETTERS 
    this.logPrefix = () => { return getOption('logPrefix'); }; 
    this.onError = () => { return getOption('onError'); };
    this.finally = () => { return getOption('finally'); };
    this.rethrow = () => { return getOption('rethrow'); }; 
    this.handleError = () => { return getOption('handleError'); }
    this.defaultReturnValue = () => { return getOption('defaultReturnValue'); };

    /**
     * gets the current value of the given option 
     * 
     * @param {*} name 
     *  name of an option property 
     */
    /* any */ const getOption = (name) => {
        if (_overrides) {
            if (helpers.isDefined(_overrides[name]))
                return _overrides[name]; 
        }
        return _defaults ? _defaults[name] : undefined; 
    }; 
}

module.exports = Options;
