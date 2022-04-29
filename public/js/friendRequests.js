(function ($){
    var userInfoID = $('#userID');
    var userID = userInfoID.text();
    var displayReq = $('#displayReq');
    userInfoID.hide();

    function update(currUser, otherUserID, action){
        var getOtherUser = {
            method: 'POST',
            url: `/userinfo/${otherUserID}`
        };
        $.ajax(getOtherUser).then(function(res){
            let otherUser = res.data;
            let name = otherUser.friendReqSent[userID];
            delete otherUser.friendReqSent[userID];
            if(action === 'accept'){
                otherUser.friends[userID] = name;
            }
            var friendPOST = {
                method: 'POST',
                url: '/updatefriends',
                data: currUser
            };
            var friend2POST = {
                method: 'POST',
                url: '/updatefriends',
                data: otherUser
            };
            $.ajax(friendPOST).then(function(){
                $.ajax(friend2POST).then(function(){
                })
            })
        })
    }


    var getUserInfo = {
        method: 'POST',
        url: `/userinfo/${userID}`
    }
    $.ajax(getUserInfo).then(function(res){
        let fr = res.data.friendReq;
        let f = Object.keys(fr);
        let name, id, elem;
        $.each(f, function(){
            name = fr[this];
            id = this;
            elem = `<tr id='${id}'><td><a href='/userinfo/${id}'>${name}</a></td><td><button class='btn accept' value='${id}'>Accept</button></td><td><button class='btn decline' value='${id}'>Decline</button></td><tr>`;
            displayReq.append(elem);
        })

        $('button.accept').on('click', function(){
            id = this.value;
            name = res.data.friendReq[id]
            res.data.friends[id] = name;
            delete res.data.friendReq[id];
            $(`#${id}`).remove();
            update(res.data, id, 'accept');
        })

        $('button.decline').on('click', function(){
            id = this.value;
            delete res.data.friendReq[id];
            $(`#${id}`).remove();
            update(res.data, id, 'decline');
        })
    })
    
})(window.jQuery);