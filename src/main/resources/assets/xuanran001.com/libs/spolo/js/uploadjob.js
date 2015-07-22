String.prototype.trim=function   (){return   this.replace(/(^\s*)|(\s*$)/g,'');} 
/**
 *  This file is part of the spp(Superpolo Platform).
 *  Copyright (C) by SanPolo Co.Ltd.
 *  All rights reserved.
 *
 *  See http://www.spolo.org/ for more information.
 *
 *  SanPolo Co.Ltd
 *  http://www.spolo.org/
 *  Any copyright issues, please contact: copr@spolo.org
**/

function checkemail(str){   
	var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;   
	if(!sReg.test(str)){   
		return false;   
	}   
	return  true;   
}		
var updateYinfujine = function (){
	// 获取当前选中的摄像机数量
	var cameraCount = getCameraList().length;
	// 获取用户所选取的图片质量
	var quality =$("#quality").val();								
	var unitPrice = quality;				
	var totalPrice = unitPrice*cameraCount;				
	$("#yinfujine").text(totalPrice +'元');
}
function checkNumber(value){
	var re = /^\d+(\d+)?$/;  
	if (!re.test(value)){    
		return false;  
	}  
	return true;
}			
// 返回摄像机列表
function getCameraList()
{
	var cameraList_obj = document.getElementById("cameraList");
	var cameras_list = [];
	for(var i in cameraList_obj.childNodes)
	{
		if((cameraList_obj.childNodes[i].nodeName == "INPUT")
			&& cameraList_obj.childNodes[i].checked)
		{
			var name = cameraList_obj.childNodes[i]["id"];
			cameras_list.push(name);
		}
	}
	return cameras_list;
}

// 通过Gutil获取渲染场景的信息
function getSceneInfo(callback){	
	gutil.getRenderJson("cameras", function(ret){		
		var cameras = ret.info;
		callback(cameras);
	});	
}
// 显示和隐藏高级渲染
var switchAdvanceOption = function(){				
	if($("#showAdvancedOptions_button")[0].checked){
		$("#AdvancedOptions_Panel").css('display','block');
		$("#BaseOptions_Panel").css("margin-left","18%");					
	}else{
		$("#BaseOptions_Panel").css("margin-left",'30%');
		$("#AdvancedOptions_Panel").css('display','none');
	}
}
// 取消
var cancelbtn = function(){
	var exit_code = confirm("是否放弃本次提交!");
	if(exit_code){		
		window.close();
	}
}
// 提交
var submitjob = function(){
	//获取摄像机
	var cameras_list = getCameraList();
		if(!cameras_list.length){			
			alert("请选择摄像机！ ");
			return;
		}
	//获取出图任务名称
	var userDefinedJobName = $("#userDefinedJobName").val();
	if(!userDefinedJobName || userDefinedJobName.trim()==""){		
		alert("请输入出图项目名称！ ");
		return;
	}else{
		//userDefinedJobName = Spolo.inputEncode(userDefinedJobName);
	}
	//获取渲染参数
	var quality =$("#quality").val();
	console.log(quality);
	var xy = '480x360';
	if(quality==50){
		xy='1200X900';
	}	
	//获取email参数
	var email = $("#resultemailaddr").val();
	if(!checkemail(email)){		
		alert("请填写正确的邮箱地址");
		return;
	}
	//获取客户名称
	var customerName = $("#customerName").val();
	if(!customerName||customerName.trim()==""){		
		alert("请填入客户名称");
		return;
	}
	//通过jobManager来创建一个任务,上传成功之后跳转到场景列表页面
	// 生成一个json对象,然后调用Gutil来提交任务;
		var args = { 
				notifyEmail:email,
				cameraName:cameras_list,
				resolution:xy,
				samples:'16000',
				userJobName:userDefinedJobName,
				customerName:customerName		
		};
		//过滤无效的值
		for(var key in args.jobInfo){
			if(!args.jobInfo[key]){
				delete args.jobInfo[key];
			}
		}
		var argsstr = JSON.stringify(args);		
		// 提交任务
		gutil.upload("/userdata/uploadjob/abcd",argsstr, function(ret){
			console.log(ret);
			if(ret.suc){
				// 提交成功,给出提示后关闭窗口
				var exit_code = confirm("任务提交成功!");
				if(exit_code){		
					window.close();
				}								
			}else{
				// 给出错误信息
				var exit_code = confirm('任务提交失败,信息如下: \r\n '+ret.info);
				if(exit_code){		
					window.close();
				}
			}
		});

}
$(document).ready(
	function(){		
		//获取摄像机信息,并且为每个单选项增加click事件
		var camerascallback = function(cameras){
			var cameraList_list = $('#cameraList');					
			cameraList_list.css('display','block');
			for(var j = 0; j <cameras.length; j++)
			{
				var camera_name = cameras[j];
				var cameraCheckbox = $('<input type="checkbox">'+camera_name+'</input>');
				cameraCheckbox.attr('value',camera_name);
				cameraCheckbox.attr('name','cameraName');
				cameraCheckbox.attr('id',camera_name);
				cameraCheckbox.css('margin-bottom','15px');
				cameraCheckbox.click(updateYinfujine);						
				cameraList_list.append(cameraCheckbox);
				cameraList_list.append($('<br>'));
			}		
		}
		var sceneInfo = getSceneInfo(camerascallback);
		// 绑定 quality click 事件
		$('#quality').click(updateYinfujine);
		
		//绑定 高级选项 click 事件
		$('#showAdvancedOptions_button').click(switchAdvanceOption);
		
		//绑定 提交 click 事件
		$('#_submit').click(submitjob);
		
		//绑定 取消 click 事件
		$('#cancel').click(cancelbtn);
		
	}
);		