(function ($){
    var userInfoID = $('#userID');
    var userID = userInfoID.text();
    var friendRequests = $('#friendRequests');
    userInfoID.hide();


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
            elem = `<div class='${id}'><a href='/userinfo/${id}'>${name} </a><div>`;
            friendRequests.prepend(elem);
        })
    })
})(window.jQuery);