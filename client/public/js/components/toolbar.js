
function Toolbar(elements) {
    const _elements = elements; 

    this.render = () => {
        return exception.try(() => {
            let output = ''; 
    
            for (let n=0; n<_elements.length; n++) {
                if (_elements[n].html) 
                    output += _elements[n].html; 
    
                else if (_elements[n].menu) {
                    output += `<img id='${_elements[n].id}' src='images/${_elements[n].type}.png' class='toolbar-img menu-opener'/> `;
                    output += `<div class='dropdown' style='float:left; margin-right:5;'>`;
                    output += `<div id='${_elements[n].id}-menu' class='dropdown-content'>`;
    
                    for (let i=0; i<_elements[n].menu.length; i++) {
                        let item = _elements[n].menu[i];
                        output += `<a href='#' class='small-gold-text' id='${_elements[n].id}-${item.id}'>${item.text}</a><br/>`;
                    }
                    output += `</div></div>`;
                }
    
                else 
                    output += `<img id='${_elements[n].id}' src='images/${_elements[n].type}.png' class='toolbar-img'/> `;
            }
    
            return output; 
        });
    };

    this.wireEvents = () => {
        exception.try(() => {

            for (let n=0; n<_elements.length; n++) {
                if (_elements[n].onClick) {

                    $('#' + _elements[n].id).click(() => {
                        _elements[n].onClick(); 
                    });
                }

                if (_elements[n].menu) {
                    const id = _elements[n].id + "-menu"; 

                    $('#' + _elements[n].id).click(() => {
                        const id = _elements[n].id + "-menu"; 
                        $("#" + id).toggle();
        
                        window.onclick = (event) => {
                            //alert(JSON.stringify(event.target.classList));
                            if (!event.target.matches('.menu-opener')) {
                                $("#" + id).hide();
                            }
                        }; 
                    });

                    for (let i=0; i<_elements[n].menu.length; i++) {
                        let item = _elements[n].menu[i];
                        const itemId = `${_elements[n].id}-${item.id}`;
                        $("#" + itemId).click(() => {
                            item.onClick(); 
                            $("#" + id).hide(); 
                        }); 
                    }
                }
            }
        });
    };

    this.setMenuItemText = (index, text) => {
        exception.try(() => {
            
            for (let n=0; n<_elements.length; n++) {
                if (_elements[n].menu) {
                    const item =_elements[n].menu[index]; 
                    if (item) {
                        const itemId = `${_elements[n].id}-${item.id}`;
                        $("#"+itemId).text(text); 
                    }
                }
            }
        });
    }; 
}
