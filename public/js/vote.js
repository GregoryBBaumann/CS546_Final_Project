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
                    $('#voting').text(`${res.voting}`)
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
                    $('#voting').text(`${res.voting}`)
                }
            });
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

})(jQuery);