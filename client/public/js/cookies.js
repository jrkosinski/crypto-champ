
_cookie = ""; 

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    value = name + "=" + value + expires + "; path=/";
    document.cookie  = value;
    if (!document.cookie.length)
        _cookie = value; 
}

function getCookie(name) {
    var nameEQ = name + "=";
    var value = document.cookie;
    if (!document.cookie.length)
        value = _cookie;
    console.log('document.cookie: ' + value);
    var ca = value.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}


window.cookies = {
    setCookie: setCookie,
    getCookie: getCookie
};