(function ($){
    var forumButton = $('#forumButton');
    var title = $('#title');
    var text = $('#text');

    forumButton.on('click', function(event){
        event.preventDefault();
        title.val('');
        text.val('');
    })
})(window.jQuery);