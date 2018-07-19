
String.prototype.padRight = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target += paddingChar;
	return target;
};

String.prototype.padLeft = function(totalLen, paddingChar) {
	var target = this;
    if (!paddingChar)
        paddingChar = ' ';
    while(target.length < totalLen)
        target = paddingChar + target;
	return target;
};


function ExceptionHelper() {
    this.try = (callback) => {
        try {
            return callback();
        }
        catch (e) {
            showError(e);
            return null;
        }
    }
}

var exception = new ExceptionHelper();

function showHideProgress(show) {
    if (show)
        $("#progressOverlay").show();
    else
        $("#progressOverlay").hide();
}

function showProgress() {
    showHideProgress(true);
}

function hideProgress() {
    showHideProgress(false);
}

function showForm(id) {
    $(id).css('display', 'initial');
    //$(id).css('margin-top', '0px'); 
    //$(id).show();
}

function hideForm(id) {
    $(id).css('display', 'none');
    //$(id).css('margin-top', '1000px'); 
    //$(id).hide();
}

function hideAllForms() {
    exception.try(() => {
        hideForm('#errorOverlay');
    });
}

function showError(error) {
    console.log(error);
    hideProgress();
    showForm("#errorOverlay");
}

function startup(callback){    
    common.exception.try(() => {
        hideProgress();
        hideAllForms();

        //if auth is enabled, check auth first
        showMainScreen();

        $("#loginButton").click(function () {
            login();
        });

        $("#logoutButton").click(function () {
            logout();
        });

        $("#closeErrorOverlay").click(function () {
            hideForm('#errorOverlay');
        });

        //enter key functionality
        document.onkeydown = function () {
            if (window.event.keyCode == '13') {
                switch (common.showingForm) {
                    case 'login':
                        login();
                        break;
                }
            }
        }
    });
}

function getQuerystring() {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q){
        var i = q.split('=');
        queries[i[0].toString()] = i[1].toString();
    });
    return queries;
}


$(document).ready(function () {
    window.common = {
        exception,
        showHideProgress,
        showProgress,
        hideProgress,
        showForm,
        hideForm,
        hideAllForms,
        showError,
        startup,
        getQuerystring        
    };
}); 