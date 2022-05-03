(function ($) {
    $('#like').submit((event) => {
        try {
            event.preventDefault()
            let reviewId = $('#likeId').val();
            let newLike = {
                reviewId: reviewId
            }

            let likeRequest = {
                method: 'POST',
                url: '/review/like',
                data: newLike
            };

            $.ajax(likeRequest).then(function (responseMessage) {
                let response = $(responseMessage);
                let status = response[0].status;
                if (status === 'ok') { 
                    window.location.href = '/review/' + reviewId;
                } else {
                    return res.status(400).json({error: "Fail to create"});
                }
            });
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

    $('#dislike').submit((event) => {
        try {
            event.preventDefault();
            let reviewId = $('#dislikeId').val();
            let newDisike = {
                reviewId: reviewId
            }
            let likeRequest = {
                method: 'POST',
                url: '/review/dislike',
                data: newDisike
            };

            $.ajax(likeRequest).then(function (responseMessage) {
                let response = $(responseMessage);
                let status = response[0].status;
                if (status === 'removed') { 
                    window.location.href = '/review/' + reviewId;
                } else {
                    return res.status(400).json({error: "Fail to delete"});
                }
            });
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

})(jQuery);