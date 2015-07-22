/* 
 *  This file is part of the UGE(Uniform Game Engine).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://uge.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://uge.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
 */
 var Nav;
 (function(){
 if(!Nav){
	Nav = new Object();
 }
 Nav.nav = function(options){
	
	//处理 options
	console.log(options);
	options = options || {};
	if(!options.url){
		alert('缺少参数！');
		return false;
	}
	timeout = options.timeout || 3000;	
	$.mobile.loading('show', {theme:"a", text:"Please wait...", textonly:false, textVisible: true});
	$.ajax({
	url: options.url,
	error: function(jqXHR, strError){
		$.mobile.loading('hide');
		console.log(jqXHR);
		console.log(strError);
		if(jqXHR.status == 408){//timeout
			//do something. Try again perhaps?
			//console.log('nav timeout');
			out = '<div style="width: 29%;margin: auto;margin-top: 16%;">'+
				'<img  src="/sites/default/files/crash.png" alt="" /></div>';
			out += '<div style="text-align: center;font-size: 0.7em;color: gray;padding: 6% 0;">抱歉，程序开了点小差</div>'
			out += '<a href="javascript:window.location.reload();" style="margin: auto;width:40%;background:#FE8C68;color:white;" class="ui-corner-all ui-btn">返回</a>';
			$('div[data-role="content"]').html(out);
		}else if(jqXHR.status == 404){//404
			console.log('nav timeout');
			out = '<div style="width: 29%;margin: auto;margin-top: 16%;">'+
				'<img  src="/sites/default/files/crash.png" alt="" /></div>';
			out += '<div style="text-align: center;font-size: 0.7em;color: gray;padding: 6% 0;">抱歉，未找到网页</div>'
			out += '<a href="javascript:window.location.reload();" style="margin: auto;width:40%;background:#FE8C68;color:white;" class="ui-corner-all ui-btn">返回</a>';
			$('div[data-role="content"]').html(out);
		}
		if(options.error){
			options.error(jqXHR, strError);
		}
	},
	success: function (data){
		$.mobile.loading('hide');
		if(options.success){
			options.success(data);
		}
		$.mobile.changePage(options.url,{ transition: "flip"});
	},
	// here you can specify your timeout in milliseconds 
	timeout:timeout
	});
}
})();