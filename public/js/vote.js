(function ($) {
    $('#likeButton').click((event) => {
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
            let finalContent = `<div id='${id}'><h2>${comment}</h2><div>Posted By: <a href='/userinfo/${userId}>${name}</a></div></div>`;
            $('#commentsDiv').append(finalContent);
        }
    }

    var threadID = $('#threadId').text();
    function loadThread(){
        var getThread = {
            method: 'GET',
            url: `/getThread/${threadID}`
        }
        $.ajax(getThread).then(function(res){
            makeThread(res);
        })
    }

    loadThread();


    $('#commmentButton').on('click', function(event){
        event.preventDefault();
        $('#commentsDiv').empty();
        var t = $('#text').val();
        $('#text').val('');
        var postComment = {
            method: 'POST',
            url: `/thread/${threadID}/comment`,
            data: {text: t}
        }
        $.ajax(postComment).then(function(res){
            loadThread();
        })
    })

})(jQuery);