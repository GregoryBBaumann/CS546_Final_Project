function checkStr(str, name){
    if(str === null || str === undefined) throw `${name} not provided`;
    if(typeof str !== 'string') throw `${name} is not a string`;
    str = str.trim();
    if(str.length === 0) throw `${name} is empty`;
    return str;
}

(function ($){
    var searchForum = $('#searchThread'),
        result = $('#searchResult');

        searchForum.submit(function (event) {
            event.preventDefault();
            try {
                var text = $('#searchText').val();
                checkStr(text,"Search text")
                var searchThread = {
                    method: 'POST',
                    url: `/thread/search`,
                    data: {text: text}
                }
                $.ajax(searchThread).then(function (res) {
                    result.show();
                    if(res.error){
                        result.html(
                            `<p>
                                No thread found matching search
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