'use strict'; 

function ComponentBase(dataCoordinator) {
    const _this = this; 

    this.dataCoordinator = dataCoordinator;
    this.toolbar = null; 
    this.container = null; 

    this.update = (data) => { };
    
    this.render = () => { };

    /**
     * called on document.ready, to wire up events & any other initialization 
     */
    this.initialize = () => { 
        setTimeout(() => {
            if (_this.toolbar)
                _this.toolbar.wireEvents();
        }, 3000);
    };
}

