$('document').ready(function () {
    $(window).on("action:topic.loaded", function() {
       console.log("topic loaded");
       init();
    });
    //funktion för att sätta tillbaka fullname efter postande. (i reply to)
    $(window).on('action:posts.loading', function(evt,data) {
        console.log('posts.loading',data);  // to inspect what is passed back by NodeBB
        
        //hämta pid
        var toPid = data.posts[0].toPid;
        var uid = data.posts[0].uid;
        /* detta funkar inte ... 
        socket.emit('posts.getPostFields', {pid: toPid, field: 'uid' }, function(err, index) {
		    if (err) {
			    //return app.alertError(err.message);
                console.log(err);
			}
            console.log('index',index);
		});
        data.posts[0].parent['fullname'] = "dragonslayer87";
        */
    });
    function init() {
        //Overrida citeringsfunktionerna och rensa lite
        require(['components', 'translator'], function (components, translator) {
            //<ul component="topic" class="posts" data-tid="41">
            var postContainer = components.get('topic');
            var tid = postContainer.data('tid');
            postContainer.on('click', '[component="ms/post/quote"]', function () {
                onQuoteClicked($(this), tid);
            });
            postContainer.on('click', '[component="ms/post/reply"]', function () {
                onReplyClicked($(this), tid);
            });
            $('.topic').on('click', '[component="ms/topic/reply"]', function () {
                onReplyClicked($(this), tid);
                console.log('ms/topic/reply not implemented - behövs den?');
            });
        });
    }

    function cleanQuotedText(theText) {
        //console.log('clean',theText);
        theText = theText.replace(/(?!<img class=\"emojione[^>])<img[^>]*\>/g,"[bild]");
        return theText.replace(/(?!<img class=\"emojione[^>])<(?:.|\n)*?>/gm, " ");
    }

    /**
     * Funktioner från /public/src/client/topic/postTools.js
     */
    //omgjord - fullname finns direkt på svara och citera-knapparna.
    function getUserName(button) {
        var username = button.data('fullname');
        //var post = button.parents('[data-pid]');
        if(!username) username="";
        return username;
	}

    function getData(button, data) {
		return button.parents('[data-pid]').attr(data);
	}

    function onReplyClicked(button, tid) {
        showStaleWarning(function (proceed) {
            if (!proceed) {
                var selectionText = '';
                var selection = window.getSelection ? window.getSelection() : document.selection.createRange();
                var content = button.parents('[component="post"]').find('[component="post/content"]').get(0);

                if (content && selection.containsNode(content, true)) {
                    var bounds = document.createRange();
                    bounds.selectNodeContents(content);
                    var range = selection.getRangeAt(0).cloneRange();
                    if (range.compareBoundaryPoints(Range.START_TO_START, bounds) < 0) {
                        range.setStart(bounds.startContainer, bounds.startOffset);
                    }
                    if (range.compareBoundaryPoints(Range.END_TO_END, bounds) > 0) {
                        range.setEnd(bounds.endContainer, bounds.endOffset);
                    }
                    bounds.detach();
                    selectionText = range.toString();
                    range.detach();
                }

                var username = getUserName(button);
                if (getData(button, 'data-uid') === '0' || !getData(button, 'data-userslug')) {
                    username = '';
                }

                var toPid = button.is('[component="ms/post/reply"]') ? getData(button, 'data-pid') : null;

                if (selectionText.length) {
                    $(window).trigger('action:composer.addQuote', {
                        tid: tid,
                        slug: ajaxify.data.slug,
                        index: getData(button, 'data-index'),
                        pid: toPid,
                        topicName: ajaxify.data.titleRaw,
                        username: username,
                        text: cleanQuotedText(selectionText)
                    });
                } else {
                    $(window).trigger('action:composer.post.new', {
                        tid: tid,
                        pid: toPid,
                        topicName: ajaxify.data.titleRaw,
                        text: ' '
                    });
                }
            }
        });
    }

    function onQuoteClicked(button, tid) {
        showStaleWarning(function (proceed) {
            if (!proceed) {
                var username = getUserName(button),
                    pid = getData(button, 'data-pid');

                socket.emit('posts.getRawPost', pid, function (err, post) {
                    if (err) {
                        return app.alertError(err.message);
                    }

                    $(window).trigger('action:composer.addQuote', {
                        tid: tid,
                        slug: ajaxify.data.slug,
                        index: getData(button, 'data-index'),
                        pid: pid,
                        username: username ? username + ' ' : ' ',
                        topicName: ajaxify.data.titleRaw,
                        text: cleanQuotedText(post)
                    });
                });
            }
        });
    }
    function showStaleWarning(callback) {
        if (ajaxify.data.lastposttime < (Date.now() - (1000 * 60 * 60 * 24 * ajaxify.data.topicStaleDays))) {
            translator.translate('[[topic:stale.warning]]', function (translated) {
                var warning = bootbox.dialog({
                    title: '[[topic:stale.title]]',
                    message: translated,
                    buttons: {
                        reply: {
                            label: '[[topic:stale.reply_anyway]]',
                            className: 'btn-link',
                            callback: function () {
                                callback(false);
                            }
                        },
                        create: {
                            label: '[[topic:stale.create]]',
                            className: 'btn-primary',
                            callback: function () {
                                translator.translate('[[topic:link_back, ' + ajaxify.data.title + ', ' + config.relative_path + '/topic/' + ajaxify.data.slug + ']]', function (body) {
                                    $(window).trigger('action:composer.topic.new', {
                                        cid: ajaxify.data.cid,
                                        body: body
                                    });
                                });
                            }
                        }
                    }
                });

                warning.modal();
            });
        } else {
            callback(false);
        }
    }

});
