const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
	if (this.localStorage.input) {
        document.body.classList.toggle('dark');
    }
});

$(function(){
    var test = localStorage.input === 'true'? true: false;
    $('input').prop('checked', test || false);
});

$('input').on('change', function() {
    localStorage.input = $(this).is(':checked');
});

// window.addEventListener("beforeunload", function(event) { 
//     if (this.localStorage.input) {
//         document.body.classList.toggle('dark');
//     }
// })(window.jQuery);