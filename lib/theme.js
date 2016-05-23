(function(module) {
	"use strict";

	var templates = module.parent.require('templates.js'),
		User = module.parent.require('./user'),
		Posts = module.parent.require('./posts'),
		_ = module.parent.require('underscore'),
		async = module.parent.require('async');


	var theme = {};
	theme.init  = function(params, callback) {
		/*
		templates.registerHelper('superCoolHelper', function(data) {
			console.log('superCoolHelper');
			return data+'supercoolhelper';
		});
		console.log('theme-plugin-init',templates);
		*/
		callback();
	}
	/**
	 * Build header
	 * gör detta för att få ut fullname i menyn
	 */
	theme.renderHeaderHook = function(data, callback) {
		var uid = data.templateValues.user.uid;
		async.waterfall([
			function(next){
				User.getUserFields(uid, ['fullname'],next);
			}
		], function(err,result){
			data.templateValues.user["fullname"] = result.fullname;
			callback(null,data);
		});
	}

	/**
	 *  Hook för kategori, recent, popular, unread
	 *  gör detta för att få ut fullname på kategori-teaser
	 */
	theme.teaserControllerHook = function(data,callback) {
		//om inga topics - skit i vilket
		//console.log(data.templateData.topics);
		if(data.templateData.topics == null) callback(null,data);

		async.forEachOf(data.templateData.topics,function(element, index, topicCallback){
			//kolla så det finns data att arbeta med 
			if(element == null || element.teaser == null) {
				topicCallback();
			} else {
				//om det finns en user
				if(!element.teaser.hasOwnProperty("user")) topicCallback();

				var uid = element.teaser.user.uid;
				if(uid !== null) {
				async.waterfall([
					function(next) {
						User.getUserFields(uid, ['fullname'],next);
					}
				],function(err,result){
					data.templateData.topics[index].teaser.user["fullname"] = result.fullname;
					topicCallback();
				});
				} else {
					topicCallback();
				}
			}
		},function(err){
			callback(null,data);
		});
	}

	/**
	 *  hook för Kategorier
	 *  gör detta för att få ut fullname på senaste post
	 */
	theme.categoriesControllerHook = function(data,callback) {
		//varje kategori
		async.forEachOf(data.templateData.categories,function(element, index, catcallback){
			//teaserpost
			async.forEachOf(element.posts,function(p,pindex,pcallback) {
				//hämta uid
				async.waterfall([
					function(next) {
						//hämta uid från slug
						User.getUidByUserslug(p.user.userslug,next);
					},
					function(uid,next) {
						//hämta fullname
						User.getUserFields(uid, ['fullname'],next)
					},
					function(userData,next) {
						data.templateData.categories[index].posts[pindex].user["fullname"] = userData.fullname;
						next(null,'done');
					}], function (err, result) {
						  //postloop callback
						  pcallback();
					});
			},function(err){
				//postloop-done
				//kategoriloop callback.
				catcallback();
			});
		},function(err){
			callback(null, data);
		});
	}
	/**
	 * Fullname på topics - användare
	 */
	theme.accountTopicsBuild = function(data, callback) {
		//console.log(data.templateData);
		async.waterfall([
			function(next) {
				User.getUserFields(data.templateData.uid,['fullname'],next);
			},
			function(userdata,next) {
				data.templateData.fullname = userdata['fullname'];
				next(null);
			},
			function(next) {
				theme.teaserControllerHook(data,next);
			}
		], function(err){
			callback(null,data);
		})
	}

	/**
	 * Fullname på reply
	 */
	theme.topicControllerHook = function(data, callback) {
		//hack för att få ut fullname på reply
		async.forEachOf(data.templateData.posts,function(element, index, catcallback){
			//finns det parent?
			if(element.toPid === undefined){
				catcallback();
			} else {
				async.waterfall([
					function(next){
						//hämta posten för att veta vem som skrivit, helst med fullname direkt
						Posts.getPostField(element.toPid, 'uid', next);
					},
					function(uid,next){
						User.getUserFields(uid, ['fullname'],next);
					},
					function(userdata,next) {
						data.templateData.posts[index].parent["fullname"] = userdata["fullname"];
						next(null,"done");
					}
					],function(err,result){
						//kategoriloop callback.
						catcallback();
					}
				);
			}
		} ,function(err){
			callback(null, data);
		});
		//callback(null, data);
	}
	/***
	 * Andra hooks (som inte används på "riktigt")
	 */

	theme.categoryTopicsHook = function(data, callback) {
		console.log("categoryTopicsHook");
		callback(null, data);
	}

	module.exports = theme;

}(module));