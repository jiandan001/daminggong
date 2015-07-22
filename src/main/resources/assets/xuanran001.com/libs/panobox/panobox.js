var panoBox;

if(!panoBox){
	panoBox = new Object();
}

//show flash
var showFlash = function(option){
	var startNode=document.location.hash.substring(1);        
	var flashvars = {};
	var params = {};

	if (startNode.length>0) {
	    flashvars.startnode=startNode;
	}

	// enable javascript interface
	flashvars.externalinterface="1";
	params.quality = "high";
	params.bgcolor = "#ffffff";
	// params.allowscriptaccess = "sameDomain";
	params.allowScriptAccess = "always";
	params.allowfullscreen = "true";
	params.wmode = "transparent";
	params.base=".";
	var attributes = {};
	attributes.id ="container";
	attributes.name = "container";
	attributes.align = "middle";
	attributes.style = " background: url("+option.load+") 50% 50% no-repeat;";
	swfobject.embedSWF(option.url,"container", "460", "360","9.0.0", "expressInstall.swf",flashvars, params, attributes);	
}

//show html5
var showHtml5 = function(option){
	if (option.url.length){
		// create the panorama player with the container
		pano = new pano2vrPlayer('container');
		// add the skin object
		skin = new pano2vrSkin(pano);
		// load the configuration
		pano.readConfigUrl(option.url);
	}else{
		document.write('<div style="width:460px;height:320px;"><p style="position: absolute;top: 65px;left: 70px;">貌似数据有点小问题，暂时不能预览全景图..</p></div>');
	}
}

// 是否支持flash
var flashChecker = function(){
	var hasFlash=0;　　　　//是否安装了flash
	var flashVersion=0;　　//flash版本

	if(document.all){
		var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
		if(swf) {
			hasFlash=1;
			VSwf=swf.GetVariable("$version");
			flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]); 
		}
	}else{
		if (navigator.plugins && navigator.plugins.length > 0){
		var swf=navigator.plugins["Shockwave Flash"];
		if (swf){
			hasFlash=1;
			var words = swf.description.split(" ");
			for (var i = 0; i < words.length; ++i){
				if (isNaN(parseInt(words[i]))) continue;
					flashVersion = parseInt(words[i]);
			}
		}
		}
	}
	return {f:hasFlash,v:flashVersion};
}

var wrireContainer = function(option){
		document.write('<div id="container" style="width:'+option.w+'px;height:'+option.h+'px;"></div>');
}
panoBox = function(option){
		// 先写一个空标签
		wrireContainer(option);
		Modernizr.load({
			test:Modernizr.textshadow, //&&!(/Android/i.test(navigator.userAgent))
			yep:[ 'pano2vr_player.js','skin.js'],
			nope:'swfobject.js',
			complete:function (){
				// 根据加载js区分载入swf/xml数据
				// swfobject检查
				if(window.swfobject){
					option.url ='pano.swf';
					option.load ='images/load.gif';
					var fls = flashChecker();
					if(fls.f){
						showFlash(option);
					}else{
						// document.write("您没有安装flash");
						document.getElementById("container").innerHTML = '您没有安装flash， <a href="http://get.adobe.com/cn/flashplayer/">前去下载</a>' ;	
					} 					
				}
				//pano2vrPlayer检查
				if (window.pano2vrPlayer){
					option.url = 'pano.xml';
					showHtml5(option);				
				} 	
			}	
		});

}




