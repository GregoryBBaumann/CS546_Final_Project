(function ($){
    var newPostForm = $('#newPostForm');
    var title = $('#title');
    var cat = $('#cat');
    var rating = $('#rating');
    var review = $('#review');
    var date = new Date().toISOString().split("T")[0].replaceAll("-", "/");
    var feed = $('#feed');


    function makeReview(data, currUser){
        let{title, category, rating, review, postedDate, name, userID, likes, _id} = data;
        title = `<h1><a href = '/review/${_id}'>${title}</a></h1>`;
        category = `<h2>Category: ${category}</h2>`;
        rating = `<h2>Rating: ${rating}</h2>`;
        review = `<h2>Review:</h2><p>${review}</p>`;
        postedDate = `<h3>Posted On: ${postedDate}</h3>`;
        name = `<h3>Posted By: <a href = '/userinfo/${userID}'>${name}</a></h3>`;
        let likeLabel = 'Like';
        if(currUser in likes) likeLabel = 'Unlike'
        likes = `<h3 class='likes'>Likes: ${Object.keys(likes).length}</h3>`;
        like = `<button class='btn like' value='${_id}'>${likeLabel}</button>`;
        cmt = `<button class='btn comment' value='${_id}'>Comment</button>`;
        return `<div id='${_id}'>${title}${category}${rating}${review}${postedDate}${name}${likes}${like}${cmt}<div>`;
    }


    async function addReviews(a){
        var info = {
            method: 'POST',
            url: `/userinfo/${a.userID}`
        };
        await $.ajax(info).then(function(res){
            const {data, currUser} = res;
            if(!(data._id in currUser.blockedUsers) && !(currUser._id in data.blockedUsers)){
                feed.prepend(makeReview(a, currUser._id));
            };
        })
    }

    function populate() {
        var requestConfig = {
            method: 'GET',
            url: '/getallreviews'
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            const {data, userID} = responseMessage;
            $.each(data, function(){
                addReviews(this, userID);
            })
        });
    };

    populate();

    $(document).on('click', 'button.like', function(){
        let id = this.value;
        let parent = $(`#${id}`);
        let likes = parent.find('.likes')[0];
        let currLikes = parseInt(likes.innerHTML.substr(7));
        var reviewReq = {
            method: 'GET',
            url: `/getreview/${id}`
        };
        var btn = this;
        $.ajax(reviewReq).then(function(res){
            let {data, currUser} = res;
            var posterReq = {
                method: 'POST',
                url: `/userinfo/${data.userID}`
            }
            $.ajax(posterReq).then(function(res1){
                // if the user has already liked the post
                let posterInfo = res1.data;
                if(posterInfo._id === currUser._id){
                    posterInfo = currUser;
                }
                //find the corressponding review
                let target;
                for(let i of posterInfo.userReviews){
                    if(i._id === data._id){
                        target = i;
                        break;
                    }
                }
                if(target.likes === undefined) target.likes = {};

                if(currUser._id in data.likes){
                    currLikes -= 1;
                    delete data.likes[currUser._id];
                    delete target.likes[currUser._id];
                    delete currUser.userLikes[data._id];
                    btn.innerHTML = "Like";
                }
                else{
                    currLikes += 1;
                    data.likes[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
                    target.likes[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
                    currUser.userLikes[data._id] = `${data.title}`;
                    btn.innerHTML = "Unlike";
                }
                likes.innerHTML = `Likes: ${currLikes}`;
                var updateReview = {
                    method: 'POST',
                    url: '/updatereview',
                    data: data
                }
                var updateUser = {
                    method: 'POST',
                    url: '/updatefriends',
                    data: currUser
                };
                var updatePoster = {
                    method: 'POST',
                    url: '/updatefriends',
                    data: posterInfo
                };
                console.log(currUser.userLikes);
                console.log(posterInfo.userLikes);
                $.ajax(updateReview).then(function(){})
                $.ajax(updateUser).then(function(resss){
                    console.log(resss);
                })
                $.ajax(updatePoster).then(function(){})
            })
        })
    })

    $(document).on('click', 'button.comment', function(){
        let id = this.value;
        location.href = `/review/${id}`;
    })

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
            likes : new Set([]),
            comments: []
        }
        var postReview = {
            method: 'POST',
            url: '/postreview',
            data: newReview
        }
        $.ajax(postReview).then(function(res){
            newPostForm[0].reset();
            feed.empty();
            populate();
        });
    });

})(window.jQuery);