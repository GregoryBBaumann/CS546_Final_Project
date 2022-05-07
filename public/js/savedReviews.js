(function ($){
    var savedReviewsDiv = $('#savedreviews');

    function makeReview(data, currUser){
        let{title, category, rating, review, postedDate, name, userID, likes, _id} = data;
        title = `<h1><a href = '/review/${_id}'>${title}</a></h1>`;
        category = `<h2>Category: ${category}</h2>`;
        rating = `<h2>Rating: ${rating}</h2>`;
        review = `<h2>Review:</h2><p>${review}</p>`;
        postedDate = `<h3>Posted On: ${postedDate}</h3>`;
        name = `<h3>Posted By: <a href = '/userinfo/${userID}'>${name}</a></h3>`;
        let likeLabel = 'Like';
        if(currUser._id in likes) likeLabel = 'Unlike'
        likes = `<h3 class='likes'>Likes: ${Object.keys(likes).length}</h3>`;
        like = `<button class='btn like' value='${_id}'>${likeLabel}</button>`;
        cmt = `<button class='btn comment' value='${_id}'>Comment</button>`;
        let saveLabel = 'Save';
        if(_id in currUser.savedReviews) saveLabel = 'Unsave'
        save = `<button class='btn save' value='${_id}'>${saveLabel}</button>`;
        return `<div id='${_id}'>${title}${category}${rating}${review}${postedDate}${name}${likes}${like}${cmt}${save}<div>`;
    }

    var currUserReq = {
        methood: 'GET',
        url: '/getinfo'
    };
    $.ajax(currUserReq).then(function(res){
        const saved = res.savedReviews;
        const keys = Object.keys(saved);
        $.each(keys, function(){
            var getRev = {
                method: 'GET',
                url: `/getreview/${this}`
            };
            $.ajax(getRev).then(function(resReview){
                let {data, currUser} = resReview;
                let rev = makeReview(data, currUser);
                savedReviewsDiv.prepend(rev);
            })
        })
    })

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
            // if the user has already liked the post
            if(currUser._id in data.likes){
                currLikes -= 1;
                delete data.likes[currUser._id];
                delete currUser.userLikes[data._id];
                btn.innerHTML = "Like";
            }
            else{
                currLikes += 1;
                data.likes[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
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
            $.ajax(updateReview).then(function(){})
            $.ajax(updateUser).then(function(){})
        })
    })

    $(document).on('click', 'button.comment', function(){
        let id = this.value;
        location.href = `/review/${id}`;
    })

    $(document).on('click', 'button.save', function(){
        let id = this.value;
        var currUserReq = {
            methood: 'GET',
            url: '/getinfo'
        };
        $.ajax(currUserReq).then(function(res){
            let {savedReviews} = res;
            delete savedReviews[id];
            var updateUser = {
                method: 'POST',
                url: '/updatefriends',
                data: res
            };
            $.ajax(updateUser).then(function(){
                $(`#${id}`).remove();
            })
        })
    })
})(window.jQuery);