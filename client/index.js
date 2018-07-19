'use strict';

const express = require('express');
const app = express();
const exception = require('happy-try-catch').create({'logPrefix':'web3'});
const api = require('./api/api');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

//TODO: fix dates issue 
//TODO: sort by dates
//TODO: display participants 

function run (){
    var sendFile = (res, filename) => {
        exception.try(() => {
            res.sendfile('./public' + filename); 
        });
    }

    var registerGetFile = (filename) => {
        app.get(filename, (req, res) => { 
            sendFile(res, filename);
        });
    }

    function executeApiCall(req, res, call) {
        exception.try(() => {
            res.send(await(call()));
        });
    }

    app.get('/', (req, res) => { sendFile(res, '/index.html'); });
    registerGetFile('/index.html');
    
    registerGetFile('/js/common.js');
    registerGetFile('/js/console.js');
    registerGetFile('/js/config.js');
    registerGetFile('/js/cookies.js');
    registerGetFile('/js/modal.js');
    registerGetFile('/js/api.js');
    registerGetFile('/js/components/componentBase.js');
    registerGetFile('/js/components/toolbar.js');
    registerGetFile('/js/components/matches.js');
    registerGetFile('/js/components/bets.js');
    registerGetFile('/js/components/pnl.js');

    registerGetFile('/css/main.css');
    registerGetFile('/css/menu.css');
    registerGetFile('/css/spinner.css');
    registerGetFile('/css/console.css');
    registerGetFile('/css/modal.css');
    
    registerGetFile('/images/refresh.png');
    registerGetFile('/images/settings.png');
    registerGetFile('/images/close-button.png');


    app.get('/matches', async((req, res) => {
        executeApiCall(req, res, async(() => { 
            if (req.query && req.query.id) {
                console.log('GET /matches?' + req.query.id);
                return await(api.getMatchDetails(req.query)); 
            } else {
                console.log('GET /matches');
                return await(api.getMatches(req.query));
            }
        })); 
    }));

    //open http port 
    const httpPort = 2010;
    app.listen(httpPort, () => console.log('cryptochamp client listening on port ' + httpPort));
}

run();