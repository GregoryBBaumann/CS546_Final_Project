(function ($) {
    var 
        threadsList = $('#threadsList'),
        threads = $('#threads'),
        homeLink = $('#homeLink');
        threadsComment = $('#threadsComment')

    $(function () {
        var requestConfig = {
            method: 'GET',
            url: '/getallthreads'
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            for (i in responseMessage) {
                let title = responseMessage[i].title;
                threadsList.append('<li><a href=' + title + '>' + title + '</a></li>');
            }
        });
    });

    $(document).on('click', "li a" , function(event) {
        event.preventDefault();
        threadsList.hide();
        threads.show();
        threads.empty();
        homeLink.show();
        threadsComment.show();
        var array = $(this);
        var requestConfig = {
            method: 'GET',
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            threads.append(
                '<h1>' + responseMessage.title + '</h1>'+
                '<dt>threads</dt>'+
                '<dd>'+ responseMessage.threads +'</dd>'+
                '</dl>'
            )
        });
    });
})(window.jQuery);