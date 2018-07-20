
let _alertOverlayHandle = null;


function DataCoordinator() {
    const _this = this;     
    
    this.refreshMatches = (showAll) => {   
        exception.try(() => {
            _this.components.matches.progress(true); 

            api.getMatches(false, (data, err) => {
                _this.components.matches.progress(false); 
                //TODO: handle error 
                if (err) {
                    
                }
                else {
                    if (data && data.length) {
                        for (let n=0; n<data.length; n++) {
                            api.getMatchDetails(data[n], (match) => {
                                _this.components.matches.addOrUpdate(match); 

                                //update bets component with matches data 
                                if (_this.components.matches.getMatchCount() == data.length) {
                                    _this.components.bets.updateMatches(_this.components.matches.getMatches()); 
                                    _this.refreshBets(); 
                                }
                            });
                        }
                    }
                }
            }); 
        });
    };
    
    this.refreshBets = () => {   
        exception.try(() => {
            _this.components.bets.progress(true); 

            api.getUserBets((data, err) => {
                _this.components.bets.progress(false); 
                //TODO: handle error 
                if (err) {
                    
                }
                else {
                    if (data && data.length) {
                        for (let n=0; n<data.length; n++) {
                            api.getBetDetails(data[n], (bet) => {
                                _this.components.bets.addOrUpdate(bet); 
                            });
                        }
                    }
                }
            }); 
        });
    };

    this.start = () => {
        _this.refreshMatches();
    }; 

    //layout components collection
    this.components = {
        matches: new MatchesComponent(_this),
        bets: new BetsComponent(_this),
        pnl: new PnlComponent(_this)
    };
}

function showMainScreen() {
    _dataCoordinator.start();
    
    const layout = new GoldenLayout(layoutConfig, $("#mainLayout"));

    const registerComponent = (componentName) => {
        layout.registerComponent(componentName, function (container, componentState) {
            const component = _dataCoordinator.components[componentName]; 
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

    $("#placeBetButton").click(() => {
        const etherValue = parseFloat($("#betAmountText").val()); 
        const winnerIndex = parseInt($("#participantText").val()); 
        const matchId = ($("#betMatchId").val()); 

        api.placeBet(matchId, etherValue, winnerIndex, (data, err) => {
            if (err) {
                
            } else {
                _dataCoordinator.refreshBets(); 
            }
        });
    });
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


$(document).ready(() => {

    startup(() => {
        showMainScreen();
    }); 
});