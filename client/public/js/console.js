
let _alertOverlayHandle = null;

function DataCoordinator() {
    const _this = this; 
    
    /**
     * 
     */
    this.refreshMatches = (showAll) => {   
        exception.try(() => {
            layoutComponents.matches.progress(true); 

            api.getMatches(!showAll, (data, err) => {
                layoutComponents.matches.progress(false); 
                //TODO: handle error 
                if (err) {
                    
                }
                else {
                    if (data && data.length) {
                        for (let n=0; n<data.length; n++) {
                            api.getMatchDetails(data[n], (match) => {
                                layoutComponents.matches.addOrUpdate(match); 
                            });
                        }
                    }
                }
            }); 
        });
    };
    
    /**
     * 
     */
    this.refreshBets = (showAll) => {   
        exception.try(() => {
            layoutComponents.bets.progress(true); 

            /*
            api.getOrders(showAll, (data, err) => {
                layoutComponents.orders.progress(false); 
                //TODO: handle error 
                if (err) {

                }
                else {
                    layoutComponents.orders.update({ data: { all: data }}); 
                }
            }); 
            */
        });
    };

    /**
     * start everything running/listening 
     */
    this.start = () => {
        _this.refreshMatches();
        _this.refreshBets();

        //setInterval(() => {
        //    _this.refreshMatches(layoutComponents.matches.showAll()); 
        //    _this.refreshBets(layoutComponents.bets.showAll()); 
        //}, 60000); 
    }; 
}

function showMainScreen() {
    _dataCoordinator.start();
    
    const layout = new GoldenLayout(layoutConfig, $("#mainLayout"));

    const registerComponent = (componentName) => {
        layout.registerComponent(componentName, function (container, componentState) {
            const component = layoutComponents[componentName]; 
            component.container = container.getElement();
            container.getElement().html(component.render());
    
            container.on('tab', (tab) => {
                if (component.toolbar && component.toolbar.render) {
                    tab.element.append(component.toolbar.render());
                    component.initialize();
                }
            });
        });
    };

    registerComponent('bets');
    registerComponent('matches');
    registerComponent('pnl');
    
    var w = $(window).width();
    var h = $(window).height();

    $("#mainLayout").css('width', w-20);
    $("#mainLayout").css('height', h-50);
    
    layout.init();

    //TODO: still need this? 
    //$("#mainTopDiv").html(layoutComponents.tarsState.render()); 
}

function showAlertOverlay(text) {
    $("#alertMessage").text(text);
    
    if (!_alertOverlayHandle) {
        _alertOverlayHandle = setInterval(() => {
            $("#alertOverlay").stop(true, true).fadeIn();

            setTimeout(() => {
                $("#alertOverlay").stop(true, true).fadeOut();
            }, 1000);
        }, 5000); 
    }
}

function hideAlertOverlay() {
    if (_alertOverlayHandle) {
        clearInterval(_alertOverlayHandle); 
        $("#alertOverlay").stop(true, true).fadeOut();
    }
}

//instantiate the data coordinator
const _dataCoordinator = new DataCoordinator(); 

//create the golden layout config 
const layoutConfig = {
    content: [
        {
            type: "column", 
            content: [
                {
                    type: "row",
                    content: [
                        {
                            type: "component",
                            componentName: "matches",
                            componentState: { label:"true"}
                        }
                    ]
                },
                {
                    type: "row",
                    content: [
                        {
                            type: "component",
                            componentName: "bets",
                            componentState: { label:"true"}
                        }
                    ]
                },
            ]
        }
    ]
};

//layout components collection
const layoutComponents = {
    matches: new MatchesComponent(_dataCoordinator),
    bets: new BetsComponent(_dataCoordinator),
    pnl: new PnlComponent(_dataCoordinator)
};

$(document).ready(() => {

    startup(() => {
        showMainScreen();
    }); 
});