(function ($) {
    $('#commentForm').submit((event) => {
        try {
            event.preventDefault();
            if ($('#commentInput').val().trim()) {
                let postId = $('#commentId').val();
                let comment = $('#commentInput').val();
                let newComment = {
                    postId: postId,
                    comment: comment
                }

                let commentRequest = {
                    method: 'POST',
                    url: '/review/newComment',
                    data: newComment
                };

                $.ajax(commentRequest).then(function (responseMessage) {
                    let response = $(responseMessage);
                    let status = response[0].status;
                    if (status === 'ok') {
                        window.location.href = '/review/' + postId;
                    } else {
                        $('#errorMsg').text("Fail to create comment.");
                    }
                });
            } else {
                $('#errorMsg').text("Please input comment");
            }
        } catch (error) {
            console.log("Error: " + error)
        }
    });
})(jQuery);