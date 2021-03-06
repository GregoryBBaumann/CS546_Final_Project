(function ($) {
    let requestConfig = {
        method: 'GET',
        url: '/popularData'
    };
    $.ajax(requestConfig).then(function (responseMessage) {
        let response = $(responseMessage);
        let popularReviews = response[0].data.popularReviews;
        let popularThreads = response[0].data.popularThreads;
        for (let i = 0; i < popularReviews.length; i++) {
            let newReview = setReviewList(popularReviews[i]);
            $('#popularRev').append(newReview);
        }
        for (let i = 0; i < popularThreads.length; i++) {
            let newThreads = setThreadList(popularThreads[i]);
            $('#popularThr').append(newThreads);
        }
    });

    function setReviewList(data) {
        let id = data._id;
        let title = data.title;
        let category = data.category;
        let rating = data.rating;
        let likes = Object.keys(data.likes).length;
        let newItem = $(`<li> title: ${title} &emsp; category: ${category} &emsp; rating: ${rating} &emsp; likes: ${likes} &emsp; <a href='/review/${id}'>View Review</a></li>`);
        return newItem;
    }

    function setThreadList(data) {
        let id = data._id;
        let title = data.title;
        let likes = data.voting;
        let newItem = $(`<li> title: ${title} &emsp; votes: ${likes} &emsp; <a href='/thread/${id}'>View Thread</a></li>`);
        return newItem;
    }
})(jQuery);