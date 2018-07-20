'use strict'; 

let _modal = null; 

function openPlaceBetModal(matchId) {
    $("#participantText").val(""); 
    $("#betAmountText").val(""); 
    $("#betMatchId").val(matchId); 

    _modal = new Modal("placeBetModal"); 
    _modal.open(); 
}


function MatchesComponent(dataCoordinator) {
    const _this = this; 
    const _matches = {};
    let _matchCount = 0; 
    let _showAll = false;
    const _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; 

    ComponentBase.call(this, dataCoordinator);

    const formatTooltipText = (match) => {  
        return exception.try(() => {
            //let output = `<span class='small-green-text console-cell' style='width:130px'>${order.orderId}</span>` + 
            //`<span class='small-green-text console-cell' style='width:130px'>${order.timestamp}</span>`; 

            let output = `${match.id}<br/><br/>` + 
            `${match.name} ${formatMatchDate(match.date)}<br/><br/>` + 
            `${match.participantCount} participants:<br/><br/>`; 
            if (match.participants) {
                const partArray = match.participants.split('|'); 
                for (let n=0; n<partArray.length; n++) {
                    output += ` -  ${partArray[n]}<br/><br/>`; 
                }
            }
            output += `${formatMatchOutcome(match.id, match.outcome, true)}`; 


            return output; 
        });
    }; 

    const formatMatchDate = (timestamp) => {
        let output = timestamp; 

        //TODO: convert for local timezone
        const date = new Date(timestamp * 1000); 
        output = `${_months[(date.getMonth())]} ${date.getDay()+1}`;

        if (date.getFullYear != new Date().getFullYear())
            output += ', ' + date.getFullYear(); 

        return output; 
    };

    const userHasBet = (matchId) => {
        if (dataCoordinator && dataCoordinator.components.bets) 
            return dataCoordinator.components.bets.userHasBet(matchId); 
        return false;
    };

    const formatMatchOutcome = (matchId, outcome, forTooltip) => {
        let output = 'unknown'; 

        switch(parseInt(outcome)) {
            case 0: 
                if (forTooltip) {
                    output = "pending"; 
                } else {
                    output = forTooltip ? "pending" : `<a href="#" onClick="openPlaceBetModal('${matchId}')">place bet</a>`;
                }
                if (userHasBet(matchId))
                    output = "BET PLACED"; 

                break;
            case 1: 
                output = 'underway';
                break;
            case 2: 
                output = 'draw';
                break;
            case 3: 
                output = 'decided';
                break;
            default:
                output= outcome;
        }

        return output; 
    };

    const formatRowHtml = (match) => {
        return `<span class='small-gold-text console-cell' style='width:300px'>${match.name}</span>` + 
        `<span class='small-gold-text console-cell' style='width:160px'>${formatMatchDate(match.date)}</span>` + 
        `<span class='small-gold-text console-cell' style='width:100px'>${formatMatchOutcome(match.id, match.outcome)}</span>` +
        ''; //`<span class='tooltip-text'>${formatTooltipText(match)}<span>`;
    }; 


    this.getMatches = () => { return _matches; }; 

    this.getMatchCount = () => { return _matchCount; }; 

    this.showAll = () => { return _showAll; }; 

    this.progress = (show) => {
        if (show)
            $("#matchesProgress").css('display', 'block');
        else 
            $("#matchesProgress").css('display', 'none');
    };

    this.toggleShowAll = () => {
        _showAll = !_showAll;
        //_this.dataCoordinator.refreshOrders(_showAll); 

        //change the menu item text 
        const menuItemText = (_showAll) ? 'hide inactive' : 'show all'; 
        _this.toolbar.setMenuItemText(0, menuItemText); 
    };

    this.addOrUpdate = (match) => {
        if (match) {
            if (!_matches[match.id])
                _matchCount++; 

            _matches[match.id] = match; 
            let rowId = `div-match-${match.id}`;

            let rowHtml = formatRowHtml(match);
            
            if ($("#" + rowId).length) {
                $("#" + rowId).html(rowHtml); 
            } else {
                $("#matchesContent").append(`<div class='console-row tooltip' id='${rowId}'>${rowHtml}</div>`);
            }
        }
    };
    
    this.render = () => {
        return exception.try(() => {
            _this.toolbar = new Toolbar([
                {
                    type:'settings',
                    id: 'matchesSettings',
                    menu: [
                        {
                            id: 'showAllMatches',
                            text: 'show all',
                            onClick: () => { _this.toggleShowAll(); }                        
                        }
                    ]
                }, 
                {
                    type:'refresh',
                    id: 'matchesRefresh',
                    onClick: () => { _this.dataCoordinator.refreshMatches(_showAll); }
                }
            ]);
    
            return ("<div id='matchesComponent'>" +         
                "<div id='matchesProgress' class='loader'></div>" + 
                "<div id='matchesContent'></div></div>");
        });
    };

    this.updateBetStatus = (matchId, hasBet) => {
        if (hasBet) {
            let rowId = `div-match-${matchId}`;

            if ($("#" + rowId).length) {
                $("#" + rowId).html(formatRowHtml(_matches[matchId])); 
            }
        }
    }; 
}

