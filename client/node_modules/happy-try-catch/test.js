'use strict'; 

overrideDefaultHandlingPerCall();

function functionThatErrors() {
    const nullObj = null; return nullObj.f();
}

function simpleCase() {
    const exception = require('./index').create({ logPrefix: 'TEST'});

    //simple try/catch, using all default or pre-configured options 
    return exception.try(() => {
        functionThatErrors();
    });
}

function withFinally() {
    const exception = require('./index').create({ logPrefix: 'TEST'});

    //simple try/catch, add finally 
    return exception.try(() => {
        return functionThatErrors();
    },  { 
        finally: (e, opts) => {
            console.log("error has been duly handled, m'liege"); 
        }
    });
}

function allOptions() {
    //provide default options on construction
    const exception = require('./index').create({ 
        logPrefix: 'TEST',          // log prefix
        rethrow: true,              // re-throw all caught exceptions after handling
        finally: (e, opts) => {},   // provide a default finally 
        onError: (e, opts) => {},   // add additional, custom error handling (e.g. custom logging) 
        defaultReturnValue: ''      // value returned if error is caught/handled (default is undefined)
    });

    //simple try/catch, using all pre-configured options 
    exception.try(() => {
        return functionThatErrors();
    });
}

function overrideOptions() {
    //provide default options on construction
    const exception = require('./index').create({ 
        logPrefix: 'TEST',      // log prefix
        rethrow: true,          // re-throw all caught exceptions after handling
        finally: (e, opts) => {},     // provide a default finally 
        onError: (e, opts) => {},     // add additional, custom error handling (e.g. custom logging) 
        defaultReturnValue: ''  // value returned if error is caught/handled (default is undefined)
    });

    //override some or all default options on a per-call basis
    exception.try(() => {
        return functionThatErrors();
    }, {
        logPrefix: 'TEST A',        // change log prefix just for this one call
        finally: null,              // do not execute a finally for this call
        defaultReturnValue: null,   // change default return value for this call
        onError: (e, opts) => {            // additional error handling for this call
            console.log(opts.logPrefix() + ' - some custom logging...');
        }
    });
}

function overrideDefaultHandling() {

    //globally override the default handler 
    const exception = require('./index').create({ 
        logPrefix: 'TEST',
        handleError: (e, options) => {
            console.log(options.logPrefix() + ' - eep eep'); 
        }
    });

    exception.try(() => {
        return functionThatErrors();
    });
}

function overrideDefaultHandlingPerCall() {
    const exception = require('./index').create({ logPrefix: 'TEST'});

    exception.try(() => {
        return functionThatErrors();
    }, {
        handleError: (e, options) => {
            console.log(options.logPrefix() + ' - eep eep'); 
        }
    });
}

function withAsync() {
    //usage with asyncawait library 
    const exception = require('./index').create({ logPrefix: 'TEST'});
    const async = require('asyncawait/async');
    const await = require('asyncawait/await');

    //async function 
    const asyncFunctionThatErrors = async(() => {
        const x = 0; return 1/x; 
    }); 

    return exception.try(() => {
        return await(asyncFunctionThatErrors()); 
    });
}

function withPromises() {

    const exception = require('./index').create({ logPrefix: 'TEST'});

    //inside of promise 
    return new Promise((resolve, reject) => {

        //usage as normal 
        exception.try(() => {   
            resolve(functionThatErrors());
        }, {
            //on error, be sure to reject promise (else it will hang forever) 
            onError: (e) => {
                console.log('rejecting promise'); 
                reject(e); 
            }
        });
    }); 
}