(function ($) {
    var delBtn = $('#delButton');

    $('#likeButton').click((event) => {
        $('#dislikeButton').text('Dislike');
        if($('#likeButton').text() === 'Like') $('#likeButton').text('Liked');
        else if($('#likeButton').text() === 'Liked') $('#likeButton').text('Like');

        try {
            event.preventDefault();
            var threadId = $('#threadId').text(),
                voting = $('#voting').text();
            
            let likeRequest = {
                method: 'POST',
                url: `/thread/${threadId}/like`
            };

            $.ajax(likeRequest).then(function (res) {
                if(res.voting != voting){
                    $('#voting').text(`Votes: ${res.voting}`)
                }
            });
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

    $('#dislikeButton').click((event) => {
        $('#likeButton').text('Like');
        if($('#dislikeButton').text() === 'Dislike') $('#dislikeButton').text('Disliked');
        else if($('#dislikeButton').text() === 'Disliked') $('#dislikeButton').text('Dislike');
        
        try {
            event.preventDefault();
            var threadId = $('#threadId').text(),
                voting = $('#voting').text();
            
            let likeRequest = {
                method: 'POST',
                url: `/thread/${threadId}/dislike`
            };

            $.ajax(likeRequest).then(function (res) {
                if(res.voting != voting){
                    $('#voting').text(`Votes: ${res.voting}`)
                }
            });
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

    function makeThread(data){
        let {_id, title, postedDate, text, voting, likes, comments} = data;
        $('#threadTitle').text(title);
        $('#threadText').text(text);
        $('#postedOn').text(`Posted On: ${postedDate}`);
        $('#voting').text(`Votes: ${voting}`);
        for(let i = comments.length - 1; i > -1; i -= 1){
            let comment = comments[i].comment;
            let name = comments[i].userName;
            let id = comments[i]._id;
            let userId = comments[i].userId;
            let finalContent = `<div id='${id}'><h2>${comment}</h2><div>Posted By: <a href='/userinfo/${userId}'>${name}</a></div></div>`;
            $('#commentsDiv').append(finalContent);
        }
    }

    var threadID = $('#threadId').text();
    function loadThread(){
        delBtn.hide();
        var getThread = {
            method: 'GET',
            url: `/getThread/${threadID}`
        }
        $.ajax(getThread).then(function(res){
            makeThread(res);
            let {likes} = res
            var getUserInfo = {
                method: 'GET',
                url: '/getinfo'
            }
            $.ajax(getUserInfo).then(function(userData){
                if(userData._id === res.userId) delBtn.show();
                if(!(userData._id in likes)){
                    $('#likeButton').text('Like');
                    $('#dislikeButton').text('Dislike');
                }
                else{
                    if(likes[userData._id] === 1){
                        $('#likeButton').text('Liked');
                        $('#dislikeButton').text('Dislike');
                    }
                    if(likes[userData._id] === -1){
                        $('#likeButton').text('Like');
                        $('#dislikeButton').text('Disliked');
                    }
                }
            })
        })
    }

    loadThread();


    $('#commmentButton').on('click', function(event){
        $('#error').hide();
        event.preventDefault();
        var t = $('#text').val().trim();
        $('#text').val('');
        if(t.length === 0){
            $('#error').show()
            $('#errorLabel').text('Error: Empty comment');
        }
        else{
            $('#error').hide();
            $('#commentsDiv').empty();
            var postComment = {
                method: 'POST',
                url: `/thread/${threadID}/comment`,
                data: {text: t}
            }
            $.ajax(postComment).then(function(res){
                loadThread();
            })
        }
    })

    $(document).on('click', 'button.del', function(){
        let id = threadID;
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
                $(`#${id}`).remove();
            })
        })
    })

})(jQuery);