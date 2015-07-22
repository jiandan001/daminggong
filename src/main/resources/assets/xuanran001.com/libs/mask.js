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

var Mask;

// start spolo code scope
(function() {
	if(!Mask)
	{
		Mask = new Object();
	}
	//创建div层
	Mask.createMask = function()
	{
		var newMaskID = "mask";  //遮罩层id  
		var newMaskWidth = document.body.offsetWidth;//遮罩层宽度  
		var newMaskHeight = document.body.offsetHeight;//遮罩层高度        
		var newMask = document.createElement("div");//创建遮罩层  
		newMask.id = newMaskID;//设置遮罩层id  
		newMask.style.position = "absolute";//遮罩层位置  
		newMask.style.zIndex = "1";//遮罩层zIndex  
		newMask.style.width = newMaskWidth + "px";//设置遮罩层宽度  
		newMask.style.height = newMaskHeight + "px";//设置遮罩层高度  
		newMask.style.top = "0px";//设置遮罩层于上边距离  
		newMask.style.left = "0px";//设置遮罩层左边距离  
		newMask.style.background = "#fff";//遮罩层背景色  
		newMask.style.filter = "alpha(opacity=60)";//遮罩层透明度IE  
		newMask.style.opacity = "0.60";//遮罩层透明度FF  
		document.body.appendChild(newMask);//遮罩层添加到DOM中  
	}
	Mask.remove = function()
	{
		document.body.removeChild(document.getElementById('mask'));//移除遮罩层  
	}
	//创建等待图片
	Mask.createWaiting = function()
	{
		var wait = document.createElement("img");
		wait.id = 'waiting';
		var width = document.body.offsetWidth;
		var height = document.body.offsetHeight;
		wait.src = "/libs/image/waiting.gif";
		wait.style.width = "40px";
		wait.style.height = "40px";
		wait.style.position = "absolute";
		wait.style.left =  width / 2 + "px";
		wait.style.top = height / 2 + "px";
		wait.style.zIndex = "2";
		document.body.appendChild(wait);//遮罩层添加到DOM中  
	}
	Mask.removeWaiting = function()
	{
		document.body.removeChild(document.getElementById('waiting'));//移除遮罩层
	}
})();