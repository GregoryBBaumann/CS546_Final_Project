(function ($){
    var userInfo = $('#userInfo');
    var userInfoDiv = $('#userInfoDiv');
    var userName = $('#userName');
    var userInfoID = $('#userID');
    var userBio = $('#userBio');
    var userPosts = $('#userPosts');
    var userBioClick = $('#userBioClick');
    var userPostsClick = $('#userPostsClick');
    var userLikedClick = $('#userLikedClick');
    var blockClick = $('#blockClick');
    var friendReqBtn = $('#friendReqBtn');
    var decline = $('#decline');
    var status = $('#status');

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

    function onLoad(){
        userInfoID.hide();
        userBio.hide();
        userPosts.hide();
        userLikedClick.hide();
        decline.hide();
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
            let flag = 0;
            if(!(data._id in currUser.blockedUsers)){
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
        $.each(posts, function(){
            let rev = makeReview(this);
            userPosts.prepend(rev);
        })
    })

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