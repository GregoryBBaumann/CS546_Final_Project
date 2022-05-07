const chk = document.getElementById('chk');
let change = true;
let start = false;

chk.addEventListener('change', () => {
    event.preventDefault();
    start = true;
    if(localStorage["bool"] == "true") {
        document.body.classList.toggle('dark');
        document.h1.classList.toggle('dark');
        localStorage["bool"]  = null;
        localStorage["theme"] = null;
    } else {
        localStorage["theme"] = "isdark";
        document.body.classList.toggle('dark');
        document.h1.classList.toggle('dark');
        localStorage["bool"] = "true"

    }
});

$(function(){
    if(localStorage["theme"] == "isdark") {
        document.body.classList.toggle('dark');
        document.h1.classList.toggle('dark');
        chk.checked = true;
    } else {
        chk.checked = false;
    }
});

// DO NOT DELETE THIS!!!!!!!!!!!!!!!

(function ($){
    var login = $('#login-form');
    var signup = $('#signup-form');
    var home = $('#home');
    var nav = $('#nav');
    if(login.length || signup.length || home.length) nav.hide();
})(window.jQuery);