/**
*	常用方法整理收集
*	@author		keenhome<keenhome@126.com>
*	@created	2013-07-04
*	@updated	2013-07-04
*/




/**
*	方法名：倒计时
*	用法: var a=new countDown(1111,22222,2,funcName1,funcName2);
*	@param int startTime	倒计时开始的时间戳（单位是秒）
*	@param int endTime		倒计时结束的时间戳（单位是秒）
*	@param int step		倒计时间隔,默认是1（单位秒）
*	@param function processingCallback		倒计时进行中回调方法，传参数： 天、时、分、秒
*	@param endCallback endCallback		倒计时结束回调方法，无参数
*/
function countDown(startTime,endTime,step,processingCallback,endCallback) {
	var step = step ? step : 1 ;
	var leftTime = parseInt(endTime-startTime);
	var processingCallback = processingCallback ;
	var endCallback = endCallback;
	var timer = null;
	var timeValues = [];

	var run = function(){
		if(isNaN(leftTime) || Math.floor(leftTime)<=0){
			clearTimeout(timer);
			if(typeof(endCallback)=='function'){
				endCallback();
			}
			return false;
		}else{
			timeValues[0] = Math.floor(leftTime/(60*60*24));
			timeValues[1] = Math.floor(leftTime/(60*60))%24;
			timeValues[2] = Math.floor(leftTime/60)%60;
			timeValues[3] = Math.floor(leftTime%60);
			if(typeof(processingCallback)=='function'){
				processingCallback(timeValues);
			}
			leftTime -=step;
			timer = setTimeout(function(){
				run();				
			},step*1000);
		}
	};
	run();
}


/**
*	方法名：获取url里面的参数
*	@param string paramter	url参数字段名
*	@param string url		需要截取参数的url，默认为当前页面的url
*	@return string 			返回url中paramter对应的值
*/
function getUrlParam(parameter, url) {
	url = (url=='' ||typeof(url)=='undefined') ? location.href : url;
	var result = url.match(new RegExp("[\#|\?]([^#]*)[\#|\?]?"));
	url = "&" + ((result==null) ? "" : result[1]);
	result = url.match(new RegExp("&" + parameter + "=", "i"));
	return (result==null) ? '' : url.substr(result.index+1).split("&")[0].split("=")[1];
}


/**
*	方法名：设置cookie
*	@param string name	cookie字段名
*	@param string value	cookie值
*	@param string domain cookie域名
*	@param string expire cookie过期时间，不设置为会话cookie
*/
function setCookie(name,value,domain,expire){
	var domain = domain ? domain : document.location.host;
	if(expire){
		var expireDate=new Date(new Date().getTime()+expire*1000);
		document.cookie = name + "=" + escape(value) + "; path=/; domain="+domain+"; expires=" + expireDate.toGMTString() ;
	}else{
		document.cookie = name + "=" + escape(value) + "; path=/; domain="+domain;
	}
}


/**
*	方法名：获取cookie值
*	@param string name	cookie字段名
*	@return string cookie值
*/
function getCookie(name){
	return this.decode((document.cookie.match(new RegExp("(^" + name + "| " + name + ")=([^;]*)")) == null) ? "" : RegExp.$2);
}


/**
*	方法名：字符串URI解码
*	@param string str 需要进行URI解码的字符串
*	@return string r URI解码后的值
*/
function decode(str){
	var r = '';
	try{
		r = decodeURIComponent(decodeURIComponent(str));	
	}catch(e){
		try {
			r = decodeURIComponent(str);
		}catch(e){
			r = str;
		}
	}
	return r;
}


/**
*	方法名：添加书签 
*	@param string title 书签名称
*	@return string url 书签指向的url，默认是当前页面地址。
*/
function addBookmark(title,url){
	var url = url ? url : location.href;
	var title = title ? title : document.title;
	if (window.sidebar) {
		window.sidebar.addPanel(title, url,"");
	} else if( document.all ) {
		window.external.AddFavorite( url, title);
	} else if( window.opera && window.print ) {
		return;
	} else {
		alert('请按Ctrl+D将'+title+'放入收藏夹!');
	}
}


/** 
*	方法名：利用JS原生方法加载js文件 
*	@	param	url 		要进行加载的脚本文件地址
*	@	param	charset 	指定加载脚本的编码类型，默认是utf-8
*	@	param	callback	加载完成回调的方法,可选参数
*/
function getScript(url,charset,callback){

	var noCache = '?t='+(new Date().getTime());
	if(charset){
		var pattern = new RegExp("utf8|UTF8|utf-8|UTF-8");
		var charset = pattern.test(charset) ? 'utf-8': 'gbk';
	}else{
		var charset = 'utf-8';
	}
	
	var scriptObj = document.createElement('script');
	scriptObj.setAttribute('type','text/javascript');
	scriptObj.setAttribute('charset',charset);	
	scriptObj.setAttribute('src',url+noCache);
	document.getElementsByTagName('head').item(0).appendChild(scriptObj);
	
	// IE 
	if(scriptObj.readyState){
		scriptObj.onreadystatechange = function(){
			if (scriptObj.readyState == "loaded" || scriptObj.readyState == "complete"){
				scriptObj.onreadystatechange = null;
				if(typeof(callback)=='function'){
					callback();
				}
			}
		}
	}else{
		scriptObj.onload = function(){
			if( typeof(callback)=='function' )
				callback();
		}
	}
}


/**
* 滚动到指定元素位置
* @param  object elem 元素节点
* e.g:
*     var elem = document.getElementsByClassName('sample')[0];
*     scrollTo(elem);
*
* @return object
*/
function scrollTo(elem) {

	// 获取文档对象
	var doc = elem && elem.ownerDocument;
	if (!doc) {
	    return false;
	}
	//  文档的根节点
	var docElem = doc.documentElement,
	    box = {
	        top: 0,
	        left: 0
	    },
	    isWindow = (doc != null && doc == doc.window),
	    win = isWindow ? doc : (doc.nodeType === 9 ? doc.defaultView || doc.parentWindow : false);
	
	// 获取元素四边数据
	if (typeof elem.getBoundingClientRect !== 'undefined') {
	    box = elem.getBoundingClientRect();
	}
	
	var offset = {
	    top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
	    left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
	};
	document.body.scrollTop = offset.top;
}

