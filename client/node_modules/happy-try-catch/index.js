'use strict'; 

const Handler = require('./classes/Handler');

module.exports = {
    create: (options) => { return new Handler(options); }
};
