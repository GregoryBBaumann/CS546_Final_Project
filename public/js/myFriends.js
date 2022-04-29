(function ($){
    var userInfoID = $('#userID');
    var userID = userInfoID.text();
    var displayFriends = $('#displayFriends');
    userInfoID.hide();

    function unfriend(currUser, otherUserID){
        var getOtherUser = {
            method: 'POST',
            url: `/userinfo/${otherUserID}`
        };
        $.ajax(getOtherUser).then(function(res){
            let otherUser = res.data;
            delete otherUser.friends[currUser._id];
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
        let friends = res.data.friends;
        let f = Object.keys(friends);
        let name, id, elem;
        $.each(f, function(){
            id = this;
            name = friends[id];
            elem = `<tr id='${id}'><td><a href='/userinfo/${id}'>${name}</a><td><td><button class='btn unfriend' value='${id}'>Unfriend</button><td><tr>`;
            displayFriends.append(elem);
        })
        $('button.unfriend').on('click', function(){
            id = this.value;
            delete res.data.friends[id];
            $(`#${id}`).remove();
            unfriend(res.data, id);
        })
    })

})(window.jQuery);