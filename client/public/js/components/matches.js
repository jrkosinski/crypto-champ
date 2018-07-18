'use strict'; 

function MatchesComponent(dataCoordinator) {
    const _this = this; 
    let _showAll = false;

    ComponentBase.call(this, dataCoordinator);

    /**
     * 
     * @param {*} trade 
     */
    const formatTooltipText = (match) => {  
        return exception.try(() => {
            //let output = `<span class='small-green-text console-cell' style='width:130px'>${order.orderId}</span>` + 
            //`<span class='small-green-text console-cell' style='width:130px'>${order.timestamp}</span>`; 

            let output = "";
            //let output = `${order.orderId}<br/><br/>` + 
            //`${new Date(Date.parse(order.timestamp.toString())).toString()}<br/><br/>` + 
            //`${order.fullStatus ? order.fullStatus : order.status}`; 

            return output; 
        });
    }; 

    const formatMatchDate = (timestamp) => {
        return timestamp;
    };

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

    this.update = (data) => {   
        exception.try(() => {

            if (data) {
                $("#matchesContent").empty();

                let matches = data;

                for (let n=0; n<matches.length; n++) {
                    let match = matches[n]; 

                    let html = `<div class='console-row tooltip'>` + 
                    `<span class='small-gold-text console-cell' style='width:300px'>${match.name}/${order.symbol}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:160px'>${formatMatchDate(match.date)}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:50px'>${match.outcome}</span>` + 
                    //`<span class='tooltip-text'>${formatTooltipText(order)}<span>` + 
                    `</div>`;
                    $("#ordersContent").append(html); 
                }
            }
            */
        });
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
}

