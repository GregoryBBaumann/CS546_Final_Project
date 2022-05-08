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
        let title = data.title;
        let category = data.category;
        let rating = data.rating;
        let likes = Object.keys(data.likes).length;
        let newItem = $(`<li> title: ${title} &emsp; category: ${category} &emsp; rating: ${rating} &emsp; likes: ${likes} &emsp;</li>`);
        return newItem;
    }

    function setThreadList(data) {
        let title = data.title;
        let likes = Object.keys(data.likes).length;
        let newItem = $(`<li> title: ${title} &emsp; likes: ${likes} &emsp;</li>`);
        return newItem;
    }
})(jQuery);