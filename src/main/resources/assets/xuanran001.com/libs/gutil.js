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

/**
 *  Gutil保存了未分类的函数集。
 */

var Gutil;

// start Gutil code scope
(function() {

//兼容其它名称空间给出的Gutil
if(!Gutil)
    Gutil = new Object();

/*****************************私有方法*************************************/    

/**@brief createOnJcr :  在jcr 中创建节点、添加属性、修改属性
    @param args : json 格式参数
        @code{.js}
            var args = {
                url : "", // /content/modellib 
                properties : { // 属性
                    resourceName : "test",
                    age : 18
                },
                success : function(data){},// 成功的回调函数
                failed : function(){},//失败调用的回调函数，可以有也可以没有                      
            }
        @endcode
**/
function createOnJcr(args){
    // 参数判断
    if(!args){
        throw "Gutil.createOnJcr ERROR: args is undefined!"
    }
    if(!args["url"]){
        throw "Gutil.createOnJcr ERROR: args.url is undefined!"
    }
    var url = args["url"];

    if(!args["properties"]){

        var properties = {};
    }else{

        var properties = args["properties"];
    }
    
    var content = {};
    content["_charset_"] = "UTF-8";
    content[":operation"] = "import";
    content[":contentType"] = "json";
    content[":content"] = JSON.stringify(properties);
    content[":replaceProperties"] = true;
  
    $.ajax(url, {
        dataType : "text",
        type : "POST",
        data: content
    })
    .done(function(data, textStatus, jqXHR){
        if(args["success"] && typeof args["success"] == "function"){
            args["success"](data, textStatus, jqXHR);
            return;
        }
    })
    .fail(function(jqXHR, textStatus){
        if(args["failed"] && typeof args["failed"] == "function"){
            args["failed"](jqXHR, textStatus);
            return;
        }
        throw "Gutil.createOnJcr ERROR: " + jqXHR;
    }); 
}

/*****************************公共方法*************************************/

/**@brief Gutil.createNode :  在jcr 中创建节点
    @param args : json 格式参数
        @code{.js}
            var args = {
                url : "", // /content/modellib 
                properties : { // 属性
                    resourceName : "test",
                    age : 18
                },
                success : function(data){},// 成功的回调函数
                failed : function(){},//失败调用的回调函数，可以有也可以没有                      
            }
        @endcode
**/
Gutil.createNode = function(args){
    createOnJcr(args);
}

/**@brief Gutil.updateNode :  修改节点的属性
    @param args : json 格式参数
        @code{.js}
            var args = {
                url : "", // /content/modellib 
                properties : { // 属性
                    resourceName : "test",
                    age : 18
                },
                success : function(data){},// 成功的回调函数
                failed : function(){},//失败调用的回调函数，可以有也可以没有                      
            }
        @endcode
**/
Gutil.updateNode = function(args){
    createOnJcr(args);
}

/**@brief Gutil.deleteNode :  在jcr 中删除节点
    @param args : json 格式参数
        @code{.js}
            var args = {
                url : "", // /content/modellib 
                success : function(data){},// 成功的回调函数
                failed : function(){},//失败调用的回调函数，可以有也可以没有                      
            }
        @endcode
**/
Gutil.deleteNode= function(args){

     // 参数判断
    if(!args){
        throw "Gutil.deleteNode ERROR: args is undefined!"
    }
    var url = args["url"];
    var properties = [];
    // properties = args["properties"];
    
    var content = {};
    content["_charset_"] = "UTF-8";
    content[":operation"] = "delete";
    // content[":applyTo"] = [];
    
    // var key;
    // for (key in properties) {
    //     if (key != "hasObject" && properties[key]) {
    //         content[":applyTo"].push(properties[key]);
    //     }
    // }
    // console.log(content[":applyTo"]);
    $.ajax(url, {
        dataType : "text",
        type : "POST",
        data: content
    })
    .done(function(data, textStatus, jqXHR){
        if(args["success"] && typeof args["success"] == "function"){
            args["success"](data);
            return;
        }
    })
    .fail(function(jqXHR, textStatus){
        if(args["failed"] && typeof args["failed"] == "function"){
            args["failed"](jqXHR, textStatus);
            return;
        }
        throw "Gutil.deleteNode ERROR: " + jqXHR;
    }); 
}

/**@brief Gutil.uploadFile : 向jcr 中上传文件
   @param formId : 上传表单的id
   @param url ： 上传表单的action
   @param callback ： 成功的回调函数
**/
Gutil.uploadFile = function(formId, url, callback){
    
    var options = {
        url : url,
        cache : false,
        success : function(){
           callback();
        },
        error : function(){
            alert("上传失败");
        }
    };
    $(formId).ajaxForm(options);
    $(formId).submit();
}

/**@brief Gutil.sortNode : jcr　中节点的排序
    @param args : json 格式参数
        @code{.js}
            var args = {
                url : "", // /content/modellib ，这是要排序的某个节点
                order : "first", // 排序的方式，参考 http://sling.apache.org/documentation/bundles/manipulating-content-the-slingpostservlet-servlets-post.html#order
                success : function(data){},// 成功的回调函数
                failed : function(){},//失败调用的回调函数，可以有也可以没有                      
            }
        @endcode
**/
Gutil.sortNode = function(args){
   
    // 参数判断
    if(!args){
        throw "Gutil.sortNode ERROR: args is undefined!"
    }
    if(!args["url"]){
        throw "Gutil.sortNode ERROR: args.url is undefined!";
    }
    if(!args["order"]){
        throw "Gutil.sortNode ERROR: args.order is undefined!";
    }

    var url = args["url"];
    var order = args["order"];

    var properties = {
        ":order" : order
    }
    
    $.ajax(url, {
        dataType : "text",
        type : "POST",
        data: properties
    })
    .done(function(data, textStatus, jqXHR){
        if(args["success"] && typeof args["success"] == "function"){
            args["success"](data, textStatus, jqXHR);
            return;
        }
    })
    .fail(function(jqXHR, textStatus){
        if(args["failed"] && typeof args["failed"] == "function"){
            args["failed"](jqXHR, textStatus);
            return;
        }
        throw "Gutil.sortNode ERROR: " + jqXHR;
    }); 
}
// end Gutil code scope 
})();