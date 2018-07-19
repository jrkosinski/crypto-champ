'use strict'; 


function MatchesComponent(dataCoordinator) {
    const _this = this; 
    const _matches = {};
    let _showAll = false;
    const _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; 

    ComponentBase.call(this, dataCoordinator);

    /**
     * 
     * @param {*} trade 
     */
    const formatTooltipText = (match) => {  
        return exception.try(() => {
            //let output = `<span class='small-green-text console-cell' style='width:130px'>${order.orderId}</span>` + 
            //`<span class='small-green-text console-cell' style='width:130px'>${order.timestamp}</span>`; 

            let output = `${match.id}<br/><br/>` + 
            `${match.name} ${formatMatchDate(match.date)}<br/><br/>` + 
            `${match.participantCount} participants:<br/><br/>` + 
            `${formatMatchOutcome(match.outcome)}`; 


            return output; 
        });
    }; 

    const formatMatchDate = (timestamp) => {
        let output = timestamp; 

        //TODO: convert for local timezone
        const date = new Date(timestamp * 1000); 
        output = `${_months[(date.getMonth())]} ${date.getDay()}`;

        if (date.getFullYear != new Date().getFullYear())
            output += ', ' + date.getFullYear(); 

        return output; 
    };

    const formatMatchOutcome = (outcome) => {
        let output = 'unknown'; 

        switch(parseInt(outcome)) {
            case 0: 
            output = 'pending';
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
    }

    this.showAll = () => { return _showAll; }

    /**
     * show/hide local progress spinner
     * @param {*} show 
     */
    this.progress = (show) => {
        if (show)
            $("#matchesProgress").css('display', 'block');
        else 
            $("#matchesProgress").css('display', 'none');
    };

    /**
     * 
     */
    this.toggleShowAll = () => {
        _showAll = !_showAll;
        //_this.dataCoordinator.refreshOrders(_showAll); 

        //change the menu item text 
        const menuItemText = (_showAll) ? 'hide inactive' : 'show all'; 
        _this.toolbar.setMenuItemText(0, menuItemText); 
    };

    this.addOrUpdate = (match) => {
        if (match) {
            _matches[match.id] = match; 
            let rowId = `div-match-${match.id}`;

            let rowHtml = `<span class='small-gold-text console-cell' style='width:300px'>${match.name}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:160px'>${formatMatchDate(match.date)}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:100px'>${formatMatchOutcome(match.outcome)}</span>` +
                    `<span class='tooltip-text'>${formatTooltipText(match)}<span>`;
            
            console.log($("#" + rowId));
            if ($("#" + rowId).length) {
                $("#" + rowId).html(rowHtml); 
            } else {
                $("#matchesContent").append(`<div class='console-row tooltip' id='${rowId}'>${rowHtml}</div>`);
            }
        }
    }
    
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
}

