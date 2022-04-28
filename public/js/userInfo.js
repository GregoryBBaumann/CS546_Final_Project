(function ($){
    var userInfo = $('#userInfo');
    var userInfoDiv = $('#userInfoDiv');
    var userInfoID = $('#userID');
    var userBio = $('#userBio');
    var userPosts = $('#userPosts');
    var userBioClick = $('#userBioClick');
    var userPostsClick = $('#userPostsClick');
    var userLikedClick = $('#userLikedClick');
    var friendReqBtn = $('#friendReqBtn');

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

    if(userInfo.length){
        userInfoID.hide();
        userBio.hide();
        userPosts.hide();
        userLikedClick.hide();

        let a = userInfoID.text();
        var userInfoReq = {
            method: 'POST',
            url: `/userinfo/${a}`
        };
        $.ajax(userInfoReq).then(function(res){
            let {data, currUser} = res;
            if(data._id === currUser._id){
                friendReqBtn.hide();
                userLikedClick.show();
            }

            // friend stuff
            if(!(data._id in currUser.friends) && !(data._id in currUser.friendReqSent) && !(data._id in currUser.friendReq)){
                friendReqBtn.html("Add Friend");
            }
            else if(data._id in currUser.friends){
                userLikedClick.show();
                friendReqBtn.html("Friends");
            }
            else if(data._id in currUser.friendReqSent){
                friendReqBtn.html("Pending");
            }
            else if(data._id in currUser.friendReq){
                friendReqBtn.html("Accept");
            }

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
                    this.innerHTML = "Add Friend";
                }
                else if(data._id in currUser.friendReq){
                    delete currUser.friendReq[data._id];
                    delete data.friendReqSent[currUser._id];
                    currUser.friends[data._id] = `${data.firstName} ${data.lastName}`;
                    data.friends[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
                    this.innerHTML = "Friends";
                    userLikedClick.show();
                }
                else if(!(data._id in currUser.friends) && !(data._id in currUser.friendReqSent) && !(data._id in currUser.friendReq)){
                    currUser.friendReqSent[data._id] = `${data.firstName} ${data.lastName}`;
                    data.friendReq[currUser._id] = `${currUser.firstName} ${currUser.lastName}`;
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