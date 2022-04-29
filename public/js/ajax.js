(function ($){
    var nav = $('#nav');

    var home = $('#home');
    var logInForm = $('#login-form');
    var signUpForm = $('#signup-form');
    var newPostForm = $('#newPostForm');
    var title = $('#title');
    var cat = $('#cat');
    var rating = $('#rating');
    var review = $('#review');
    var date = new Date().toISOString().split("T")[0].replaceAll("-", "/");
    var feed = $('#feed');
    var reviewComment = $('#reviewComment');
    var reviewList = $('#reviewList');
    var reviewContent = $('#reviewContent');

    if(home.length || logInForm.length || signUpForm.length){
        nav.hide();
    }


    function makeReview(data){
        let{title, category, rating, review, postedDate, vote, name, userID} = data;
        title = `<h1>${title}</h1>`;
        category = `<h2>${category}</h2>`;
        rating = `<h2>${rating}</h2>`;
        review = `<p>${review}</p>`;
        postedDate = `<h3>${postedDate}</h3>`;
        vote = `<h3>${vote}</h3>`;
        name = `<h3><a href = '/userinfo/${userID}'>${name}</h3>`;
        return `<div>${title}${category}${rating}${review}${postedDate}${vote}${name}<div>`;
    }

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

    function populate(){
        var populateFeed = {
            method: 'GET',
            url: '/getallreviews'
        }
        $.ajax(populateFeed).then(function(res){
            $.each(res, function(){
                let rev = makeReview(this);
                feed.prepend(rev);
            })
        })
    }
/*
    if(newPostForm.length){
        populate();
        reviewComment.show();
    }
*/

$(document).on('click', "li a" , function(event) {
    event.preventDefault();
    reviewList.hide();
    reviewContent.show();
    reviewContent.empty();
    reviewComment.show();
    var array = $(this);
    var requestConfig = {
        method: 'GET',
        url: '/getallreviews'
    };
    $.ajax(requestConfig).then(function (responseMessage) {
        for (i in responseMessage) {
           // let title = responseMessage[i].title;
           // if(title === array[0].substring(21)){
                reviewContent.append(
                    '<h1>' + responseMessage[i].title + '</h1>'+
                    '<dt>category</dt>'+
                    '<dd>'+ responseMessage[i].category +'</dd>'+
                    '<dt>rating</dt>'+
                    '<dd>'+ responseMessage[i].rating +'</dd>'+
                    '<dt>review</dt>'+
                    '<dd>'+ responseMessage[i].review +'</dd>'+
                    '</dl>'
                )
           // }
        }
        
    });
});



    newPostForm.submit(function (event){
        event.preventDefault();
        let titleVal = title.val();
        let catVal = cat.val();
        let ratingVal = rating.val();
        let reviewVal = review.val();
        let newReview = {
            title : titleVal,
            category : catVal,
            review : reviewVal,
            postedDate : date,
            rating : ratingVal,
            vote : 0,
            comments: []
        }
        var postReview = {
            method: 'POST',
            url: '/postreview',
            data: newReview
        }
        $.ajax(postReview).then(function(res){
            let postReview = makeReview(res)
            feed.prepend(postReview);
        });
    });

})(window.jQuery);