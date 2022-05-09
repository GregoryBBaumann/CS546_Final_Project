function checkStr(str, name){
    if(str === null || str === undefined) throw `${name} not provided`;
    if(typeof str !== 'string') throw `${name} is not a string`;
    str = str.trim();
    if(str.length === 0) throw `${name} is empty`;
    return str;
}

(function ($){
    var newPostForm = $('#newPostForm');
    var title = $('#title');
    var cat = $('#cat');
    var rating = $('#rating');
    var review = $('#review');
    var date = new Date().toISOString().split("T")[0].replaceAll("-", "/");
    var feed = $('#feed');
    var error = $('#error');
    var errorLabel = $('#errorlabel');
    error.hide();
    var searchForum = $('#searchThread'),
        searchresult = $('#searchResult');

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
        let del = "";
        if(userID === currUser._id) del = `<button class='btn del' value='${_id}'>Delete</button>`
        return `<div id='${_id}'>${title}${category}${rating}${review}${postedDate}${name}${likes}${like}${cmt}${save}${del}<div>`;
    }


    async function addReviews(a){
        var info = {
            method: 'POST',
            url: `/userinfo/${a.userID}`
        };
        await $.ajax(info).then(function(res){
            const {data, currUser} = res;
            if(!(data._id in currUser.blockedUsers) && !(currUser._id in data.blockedUsers)){
                feed.prepend(makeReview(a, currUser));
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
        var btn = this;
        $.ajax(currUserReq).then(function(res){
            let {savedReviews} = res;
            // if the review is already saved
            if(id in savedReviews){
                delete savedReviews[id];
                btn.innerHTML = 'Save';
            }
            else{
                savedReviews[id] = res._id;
                btn.innerHTML = 'Unsave';
            }
            var updateUser = {
                method: 'POST',
                url: '/updatefriends',
                data: res
            };
            $.ajax(updateUser).then(function(){})
        })
    })

    $(document).on('click', 'button.del', function(){
        let id = this.value;
        var currUserReq = {
            methood: 'GET',
            url: '/getinfo'
        };
        $.ajax(currUserReq).then(function(res){
            let data = {postID: id, user: res};
            var delReq = {
                method: 'POST',
                url: '/deletepost',
                data: data
            }
            $.ajax(delReq).then(function(res){
                $(`#${id}`).remove();
            })
        })
    })

    newPostForm.submit(function (event){
        event.preventDefault();
        error.hide();
        let titleVal = title.val().trim();
        let catVal = cat.val().trim();
        let ratingVal = rating.val().trim();
        let reviewVal = review.val().trim();
        if(titleVal.length === 0){
            error.show();
            errorLabel.text("Error: Title is empty");
        }
        else if(catVal.length === 0){
            error.show();
            errorLabel.text("Error: Category is empty");
        }
        else if(ratingVal.length === 0){
            error.show();
            errorLabel.text("Error: Rating is empty");
        }
        else if(reviewVal.length === 0){
            error.show();
            errorLabel.text("Error: Review is empty");
        }
        else if(parseFloat(ratingVal) < 0){
            error.show();
            errorLabel.text("Error: Rating is less than 0");
        }
        else if(parseFloat(ratingVal) > 5){
            error.show();
            errorLabel.text("Error: Rating is greater than 5");
        }
        else{
            error.hide();
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
            })
        }
    });

    searchForum.submit(function (event) {
        event.preventDefault();
        try {
            var text = $('#searchText').val();
            checkStr(text,"Search text")
            text = text.trim();
            var searchThread = {
                method: 'POST',
                url: `/review/search`,
                data: {text: text}
            }
            $.ajax(searchThread).then(function (res) {
                searchresult.show();
                if(res.error){
                    searchresult.html(
                        `<p>
                            No review found matching "${text}"
                        </p>`
                    );
                }else{
                    searchresult.html(
                        `<div>
                            <a href="/review/${res.threadId}">${res.threadTitle}</a>
                        </div>`
                    );
                }
                $('#searchText').val("");
            })
        } catch (error) {
            searchresult.show();
            searchresult.html(
                `<p>
                    ${error}
                </p>`
            );
            $('#searchText').val("");
        }
})

})(window.jQuery);