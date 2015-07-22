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
var _myJobObj = {};

// 初始化之后就不再初始化
_myJobObj.detailTableInit = false;

//获取当前用户的所有排队中的job信息
_myJobObj.getMyJob = function(){
	_myJobObj.JobList={
		header:[
			{key: "项目序列号"},
			{key: "项目名称"},
			{key: "客户名称"},
			{key: "项目状态"},
			{key: "消费金额"},
			{key: "创建时间"},
			{key: "操作"}
		],
		item:[
			{
				id: "a",
				jobname: "当前视角",
				customname:"陈忠明",
				createtime:"2014年",
				status: "完成",
				price: "18"				
			},
			{
				id: "b",
				jobname: "左上角",
				customname:"随碟附送",
				createtime:"2014年",
				status: "等待中",
				price: "50"	
			}		
		],
		taskheader:
		[
			{key: "序号"},
			{key: "视角名称"},
			{key: "耗时"},
			{key: "状态"},
			{key: "金额"}
		],			
		task:{
			a:{
				id: "abce",
				cameraname: "左上角",
				timeconsuming: "1分钟",
				status: "完成",
				price: "18"
			},
			b:{
				id: "job1234999",
				cameraname: "当前视角",
				timeconsuming: "10分钟",
				status: "排队中...",
				price: "50"
			}
		},
}
	return _myJobObj.JobList;
}

_myJobObj.initTableHeader = function(jtable,hitem){
	// TODO 表格的头部	
	var table_header = $('<tr class="success"></tr>');
	for(var k in hitem){					
		var col = $('<td>'+hitem[k].key+'</td>').appendTo(table_header);	
	}
	table_header.appendTo(jtable);
}

_myJobObj.initTableBody = function(jtable,bitem){
	// TODO 表格的body
	for(var i=0;i<bitem.length;i++){		
		var table_body = $('<tr></tr>');		
		var col1 = $('<td>'+bitem[i].id+'</td>').appendTo(table_body);
	
		var col2 = $('<td>'+bitem[i].jobname+'</td>').appendTo(table_body);	
		var col3 = $('<td>'+bitem[i].customname+'</td>').appendTo(table_body);
		var col4 = $('<td>'+bitem[i].status+'</td>').appendTo(table_body);		
		var col5 = $('<td>'+bitem[i].price+'</td>').appendTo(table_body);	
		var col6 = $('<td>'+bitem[i].createtime+'</td>').appendTo(table_body)
		var col7 = $('<td></td>');		
		var button = $('<input type="button" value="详细"/>');
		button.appendTo(col7);
		// 绑定 详细 click 事件
		button.click(_myJobObj.detail);
		// 绑定 一行 click 事件
		//table_body.click(_myJobObj.detail);
		col7.appendTo(table_body);		
		table_body.appendTo(jtable);
	}
}
_myJobObj.initTaskBody = function(jtable,bitem){
		// TODO 表格的body
	for(var e in bitem){
		var eli = bitem[e];
		var eli = bitem['a'];
		var table_body = $('<tr></tr>');		
		var col1 = $('<td>'+eli.id+'</td>').appendTo(table_body);
	
		var col2 = $('<td>'+eli.jobname+'</td>').appendTo(table_body);	
		var col3 = $('<td>'+eli.customname+'</td>').appendTo(table_body);
		var col4 = $('<td>'+eli.status+'</td>').appendTo(table_body);		
		var col5 = $('<td>'+eli.price+'</td>').appendTo(table_body);		
		table_body.appendTo(jtable);
	}
}
// job的详细信息
_myJobObj.detailTable = function(item){
	var table = $('#detailjobtable');	
	_myJobObj.initTableHeader(table,_myJobObj.JobList.taskheader);
	_myJobObj.initTaskBody(table,_myJobObj.JobList.task);
	_myJobObj.detailTableInit = true;
}
// 详细按钮
_myJobObj.detail = function(src){
	if(!_myJobObj.detailTableInit){				
		_myJobObj.detailTable();
	}
	$('#modalbackdropfalse').modal({
		backdrop:false,
		keyboard:true,
		show:true
	});	
}

_myJobObj.createJobTable = function(item){
	var table = $('#alljobtable');			
	_myJobObj.initTableHeader(table,item.header);
	_myJobObj.initTableBody(table,item.item);
}

_myJobObj.allJobPreview = function(data){
	// 总的项目信息
	var creatingjob = $('#myjobsum');
	creatingjob.append('创建完成的项目: ');
	creatingjob.append('<br>');
	creatingjob.append('<br>');
	creatingjob.append('正在创建中的项目: ');	
}

_myJobObj.jobPreview = function(data){
	// 具体某个项目的预览
	var jobpreview = $('#jobpreview');
	jobpreview.append('项目id: ');
	jobpreview.append('<br>');
	jobpreview.append('<br>');
}

$(document).ready(
	function(){		
		// TODO 从服务器获取任务信息
		var myalljob = _myJobObj.getMyJob();
		// 所有job的一些预览信息
		_myJobObj.allJobPreview();
		// // 构建job列表

		_myJobObj.createJobTable(myalljob);
		// // 第一个job的预览信息
		// _myJobObj.jobPreview();
	}
);		