/**
 * @package KHslider 基于jQuery1.4+
 * @version 2.1
 * @uptate 2013-07-04
 * @author keenhome	<keenhome@126.com>
 **/

var KHslider = (function($){
	var defaultSettings = {
			bigPicContainer:'#bigpic',	// 包含所有轮播图的外层元素id
			bigPicItemSelector:'.bigpicItem',	//一次轮播显示的所有内容
			bigPicSelector:'img',	// 大图选择器，如果要对后面的图片进行延时加载，需要将图片src保存到 data-src属性
			thumbnailContainer:'#thumbnail',	// 小导航容器选择器
			thumbnailItemSelector:'.thumbnailItem',	// 一个小导航元素选择器，基于小导航容器选择器
			thumbnailOnStyle:'on',	// 小导航选中的样式名（不带点）
			nextButtonSelector : '.next',	// 下一个按钮的选择器
			prveButtonSelector : '.prve',	// 上一个按钮的选择器
			switchTime:6000,	// 图片停留的时间
			speed:1000,		// 水平切图的速度
			effect:'fadeIn',	// 切换效果，支持fadeIn 和 scrollX
			slideWidth:0,	// 水平切换图片移动的宽度
			slideHeight:0,	// 垂直切换图片移动的高度（暂不支持）
			steps : 1,	// 每次滚动数
			callback:null	// 切换后回调
		},
		allSettings={},	// 保存不同轮播图的配置,用于实现多个实例  
		allTimers={},	//	保存不同轮播图的自动切换定时器,用于实现多个实例 
		allRunningData={};	// 保存不同轮播图需要用到的变量,用于实现多个实例 
		
	var prototype = {
		init:function(settings){
			var that = this;
			var id = (new Date()).getTime()+'_'+Math.random();
			var settings = $.extend({}, defaultSettings, settings);
			settings.id= id;
			allSettings[settings.id] = settings;
			allTimers[settings.id] = null;
			var bigpicItems = $(settings.bigPicContainer).find(settings.bigPicItemSelector);	// 轮播大图对象集合
			var thumbnailItems = $(settings.thumbnailContainer).find(settings.thumbnailItemSelector);	// 小导航对象集合
			var lastindex = $(settings.thumbnailContainer).find(settings.thumbnailItemSelector).index($(settings.thumbnailContainer +' .'+settings.thumbnailOnStyle));	// 最后一次显示的序号，初始时与当前一致
			var picsNum = $(settings.bigPicContainer).find(settings.bigPicItemSelector).length;	// 轮播数量
			var slideWidth = settings.slideWidth ? settings.slideWidth : bigpicItems.eq(0).outerWidth(true);	// 滚动元素一次滚动的宽度
			var slideHeight =  settings.slideHeight ? settings.slideHeight : bigpicItems.eq(0).outerHeight(true);	// 滚动元素一次滚动的高度
			allRunningData[settings.id] = {
				"bigpicItems" : bigpicItems,
				"thumbnailItems" : thumbnailItems,
				"picsNum": picsNum,
				"lastindex" : lastindex,
				"curindex" : 0,
				"slideWidth" :slideWidth,
				"slideHeight" : slideHeight
			};
			// 单次轮播数大于轮播项时不轮播 
			if(allRunningData[settings.id].picsNum<=settings.steps ){
				// 隐藏导航 
				if(thumbnailItems.size()>0)
					thumbnailItems.hide();
				// 隐藏前一个/后一个按钮
				var prveButtonObj = $(settings.prveButtonSelector);
				if(prveButtonObj && prveButtonObj.size()>0){
					prveButtonObj.hide();
				}
				var nextButtonObj = $(settings.nextButtonSelector);
				if(nextButtonObj && nextButtonObj.size()>0){
					nextButtonObj.hide();
				}
				return false;
			}
			// 水平滚动效果
			if(settings.effect=='scrollX'){
				var bigPicContainer = $(settings.bigPicContainer);
				var positionType = bigPicContainer.css('position');
				bigPicContainer.css("width",picsNum*slideWidth);
				// 给大图容器设置绝对定位
				if( !positionType || positionType!='absolute'){
					bigPicContainer.css('position','absolute');
					bigpicItems.show();
				}
			}
			that.eventInit(settings.id);
		},
		
		eventInit:function(id){
			var that = this,
				runningData=allRunningData[id],
				settings = allSettings[id];
			allTimers[id] = setInterval(function(){
				that.switchPic(id);
			},settings.switchTime);

			// 点击下一个
			var nextButtonObj = $(settings.nextButtonSelector);
			if(nextButtonObj && nextButtonObj.size()>0){
				nextButtonObj.unbind('click').click(function(){
					// 清除自动切换
					clearInterval(allTimers[id]);
					allTimers[id] = setInterval(function(){
						that.switchPic(id);
					},settings.switchTime);
					// 获取上一次显示的序号
					runningData.lastindex = runningData.curindex;
					runningData.thumbnailItems.eq(runningData.lastindex).removeClass(settings.thumbnailOnStyle);
					runningData.curindex = runningData.lastindex < runningData.picsNum-1 ? runningData.lastindex+1 : 0; 
					runningData.thumbnailItems.eq(runningData.curindex).addClass(settings.thumbnailOnStyle);
					that.show(id);
					return false;
				});
			}

			// 点击前一个 
			var prveButtonObj = $(settings.prveButtonSelector);
			if(prveButtonObj && prveButtonObj.size()>0){
				prveButtonObj.unbind('click').click(function(){
					// 清除自动切换 
					clearInterval(allTimers[id]);
					allTimers[id] = setInterval(function(){
						that.switchPic(id);
					},settings.switchTime);
					// 获取上一次显示的序号 
					runningData.lastindex = runningData.curindex;
					runningData.thumbnailItems.eq(runningData.lastindex).removeClass(settings.thumbnailOnStyle);
					runningData.curindex= runningData.lastindex >0 ? runningData.lastindex-1 : runningData.picsNum-1;
					runningData.thumbnailItems.eq(runningData.curindex).addClass(settings.thumbnailOnStyle);
					that.show(id);
					return false;
				});
			}

			// hover导航切换 
			runningData.thumbnailItems.mouseover(function(){
				// 清除自动切换 
				clearInterval(allTimers[id]);
				// 获取上一次显示的序号
				runningData.lastindex = $(settings.thumbnailContainer).find(settings.thumbnailItemSelector).index($(settings.thumbnailContainer +' .'+allSettings[id].thumbnailOnStyle));
				runningData.thumbnailItems.eq(runningData.lastindex).removeClass(settings.thumbnailOnStyle);
				$(this).addClass(settings.thumbnailOnStyle);
				runningData.curindex= runningData.thumbnailItems.index($(this));
				that.show(id);

			}).mouseout(function(){
				allRunningData[id].lastindex = runningData.thumbnailItems.index($(settings.thumbnailContainer +' .'+settings.thumbnailOnStyle));
				
				allTimers[id] = setInterval(function(){
					that.switchPic(id);
					clearInterval(allTimers[id]);
					allTimers[id] = setInterval(function(){
						that.switchPic(id);
					},settings.switchTime);
				},250);
			
			});

			// hover大图暂停 
			runningData.bigpicItems.mouseover(function(){
				// 清除自动切换
				clearInterval(allTimers[id]);
			}).mouseout(function(){
				allRunningData[id].lastindex = runningData.thumbnailItems.index($(settings.thumbnailContainer +' .'+settings.thumbnailOnStyle));				
				allTimers[id] = setInterval(function(){
					that.switchPic(id);
					clearInterval(allTimers[id]);
					allTimers[id] = setInterval(function(){
						that.switchPic(id);
					},settings.switchTime);
				},250);
			
			});
		},
		switchPic:function(id){
			var that = this,
			lastindex=allRunningData[id].lastindex,
			runningData=allRunningData[id];
			runningData.thumbnailItems.eq(lastindex).removeClass(allSettings[id].thumbnailOnStyle);
			runningData.curindex = (lastindex+1 >= runningData.picsNum) ? 0: lastindex+1;
			runningData.thumbnailItems.eq(runningData.curindex).addClass(allSettings[id].thumbnailOnStyle);
			that.show(id);
			allRunningData[id].lastindex = runningData.curindex;
		},
		show:function(id){
			var bigpicItems = allRunningData[id].bigpicItems,
				curindex=allRunningData[id].curindex,
				settings = allSettings[id];
			if(settings.bigPicSelector){
				if(settings.bigPicItemSelector==settings.bigPicSelector){
					var curImg = bigpicItems.eq(curindex);
				}else{
					var curImg = bigpicItems.eq(curindex).find(settings.bigPicSelector);
				}
				if(curImg && !curImg.attr('src')){
					curImg.attr('src',curImg.attr('data-src'));
				}						
			}
			if(settings.effect=='scrollX'){
				$(settings.bigPicContainer).stop().animate({"left":-curindex*settings.steps*allRunningData[id].slideWidth},settings.speed,settings.callback);
			}else{
				bigpicItems.eq(curindex).stop(true,true);
				bigpicItems.eq(allRunningData[id].lastindex).stop(true,true).fadeOut(function(){
					bigpicItems.eq(curindex).fadeIn('slow');
				});
				
			}
			if(settings.callback){
				settings.callback(curindex);
			}
				
		}
	}
	return prototype;
})(jQuery);