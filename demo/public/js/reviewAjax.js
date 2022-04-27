(function ($) {
    var 
        reviewList = $('#reviewList'),
        review = $('#review'),
        homeLink = $('#homeLink');
        reviewComment = $('#reviewComment')

    $(function () {
        var requestConfig = {
            method: 'GET',
            url: '/getallreviews'
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            for (i in responseMessage) {
                let title = responseMessage[i].title;
                reviewList.append('<li><a href=' + title + '>' + title + '</a></li>');
            }
        });
    });

    $(document).on('click', "li a" , function(event) {
        event.preventDefault();
        reviewList.hide();
        review.show();
        review.empty();
        homeLink.show();
        reviewComment.show();
        var array = $(this);
        var requestConfig = {
            method: 'GET',
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            review.append(
                '<h1>' + responseMessage.title + '</h1>'+
                '<dt>category</dt>'+
                '<dd>'+ responseMessage.category +'</dd>'+
                '<dt>Rating</dt>'+
                '<dd>'+ responseMessage.rating +'</dd>'+
                '<dt>review</dt>'+
                '<dd>'+ responseMessage.review +'</dd>'+
                '</dl>'
            )
        });
    });
})(window.jQuery);