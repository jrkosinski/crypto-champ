'use strict'; 

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
const contract = new web3.eth.Contract(contractInterface.abi, web3.utils.toChecksumAddress("0x5b9f5a7c31efc49fa423de2105618d6347240f73")); 

//for(let p in contract) console.log(p);

//contract.methods.testOracleConnection().call().then(console.log).catch(console.error);