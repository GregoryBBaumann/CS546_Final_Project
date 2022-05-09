function checkStr(str, name){
    if(str === null || str === undefined) throw `${name} not provided`;
    if(typeof str !== 'string') throw `${name} is not a string`;
    str = str.trim();
    if(str.length === 0) throw `${name} is empty`;
    return str;
}

(function ($){
    var forumButton = $('#forumButton');
    var title = $('#title');
    var text = $('#text');
    var threadList = $('#threadList');

    function makeThread(data, currUser){
        let {_id, title, postedDate, text, voting, likes, comments, userId, userName} = data;
        title = `<h1><a href = '/thread/${_id}'>${title}</a></h1>`;
        text = `<h2>${text}</h2>`;
        voting = `<h3>Votes: ${voting}<h3>`;
        postedDate = `<h3>Posted On: ${postedDate}</h3>`;
        userName = `<h3>Posted By: <a href = '/userinfo/${userId}'>${userName}</a></h3>`;
        btn = ""
        if(currUser._id === userId) btn = `<button class='btn del' value='${_id}'>Delete</button>`
        return `<div id='${_id}'>${title}${text}${voting}${postedDate}${userName}${btn}</div>`;
    }

    function onLoad(){
        $('#error').hide();
        var getCurrUser = {
            method: 'GET',
            url: '/getinfo'
        };
        $.ajax(getCurrUser).then(function(currUser){
            var getThreads = {
                method: 'GET',
                url: '/allthreads'
            };
            $.ajax(getThreads).then(function(res){
                $.each(res, function(){
                    let result = makeThread(this, currUser);
                    threadList.prepend(result);
                })
            })
        })
    }

    onLoad();

    forumButton.on('click', function(event){
        event.preventDefault();
        titleVal = title.val().trim();
        textVal = text.val().trim();
        $('#error').hide();

        if(titleVal.length === 0 || textVal.length === 0){
            $('#error').show();
            if(titleVal.length === 0) $('#errorLabel').text('Title is empty');
            if(textVal.length === 0) $('#errorLabel').text('Content is empty');
        }
        else{
            $('#error').hide();
            let data = {
                title: titleVal,
                text: textVal
            }
            var postThread = {
                method: 'POST',
                url: '/threads',
                data: data
            }
            $.ajax(postThread).then(function(res){
                threadList.empty();
                onLoad();
                title.val('');
                text.val('');
            })
        }
    })

    $(document).on('click', 'button.del', function(){
        let id = this.value;
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

    var searchForum = $('#searchThread'),
        result = $('#searchResult');

    searchForum.submit(function (event) {
        event.preventDefault();
        try {
            var searchText = $('#searchText').val();
            checkStr(searchText,"Search searchText")
            var searchThread = {
                method: 'POST',
                url: `/thread/search`,
                data: {searchText: searchText}
            }
            $.ajax(searchThread).then(function (res) {
                result.show();
                if(res.error){
                    result.html(
                        `<p>
                            No thread found matching "${searchText}"
                        </p>`
                    );
                }else{
                    result.html(
                        `<div>
                            <a href="/thread/${res.threadId}">${res.threadTitle}</a>
                        </div>`
                    );
                }
                $('#searchText').val("");
            })
        } catch (error) {
            result.show();
            result.html(
                `<p>
                    ${error}
                </p>`
            );
            $('#searchText').val("");
        }
    })

})(window.jQuery);