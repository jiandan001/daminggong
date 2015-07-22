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
 
 /**该js包含xuanran001的gutil打开的页面需要的功能
 1.运行环境检查（cache control）TODO
 2.登录验证 prelogin（check cookies）  loginFilter(response filter)
 */
 if(!SpoloGutil || !typeof(SpoloGutil)=="object" ){
	var SpoloGutil = new Object();
 }
 (function(){
	//私有属性
	//私有方法
	function StringTrim(str){
		 return str.replace(/(^\s*)|(\s*$)/g, "");  
	}
	//xuanran001对外暴露的js方法
	/**检查cookie是否包含 SESSxx(drupal生成的随机码)xx的键，如果不包含说明没有登录。
	此方法判断不准确，如果设置了其他的cookie的key是以 “SESS”开头的，那么就会判断不准
	*/
	SpoloGutil.preloginChecker = function(){
		var name = "SESS";
		var notLogged = true;
		var cookies = document.cookie.split(";");
		for(var index=0;index<cookies.length;index++){
			var cookie = cookies[index];
			if(StringTrim(cookie).indexOf(name) == 0){
				notLogged = false;
				break;
			}
		}
		if(notLogged){
			window.location.assign("/gh/login.html?refer="+window.location.href);
		}
	};
	/**判断响应码 做出跳转判断
	*/
	SpoloGutil.loginFilter = function(status){
		if(status==401){
			window.location.assign("/gh/login.html?refer="+window.location.href);
		}
	};
	
	//判断jquery环境，如果有jquery，直接使用jquery的方法实现
	if($){
		$( document ).ajaxComplete(function( event, xhr, settings ) {
			SpoloGutil.loginFilter(xhr.status);
		});
	};
	/**浏览器检查,非Gutil打开本页面就跳转到登陆页*/
	SpoloGutil.browserCheck = function (){
		var agent = window.navigator.userAgent;
		console.log(agent);
		var gutil_regexp =/spolo gutil/;		
		if(agent){
			if(!gutil_regexp.test(agent)){					
				window.location.href='/download/index.html';
			}
		}else{			
			window.location.href='/download/index.html';
		}
	};
	

	/** 当前页是否需要 */
	SpoloGutil.UpdateCheck = function (callback,force){		
		var updateCallback = function(data){
			var tag = $('#gluevtag');
			var name = tag.attr('name');
			var pageversion = Number(tag.attr('value'));
			var storage = window.localStorage;		
			if(data){
				// 每个页面都对一个属性(NAME+Update Checked);
				var lpt = name+'UC'
				var pagetag = storage.getItem(lpt);
				if(!pagetag){
					// 判断当前页面版本是否低于服务端版本
					var pvo = data.sp[name];
					var nv = Number(pvo.v);
					if(pageversion<nv){						
						var result = new Object();
						result.update = true;
						result.newversion =pvo ;
						var ret = callback(result);
						storage.setItem(lpt,ret.update);
						if(ret&&ret.update){
							window.location.reload(true);
						}
					}
				}
			}
		}		
		SpoloGutil.CheckUpdateInfo(updateCallback,force);
	};
	/**检查本地的版本信息是否是超时,如果超过了时限自动取回服务器最新信息*/
	SpoloGutil.CheckUpdateInfo = function (callback,force){
			var st = window.localStorage;
			var newversion = function(data){						
				console.log('最新更新信息: '+data);
				var vobj = JSON.parse(data.info);
				st.setItem('SPAGE',JSON.stringify(vobj));
				var lct = new Date();
				// Update Interval
				st.setItem('UI',vobj.UI);
				// Last Check Time
				st.setItem('LCT',lct.toLocaleString());
				// TODO 清理各个库的已更新的标记
				var libs = vobj.sp;
				for(var l in libs){
					console.log("key---> "+l);					
					st.removeItem(l+'UC');
				}
				callback(vobj);				
			}
			// 强制更新
			if(force!='undifine'&&force==true){
				SpoloGutil.GetNewVersion(newversion);
				return;
			}				
			var sp = st.getItem('SPAGE');						
			if(!st){
				SpoloGutil.GetNewVersion(newversion);
			}else{				
				var interval = SpoloGutil.UpdateInterval();				
				var ui = Number(st.getItem('UI'));										
				if(interval>ui){
					SpoloGutil.GetNewVersion(newversion);
				}else{
					callback(JSON.parse(sp));
				}				
			}			
	};
	/**获取当前时间与上一次更新时间的间隔 */	
	SpoloGutil.UpdateInterval = function(){
		// 现在的时间与上一次更新时间的间隔,(小时)
		var ltime = window.localStorage.getItem('LCT');	
		if(ltime==null){
			return 9999999;
		}
		var startTime = new Date(ltime);
		var curenttime = new Date();
		// var startTime = startTime.replace(/\-/g, "/");
		// var endTime = endTime.replace(/\-/g, "/");
		var divNum = 1000 * 3600;
		var inter = ((curenttime.getTime() - startTime.getTime()) / parseInt(divNum));		
		return  parseInt(inter)
	}
	/**获取服务器端最新的版本信息*/	
	SpoloGutil.GetNewVersion = function(callback){		
		var args = [];
		args[0] = '-F';
		args[1] = '"a=a"';
		args[2] = 'www.xuanran001.com/userdata/version/static';		
		gutil.SPCurl(args,callback);
	}
	/**运行环境更新检查 */
	SpoloGutil.RTUpdateCheck = function (callback){
	    return;
		var st = window.localStorage;	
		var gutilCheckTime = st.getItem('GUT');				
		if(gutilCheckTime!=null){		
			gut = Number(gutilCheckTime);										
			var startTime = new Date(gutilCheckTime);
			var curenttime = new Date();		
			var divNum = 1000 * 3600;
		gutilCheckTime = (curenttime.getTime() - startTime.getTime())/parseInt(divNum);			
		}else{
			// 没有 Update Interval 这个值,说明是没有更新过,赋为0,进行更新检查
			gutilCheckTime=9999999;
		}
		//	为gutil 预留的一个键,方便Gutil能够控制软件更新间隔.
		var gui = st.getItem('GUI');
		if(gui!=null){
			gui = Number(gutilCheckTime);
		}else{
			gui = 24;
		}
		if(gutilCheckTime>gui){
			gutil.RTUpdateCheck(function(ret){
				console.log(ret);			
				if(ret.suc){
					var ifupdate = callback(ret);
					if(ifupdate&&ifupdate.update){
						var lct = new Date();
						window.localStorage.setItem('GUT',lct.toLocaleString());
						// Gutil Update Interval
						gutil.updateRt(function(ret){
							console.log("updateRt callback called! ret:" + ret);
						});
					}
				}else{
					var lct = new Date();
					window.localStorage.setItem('GUT',lct.toLocaleString());
				}
			});			
		}		
	}
	/**本地缓存数据更新检查  */
	SpoloGutil.CacheDataUpdateCheck = function (type){ 
		//	room furniture
		gutil.updateCache(type, function(ret){
			console.log(JSON.stringify(ret), type+": JSON.stringify(ret)");
		});
	}
    
	/**获得本地家具缓存数据  */
	SpoloGutil.ghFurnitureCache = function (){
		if(window.localStorage.ghFurnitureCache){
			return window.localStorage.ghFurnitureCache;
		}else{
			return '';
		}			
	}
    
	/**获得本地户型缓存数据  */
	SpoloGutil.ghRoomCache = function (){
		if(window.localStorage.ghRoomCache){
			return window.localStorage.ghRoomCache;
		}else{
			return '';
		}		
	}
    
 })();
