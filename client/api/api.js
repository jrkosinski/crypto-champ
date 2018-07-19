'use strict'; 

const async = require('asyncawait/async');
const await = require('asyncawait/await');
const exception = require('happy-try-catch').create({logPrefix:'API'});

const contractInterface = require('./contractInterface'); 

const Web3 = require('web3'); 

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

/*
web3.eth.getAccounts()
    .then(console.log).catch((e) => {
        console.log(e);
    });
    */
//console.log(contractInterface);

//const contract = web3.eth.contract(abi).at(web3.toChecksumAddress("0x7bf7ae2da6013aa8de29627e29e4b9fa807d4469"));
//const contract = new web3.eth.Contract(abi.abi, web3.utils.toChecksumAddress("0x7bf7ae2da6013aa8de29627e29e4b9fa807d4469")); 
const contract = new web3.eth.Contract(contractInterface.abi, web3.utils.toChecksumAddress("0x431c72b2bb6f69f1cb9b8b1a47de715d26c4b4bb")); 

//for(let p in contract) console.log(p);

//contract.methods.testOracleConnection().call().then(console.log).catch(console.error);

//contract.methods.addTestData().call();

const callMethod = async((method) => {
    return new Promise((resolve, reject) => {
        exception.try(() => {
            method.call()
            .then((data) => {
                resolve(data); 
            })
            .catch((e) => {
                reject(e);
            });
        }, {
            onError: (e) => {
                reject(e); 
            }
        });
    });
});

const getMatches = (query) => {
    return new Promise((resolve, reject) => {
        exception.try(() => {
            let f = contract.methods.getBettableMatches(); 
            if (query.pendingOnly) {
                f = contract.methods.getBettableMatches(); 
            }
            
            f.call()
            .then((data) => {
                resolve(data); 
            })
            .catch((e) => {
                reject(e);
            });
        }, {
            onError: (e) => {
                reject(e); 
            }
        });
    });
};

const getMatchDetails = (query) => {
    return new Promise((resolve, reject) => {
        exception.try(() => {
            if (query.id) {
                contract.methods.getMatch(query.id).call()
                .then((data) => {
                    resolve(data); 
                })
                .catch((e) => {
                    reject(e);
                });
            } else {
                resolve(null);
            }
        }, {
            onError: (e) => {
                reject(e); 
            }
        });
    });
};

const getBets = (query) => {
    return new Promise((resolve, reject) => {
        exception.try(() => {
            contract.methods.getUserBets().call()
            .then((data) => {
                resolve(data); 
            })
            .catch((e) => {
                reject(e);
            });
        }, {
            onError: (e) => {
                reject(e); 
            }
        });
    });
};

const getBetDetails = (query) => {
    return new Promise((resolve, reject) => {
        exception.try(() => {
            if (query.id) {
                contract.methods.getUserBet(query.id).call()
                .then((data) => {
                    if (data)
                        data.matchId = query.id; 
                    resolve(data); 
                })
                .catch((e) => {
                    reject(e);
                });
            } else {
                resolve(null);
            }
        }, {
            onError: (e) => {
                reject(e); 
            }
        });
    });
};

module.exports = {
    getMatches,
    getMatchDetails, 
    getBets,
    getBetDetails
}