(function ($){
    var logInForm = $('#login-form');
    var newPostForm = $('#newPostForm');
    var title = $('#title');
    var cat = $('#cat');
    var rating = $('#rating');
    var review = $('#review');
    var date = new Date().toISOString().split("T")[0].replaceAll("-", "/");
    var feed = $('#feed');

    var userInfo = $('#userInfo');
    var userInfoDiv = $('#userInfoDiv');
    var userInfoID = $('#userID');
    var userBio = $('#userBio');
    var userPosts = $('#userPosts');
    var userBioClick = $('#userBioClick');
    var userPostsClick = $('#userPostsClick');
    var userLikedClick = $('#userLikedClick');
    var editProfileClick = $('#editProfileClick');

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

    if(newPostForm.length){
        populate();
    }

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

    if(userInfo.length){
        userInfoID.hide();
        editProfileClick.hide();
        userBio.hide();
        userPosts.hide();

        let a = userInfoID.text();
        var userInfoReq = {
            method: 'POST',
            url: `/userinfo/${a}`,
        }
        $.ajax(userInfoReq).then(function(res){
            if(res.sameUser === true){
                editProfileClick.show();
            }
            let posts = res.data.userReviews;
            $.each(posts, function(){
                let rev = makeReview(this);
                userPosts.prepend(rev);
            })
        })
    }

    userBioClick.on('click', function(event){
        event.preventDefault();
        userPosts.hide();
        userBio.show();
    })

    userPostsClick.on('click', function(event){
        event.preventDefault();
        userBio.hide();
        userPosts.show();
    })

})(window.jQuery);