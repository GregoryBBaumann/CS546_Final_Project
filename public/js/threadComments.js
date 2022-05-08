
(function ($){
    var threadId = $('#threadId').text(),
        commentForum = $('#postComment'),
        commentList = $('#commentsLists');

    commentForum.submit(function (event) {
        event.preventDefault();
        var text = $('#text').val();
        if(text){
            var postComment = {
                method: 'POST',
                url: `/thread/${threadId}/comment`,
                data: {text: text}
            }
            $.ajax(postComment).then(function (res) {
                commentList.append(
                    `<li>
                        <h6>${res.userName}</h6>
                        <p>${res.comment}</p>
                    </li>`
                );
                $('#text').val("");
            })
        } else {

        }
    })
    
    
})(window.jQuery);