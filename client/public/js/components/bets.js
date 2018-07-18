'use strict'; 

function BetsComponent(dataCoordinator) {
    const _this = this; 
    let _showAll = false;

    ComponentBase.call(this, dataCoordinator);

    /**
     * 
     * @param {*} trade 
     */
    const formatTooltipText = (bet) => {  
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

    this.showAll = () => { return _showAll; }

    /**
     * show/hide local progress spinner
     * @param {*} show 
     */
    this.progress = (show) => {
        if (show)
            $("#betsProgress").css('display', 'block');
        else 
            $("#betsProgress").css('display', 'none');
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

            /*
            if (data && data.data && data.data.all) {
                $("#ordersContent").empty();

                let orders = data.data.all; 

                for (let n=0; n<orders.length; n++) {
                    let order = orders[n]; 

                    let status = order.status; 
                    if (status.length > 24) 
                        status = status.substring(0, 24); 

                    if (!order.side) 
                        order.side = ''; 

                    let html = `<div class='console-row tooltip'>` + 
                    `<span class='small-gold-text console-cell' style='width:150px'>${order.exchange}/${order.symbol}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:160px'>${status}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:50px'>${order.side}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:50px'>${order.type}</span>` + 
                    `<span class='small-gold-text console-cell' style='width:50px'>${order.quantity}</span>` + 
                    `<span class='small-green-text console-cell' style='width:100px'>${order.price}</span>` + 
                    `<span class='tooltip-text'>${formatTooltipText(order)}<span>` + 
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
                    id: 'betsSettings',
                    menu: [
                        {
                            id: 'showAllBets',
                            text: 'show all',
                            onClick: () => { _this.toggleShowAll(); }                        
                        }
                    ]
                }, 
                {
                    type:'refresh',
                    id: 'betsRefresh',
                    onClick: () => { _this.dataCoordinator.refreshBets(_showAll); }
                }
            ]);
    
            return ("<div id='betsComponent'>" +         
                "<div id='betsProgress' class='loader'></div>" + 
                "<div id='betsContent'></div></div>");
        });
    };
}

