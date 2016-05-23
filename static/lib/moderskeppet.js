$('document').ready(function () {
    
    setupMobileMenu();
    
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
    
    	function setupMobileMenu() {
            console.log('setting up mobile menu');
            
            var env = utils.findBootstrapEnvironment();
            
		if (!window.addEventListener) {
			return;
		}

		$('#menu').removeClass('hidden');

		var slideout = new Slideout({
			'panel': document.getElementById('container-outer'),
			'menu': document.getElementById('menu'),
			'padding': 256,
			'tolerance': 70,
			'side': 'right'
		});
		
		if (env !== 'xs') {
			slideout.disableTouch();
		}

		$('#mobile-menu').on('click', function() {
			slideout.toggle();
		});

		$('#menu a').on('click', function() {
			slideout.close();
		});

		$(window).on('resize action:ajaxify.start', function() {
			slideout.close();
			$('.account .cover').css('top', $('[component="navbar"]').height());
		});

		function openingMenuAndLoad() {
			openingMenu();
			loadNotificationsAndChat();
		}

		function openingMenu() {
			//$('#header-menu').css({
			//	'top': $(window).scrollTop() + 'px',
			//	'position': 'absolute'
			//});

			loadNotificationsAndChat();
		}

		function loadNotificationsAndChat() {
            require('notifications',function(notifications){
               notifications.loadNotifications($('#menu [data-section="notifications"] ul'));
            });
            /*
			require(['chat', 'notifications'], function(chat, notifications) {
				chat.loadChatsDropdown($('#menu [data-section="chats"] ul'));
				notifications.loadNotifications($('#menu [data-section="notifications"] ul'));
			});
            */
		}

		slideout.on('open', openingMenuAndLoad);
		slideout.on('touchmove', function(target) {
			var $target = $(target);
			if ($target.length && ($target.is('code') || $target.parents('code').length)) {
				slideout._preventOpen = true;
			}
		});

		slideout.on('close', function() {
			//$('#header-menu').css({
			//	'top': '0px',
			//	'position': 'fixed'
			//});
			$('.slideout-open').removeClass('slideout-open');
		});

		$('#menu [data-section="navigation"] ul').html($('#main-nav').html() + ($('#search-menu').html() || '') + ($('#logged-out-menu').html() || ''));
		$('#menu [data-section="profile"] ul').html($('#user-control-list').html())
			.find('[component="user/status"]').remove();

		socket.on('event:user_status_change', function(data) {
			app.updateUserStatus($('#menu [component="user/status"]'), data.status);
		});
	}
    

});
