(function ($){
    var table = $('#displayBlocked');

    var info = {
        method: 'GET',
        url: '/getinfo'
    }

    function update(info){
        var user = {
            method: `POST`,
            url: `/updatefriends`,
            data: info
        }
        $.ajax(user).then(function(){
            
        })
    }

    $.ajax(info).then(function(res){
        let {blockedUsers} = res;
        let users = Object.keys(blockedUsers);
        let name, id, elem;
        $.each(users, function(){
            name = blockedUsers[this];
            id = this;
            elem = `<tr id='${id}'><td><a href='/userinfo/${id}'>${name}</a></td><td><button class='btn unblock' value='${id}'>Unblock</button></td><tr>`;
            table.prepend(elem);
        })
        $('button.unblock').on('click', function(){
            id = this.value;
            delete res.blockedUsers[id];
            $(`#${id}`).remove();
            update(res);
        })
    })

})(window.jQuery);