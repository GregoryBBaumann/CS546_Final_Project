(function ($){
    var reviewPage = $('#reviewPage');
    var reviewId = $('#reviewid');
    var id = reviewId.text()
    reviewId.hide();

    var reviewReq = {
        method: 'GET',
        url: `/getreview/${id}`
    };

    function makeReview(data, currUser){
        let{title, category, rating, review, postedDate, name, userID, likes, _id, comments} = data;
        title = `<h1>${title}</h1>`;
        category = `<h2>Category: ${category}</h2>`;
        rating = `<h2>Rating: ${rating}</h2>`;
        review = `<h2>Review:</h2><p>${review}</p>`;
        postedDate = `<h3>Posted On: ${postedDate}</h3>`;
        name = `<h3>Posted By: <a href = '/userinfo/${userID}'>${name}</a></h3>`;
        let likeLabel = 'Like';
        if(currUser in likes) likeLabel = 'Unlike'
        likes = `<h3 class='likes'>Likes: ${Object.keys(likes).length}</h3>`;
        like = `<button class='btn like' value='${_id}'>${likeLabel}</button>`;
        cmtIp = `<textarea name="commentinput" id="commentinput" cols="60" rows="2"></textarea>`
        cmt = `<button class='btn comment' value='${_id}'>Comment</button>`;
        cmtDiv = `<div id='comments'>`
        for(let i = comments.length - 1; i > -1; i -= 1){
            let content = comments[i][0];
            let contentPoster = comments[i][1];
            let contentPosterID = comments[i][2];
            let finalContent = `<div id='${contentPosterID}'><h2>${content}<h2></div><div>Posted By: <a href='/userinfo/${contentPosterID}'>${contentPoster}</a></div>`;
            cmtDiv += finalContent;
        }
        cmtDiv += `</div>`;
        return `<div id='${_id}'>${title}${category}${rating}${review}${postedDate}${name}${likes}${like}<br>${cmtIp}${cmt}${cmtDiv}<div>`;
    }

    $.ajax(reviewReq).then(function(res){
        let {data, currUser} = res
        reviewPage.append(makeReview(data, currUser._id));
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
        let newcmt = $('#commentinput');
        let newComment = $('#commentinput').val().trim();
        if(newComment.length != 0){
            var reviewReq = {
                method: 'GET',
                url: `/getreview/${id}`
            };
            $.ajax(reviewReq).then(function(res){
                let {data, currUser} = res;
                data.comments.push([newComment, `${currUser.firstName} ${currUser.lastName}`, `${currUser._id}`]);

                var updateReview = {
                    method: 'POST',
                    url: '/updatereview',
                    data: data
                };
                $.ajax(updateReview).then(function(){
                    let finalContent = `<div id='${currUser._id}'><h2>${newComment}<h2></div><div>Posted By: <a href='/userinfo/${currUser._id}'>${currUser.firstName} ${currUser.lastName}</a></div>`;
                    $('#comments').prepend(finalContent);
                    newcmt.val('');
                })
            })
        }
    })
})(window.jQuery);