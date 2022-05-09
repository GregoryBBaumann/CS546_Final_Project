(function ($){
    var userInfo = $('#userInfo');
    var userInfoDiv = $('#userInfoDiv');
    var userName = $('#userName');
    var userInfoID = $('#userID');
    var userBio = $('#userBio');
    var userPosts = $('#userPosts');
    var userThreads = $('#userThreads');
    var userBioClick = $('#userBioClick');
    var userPostsClick = $('#userPostsClick');
    var userThreadsClick = $('#userThreadsClick');
    var userLikedClick = $('#userLikedClick');
    var blockClick = $('#blockClick');
    var friendReqBtn = $('#friendReqBtn');
    var decline = $('#decline');
    var status = $('#status');
    var likedByUser = $('#likedbyuser');

    function makeReview(data, currUser, type){
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
        if(type === undefined || type === null) type = "";
        return `<div id='${_id+type}' class='${_id}'>${title}${category}${rating}${review}${postedDate}${name}${likes}${like}${cmt}${save}${del}<div>`;
    }

    function makeThread(data, currUser){
        let {_id, title, postedDate, text, voting, likes, comments, userId, userName} = data;
        title = `<h1><a href = '/thread/${_id}'>${title}</a></h1>`;
        text = `<h2>${text}</h2>`;
        voting = `<h3>Votes: ${voting}<h3>`;
        postedDate = `<h3>Posted On: ${postedDate}</h3>`;
        userName = `<h3>Posted By: <a href = '/userinfo/${userId}'>${userName}</a></h3>`;
        btn = ""
        if(currUser._id === userId) btn = `<button class='btn delthread' value='${_id}'>Delete</button>`
        return `<div id='${_id}thread'>${title}${text}${voting}${postedDate}${userName}${btn}</div>`;
    }

    $(document).on('click', 'button.delthread', function(){
        let id = this.value;
        var currUserReq = {
            methood: 'GET',
            url: '/getinfo'
        };
        $.ajax(currUserReq).then(function(res){
            let data = {threadID: id, user: res};
            var delReq = {
                method: 'POST',
                url: '/deletethread',
                data: data
            }
            $.ajax(delReq).then(function(res){
                $(`#${id}thread`).remove();
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
                $(`.${id}`).remove();
            })
        })
    })

    function onLoad(){
        userInfoID.hide();
        userBio.hide();
        userPosts.hide();
        userLikedClick.hide();
        decline.hide();
        likedByUser.hide();
        userThreads.hide()
    }

    onLoad();

    let a = userInfoID.text();
    var userInfoReq = {
        method: 'POST',
        url: `/userinfo/${a}`
    };
    $.ajax(userInfoReq).then(function(res){
        let {data, currUser} = res;
        if(data._id === currUser._id){
            blockClick.hide();
            status.hide();
            friendReqBtn.hide();
            userLikedClick.show();
        }

        // block stuff
        if(data._id in currUser.blockedUsers){
            userName.text(`You have blocked ${data.firstName} ${data.lastName}`);
            blockClick.text("Unblock User");
            status.hide();
            friendReqBtn.hide();
            userBioClick.hide();
            userPostsClick.hide();
        }
        else if(currUser._id in data.blockedUsers){
            userName.innerHTML = "User Not Found";
            status.show();
            friendReqBtn.show();
            userBioClick.show();
            userPostsClick.show();
        }

        else{
        // friend stuff
            if(!(data._id in currUser.friends) && !(data._id in currUser.friendReqSent) && !(data._id in currUser.friendReq)){
                status.text(`Add ${data.firstName} ${data.lastName} as a friend to see the posts liked by them`);
                friendReqBtn.html("Add Friend");
            }
            else if(data._id in currUser.friends){
                status.text(`You are friends with ${data.firstName} ${data.lastName}`);
                userLikedClick.show();
                friendReqBtn.html("Unfriend");
            }
            else if(data._id in currUser.friendReqSent){
                status.text(`Friend request sent to ${data.firstName} ${data.lastName}`);
                friendReqBtn.html("Pending");
            }
            else if(data._id in currUser.friendReq){
                status.text(`${data.firstName} ${data.lastName} wants to be your friend`);
                friendReqBtn.html("Accept");
                decline.show();
            }
        }

        decline.on('click', function(){
            status.text(`Add ${data.firstName} ${data.lastName} as a friend to see the posts liked by them`);
            friendReqBtn.html("Add Friend");
            decline.hide();
            delete currUser.friendReq[data._id];
            delete data.friendReqSent[currUser._id];
            var friendPOST = {
                method: 'POST',
                url: '/updatefriends',
                data: currUser
            };
            var friend2POST = {
                method: 'POST',
                url: '/updatefriends',
                data: data
            };
            $.ajax(friendPOST).then(function(){
                $.ajax(friend2POST).then(function(){
                })
            })
        })

        friendReqBtn.on('click', function(event){
            if(data._id in currUser.friends || data._id in currUser.friendReqSent){
                if(data._id in currUser.friends){
                    delete currUser.friends[data._id];
                    delete data.friends[currUser._id];
                }
                if(data._id in currUser.friendReqSent){
                    delete currUser.friendReqSent[data._id];
                    delete data.friendReq[currUser._id];
                }
                status.text(`Add ${data.firstName} ${data.lastName} as a friend to see the posts liked by them`);
                this.innerHTML = "Add Friend";
                userLikedClick.hide();
            }
            else if(data._id in currUser.friendReq){
                delete currUser.friendReq[data._id];
                delete data.friendReqSent[currUser._id];
                currUser.friends[data._id] = `${data.firstName} ${data.lastName}`;
                data.friends[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
                status.text(`You are friends with ${data.firstName} ${data.lastName}`);
                this.innerHTML = "Unfriend";
                decline.hide();
                userLikedClick.show();
            }
            else if(!(data._id in currUser.friends) && !(data._id in currUser.friendReqSent) && !(data._id in currUser.friendReq)){
                currUser.friendReqSent[data._id] = `${data.firstName} ${data.lastName}`;
                data.friendReq[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
                status.text(`Friend request sent to ${data.firstName} ${data.lastName}`);
                this.innerHTML = "Pending";
            }

            var friendPOST = {
                method: 'POST',
                url: '/updatefriends',
                data: currUser
            };
            var friend2POST = {
                method: 'POST',
                url: '/updatefriends',
                data: data
            };
            $.ajax(friendPOST).then(function(){
                $.ajax(friend2POST).then(function(){
                })
            })
        })

        // block user
        blockClick.on('click', function(event){
            event.preventDefault();
            onLoad();
            userLikedClick.hide();
            likedByUser.hide();
            let flag = 0;
            if(!(data._id in currUser.blockedUsers)){
                // remove likes and content of the blockees
                let blocks = {
                    currUser: currUser,
                    blockedUser: data
                }
                var updateBlock = {
                    method: 'POST',
                    url: '/blockUpdates',
                    data: blocks
                }
                $.ajax(updateBlock).then(function(res){
                })

                flag = 1;
                if(data._id in currUser.friendReqSent){
                    delete currUser.friendReqSent[data._id];
                    delete data.friendReq[currUser._id];
                }
                if(data._id in currUser.friendReq){
                    delete currUser.friendReq[data._id];
                    delete data.friendReqSent[currUser._id];
                }
                if(data._id in currUser.friends){
                    delete currUser.friends[data._id];
                    delete data.friends[currUser._id];
                }
                currUser.blockedUsers[data._id] = `${data.firstName} ${data.lastName}`;
                this.innerHTML = "Unblock User";
                userName.text(`You have blocked ${data.firstName} ${data.lastName}`);
                blockClick.text("Unblock User");
                decline.hide();
                status.hide();
                friendReqBtn.hide();
                userBioClick.hide();
                userPostsClick.hide();
                userThreadsClick.hide();
            }
            else if(data._id in currUser.blockedUsers){
                delete currUser.blockedUsers[data._id];
                this.innerHTML = "Block User";
                userName.text(`${data.firstName} ${data.lastName}`);
                status.text(`Add ${data.firstName} ${data.lastName} as a friend to see the posts liked by them`);
                friendReqBtn.text("Add Friend");
                status.show();
                friendReqBtn.show();
                userBioClick.show();
                userPostsClick.show();
                userThreadsClick.show();
            }

            var updateBlock = {
                method: 'POST',
                url: '/updatefriends',
                data: currUser
            };
            var updateBlock2 = {
                method: 'POST',
                url: '/updatefriends',
                data: data
            };
            $.ajax(updateBlock).then(function(){
                if(flag == 1){
                    $.ajax(updateBlock2).then(function(){

                    })
                }
            })
        })

        let posts = res.data.userReviews;
        let postKeys = Object.keys(posts);
        $.each(postKeys, function(){
            var getRev = {
                method: 'GET',
                url: `/getreview/${this}`
            };
            $.ajax(getRev).then(function(resReview){
                let {data, currUser} = resReview;
                let rev = makeReview(data, currUser);
                userPosts.prepend(rev);
            })
        })

        let likes = res.data.userLikes;
        let keys = Object.keys(likes);
        $.each(keys, function(){
            var getRev = {
                method: 'GET',
                url: `/getreview/${this}`
            };
            $.ajax(getRev).then(function(resReview){
                let {data, currUser} = resReview;
                let rev = makeReview(data, currUser, "like");
                likedByUser.prepend(rev);
            })
        })

        let threadKeys = Object.keys(res.data.userThreads);
        $.each(threadKeys, function(){
            var getThread = {
                method: 'GET',
                url: `/getThread/${this}`
            }
            $.ajax(getThread).then(function(thread){
                let dispThread = makeThread(thread, res.currUser);
                userThreads.prepend(dispThread);
            })
        })
    })

    userBioClick.on('click', function(event){
        event.preventDefault();
        userPosts.hide();
        likedByUser.hide();
        userThreads.hide();
        userBio.show();
    })

    userPostsClick.on('click', function(event){
        event.preventDefault();
        userBio.hide();
        likedByUser.hide();
        userThreads.hide();
        userPosts.show();
    })

    userLikedClick.on('click', function(event){
        event.preventDefault();
        userBio.hide();
        userPosts.hide();
        userThreads.hide();
        likedByUser.show();
    })

    userThreadsClick.on('click', function(event){
        event.preventDefault();
        userBio.hide();
        userPosts.hide();
        likedByUser.hide();
        userThreads.show();
    })
})(window.jQuery);