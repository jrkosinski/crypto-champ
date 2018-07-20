'use strict'; 

function PnlComponent(dataCoordinator) {
    const _this = this; 
    let _showAll = false;

    ComponentBase.call(this, dataCoordinator);

    this.progress = (show) => {
        if (show)
            $("#pnlProgress").css('display', 'block');
        else 
            $("#pnlProgress").css('display', 'none');
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
    
            return ("<div id='betsComponent'>" +         
                "<div id='pnlProgress' class='loader'></div>" + 
                "<div id='betsContent'></div></div>");
        });
    };
}

