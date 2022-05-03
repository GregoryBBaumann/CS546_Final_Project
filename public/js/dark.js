const chk = document.getElementById('chk');

chk.addEventListener('change', (event) => {
    event.preventDefault();
    document.body.classList.toggle('dark');
});

// $(function(){
//     var test = localStorage.input === 'true'? true: false;
//     $('input').prop('checked', test || false);
// });

// $('input').on('change', function() {
//     localStorage.input = $(this).is(':checked');
// });

// window.addEventListener("beforeunload", function(event) { 
//     if (this.localStorage.input) {
//         document.body.classList.toggle('dark');
//     }
// })(window.jQuery);

// DO NOT DELETE THIS!!!!!!!!!!!!!!!

(function ($){
    var login = $('#login-form');
    var signup = $('#signup-form');
    var home = $('#home');
    var nav = $('#nav');
    if(login.length || signup.length || home.length) nav.hide();
})(window.jQuery);