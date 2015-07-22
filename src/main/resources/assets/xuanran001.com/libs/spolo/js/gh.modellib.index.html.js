        $().ready(function(){
			//判断用户是否登录
			SpoloGutil.preloginChecker();
			//页面基本配置,包含页面的分页等全局数据
			var PageInfo={
				"currentPageNumber":1,
				"totalPageNumber":1,
				"onePageItemNumber":32,
				"categoryData":{},
				"selectedModels":{}
			};
			
			/**分类数据获取的等待提示控制
			*/
			function hideCategory_Loading(){
				$("#category_loading").fadeOut();
			}
			/**items数据获取的等待提示控制
			*/
			function hideItems_Loading(){
				$("#items_loading").fadeOut();
			}
			function showItems_Loading(){
				$("#itemsList").html("");
				$("#items_loading").fadeIn();
			}
			/**下载时的遮罩显示控制
			*/
			function downloadingMask_toggle(){
				$("#downloading").css("height",$(".mybody").css("height"));
				$("#downloading").toggle();
			}
			//===================================分类数据显示======================================
			/**隐藏分类列表视图
			*/
			function hideCategoryView(){
				$("#CategoryView").animate({height: 'toggle'});
			}
			/**显示分类列表视图
			*/
			function showCategoryView(){
				$("#CategoryView").animate({height: 'toggle'});
			}
			/**初始化分类列表视图
			*/
			function initCategoryView(categoryData){
				PageInfo.categoryData = categoryData;
				var innerHtml = "";
				for(var i=0;i<categoryData.length;i++){
					innerHtml = innerHtml+createACategoryDom(categoryData[i]);
				}
				innerHtml = innerHtml + '<div style="clear:both;"></div>';
				$CategoryView = $("#CategoryView");
				$CategoryView.html(innerHtml);
				//为按钮添加监听
				$("input",$CategoryView).change(function(e){
					PageInfo.currentPageNumber = 1;
					updateSelectedCategoryView();
					queryData();
				});
			}
			/**dotjs生成的方法 创建一个分类dom元素,dotjs脚本如下:
			<div style="border-bottom: 1px solid #ddd;">
				<div class="cat_head" path="{{=it.path}}" isradio="{{=it.isradio}}">
					<span class="note_bold">{{=it.resourceName}}</span>
				</div>
				<div class="cat_body" path="{{=it.path}}" style="max-height:135px;overflow:auto;height:auto;">
					{{? it.isradio==='true' }}
						<div style="color: rgb(245, 49, 49);font-weight: bold;display: inline;width: 135px;height: 35px;padding: 5px 0px;float: left;margin-right: 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							<input type="radio" id="{{=it.path}}" name="{{=it.path}}" value="all" checked="checked"/>
							<label for="{{=it.path}}" >无选项</label>
						</div>
					{{?}}
					{{ for(var index=0;index<it.catData.length;index++) { }}
						<div style="display: inline;width: 135px;height: 35px;padding: 5px 0px;float: left;margin-right: 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							{{? it.isradio==='true' }}
							<input type="radio" id="{{=it.catData[index].path}}" name="{{=it.path}}" value="{{=it.catData[index].path}}" cname="{{=it.catData[index].resourceName}}"/>
							{{??}}
							<input type="checkbox" id="{{=it.catData[index].path}}" name="{{=it.path}}" value="{{=it.catData[index].path}}" cname="{{=it.catData[index].resourceName}}"/>
							{{?}}
							<label for="{{=it.catData[index].path}}" >{{=it.catData[index].resourceName}}</label>
						</div>
					{{ } }}
				</div>
				<div style="clear:both;"></div>
			</div>
			*/
			function createACategoryDom(it /**/) { var out='<div style="border-bottom: 1px solid #ddd;"><div class="cat_head" path="'+(it.path)+'" isradio="'+(it.isradio)+'"><span class="note_bold">'+(it.resourceName)+'</span></div><div class="cat_body" path="'+(it.path)+'" style="max-height:135px;overflow:auto;height:auto;">';if(it.isradio==='true'){out+='<div style="color: rgb(245, 49, 49);font-weight: bold;display: inline;width: 135px;height: 35px;padding: 5px 0px;float: left;margin-right: 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><input type="radio" id="'+(it.path)+'" name="'+(it.path)+'" value="all" checked="checked"/><label for="'+(it.path)+'" >无选项</label></div>';} for(var index=0;index<it.catData.length;index++) { out+='<div style="display: inline;width: 135px;height: 35px;padding: 5px 0px;float: left;margin-right: 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">';if(it.isradio==='true'){out+='<input type="radio" id="'+(it.catData[index].path)+'" name="'+(it.path)+'" value="'+(it.catData[index].path)+'" cname="'+(it.catData[index].resourceName)+'"/>';}else{out+='<input type="checkbox" id="'+(it.catData[index].path)+'" name="'+(it.path)+'" value="'+(it.catData[index].path)+'" cname="'+(it.catData[index].resourceName)+'"/>';}out+='<label for="'+(it.catData[index].path)+'" >'+(it.catData[index].resourceName)+'</label></div>'; } out+='</div><div style="clear:both;"></div></div>';return out; }
			
			//===================================模型数据显示=============================================
			/**初始化模型数据列表视图
			*/
			function initItemsView(itemsData){
				updatePageNumber(itemsData.totalNum);
				$("#itemsList").html(createAItemsDom(itemsData.data));
				$ItemsList = $("#itemsList");
				//为按钮添加监听
				$("a[name='downloadA']",$ItemsList).click(function(e){
					var currentNode = $(this);
					console.log(currentNode.attr("value"));
					
					$("div[name='selectedPic']",currentNode).toggle();
					var sp_checkBox = $("img[name='selectTag']",currentNode);
					if(!PageInfo.selectedModels[currentNode.attr("value")]){
						PageInfo.selectedModels[currentNode.attr("value")] = true;
						sp_checkBox.attr("src","/sites/default/files/xuanran001_s_gh_modellib_selectedBtn.jpg");
					}else{
						delete PageInfo.selectedModels[currentNode.attr("value")];
						sp_checkBox.attr("src","/sites/default/files/xuanran001_s_gh_modellib_selectBtn.jpg");
					}
				});
			}
			/**该方法为 createAItemsDom() 服务，日期格式转换为yyyy:mm:dd
			*/
			function formatDate(date){
				 var str = date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日";
				 return str;
			}
			/**dotjs生成的方法 创建一个模型信息的dom元素,使用dotjs
			{{~it :value:index}}
				<div class="waterfall_picList" style="position: relative;">
					<a href="javaScript:void(0)" name="downloadA" id="{{=value.uuid}}" value="{{=value.uuid}}">
						<div style="display: block;width: 24px;height: 24px;cursor: pointer;position: absolute;top: 176px;right: 11px;z-index: 2;opacity: .9;">
							<img src="/sites/default/files/xuanran001_s_gh_modellib_{{=(PageInfo.selectedModels[value.uuid]?'selected':'select')}}Btn.jpg" name="selectTag">
						</div>
						<div class="waterfall_picThumbnail">
							<img src="{{="/userdata/shmodellib/"+value.nodeName+".image"}}">
						</div>
						<div style="width: 50px;height: 50px;background: url('/sites/default/files/xuanran001_s_gh_modellib_selected.png') no-repeat;position: absolute;left: 20px;top: 20px;z-index: 1;cursor: pointer;opacity: 0.5;display:{{=(PageInfo.selectedModels[value.uuid]?'block':'none')}};" name="selectedPic" style="display: block;">
						</div>
					</a>
					<div class="waterfall_picDescription">
						<p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">名称：{{=value.resourceName}}</p>
						<p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">时间：{{=formatDate(new Date(value.publishDate))}}</p>
						<p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">品牌：{{=value.company?value.company:'飞鹿体验'}}</p>
					</div>
				</div>
			{{~}}
			<div style="clear:both;"></div>
			*/
			function createAItemsDom(it /**/) { var out='';var arr1=it;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<div class="waterfall_picList" style="position: relative;"><a href="javaScript:void(0)" name="downloadA" id="'+(value.uuid)+'" value="'+(value.uuid)+'"><div style="display: block;width: 24px;height: 24px;cursor: pointer;position: absolute;top: 176px;right: 11px;z-index: 2;opacity: .9;"><img src="/sites/default/files/xuanran001_s_gh_modellib_'+((PageInfo.selectedModels[value.uuid]?'selected':'select'))+'Btn.jpg" name="selectTag"></div><div class="waterfall_picThumbnail"><img src="'+("/userdata/shmodellib/"+value.nodeName+".image")+'"></div><div style="width: 50px;height: 50px;background: url(\'/sites/default/files/xuanran001_s_gh_modellib_selected.png\') no-repeat;position: absolute;left: 20px;top: 20px;z-index: 1;cursor: pointer;opacity: 0.5;display:'+((PageInfo.selectedModels[value.uuid]?'block':'none'))+';" name="selectedPic" style="display: block;"></div></a><div class="waterfall_picDescription"><p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">名称：'+(value.resourceName)+'</p><p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">时间：'+(formatDate(new Date(value.publishDate)))+'</p><p style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">品牌：'+(value.company?value.company:'飞鹿体验')+'</p></div></div>';} } out+='<div style="clear:both;"></div>';return out; }
			
			//===============================页码显示==========================================
			function updatePageNumber(totalNumber){
				if(totalNumber <= 0){
					totalNumber = 1;
				}else{
					totalNumber = (totalNumber%PageInfo.onePageItemNumber===0)?(totalNumber/PageInfo.onePageItemNumber):(parseInt(totalNumber/PageInfo.onePageItemNumber)+1);
				}
				PageInfo.totalPageNumber = totalNumber;
				$("#topPageNumber").html(PageInfo.currentPageNumber+"/"+PageInfo.totalPageNumber);
				$("#bottomPageNumber").html(PageInfo.currentPageNumber+"/"+PageInfo.totalPageNumber);
			}
			function prePage(){
				if(PageInfo.currentPageNumber <= 1){
					alert("已经是第一页");
				}else{
					PageInfo.currentPageNumber--;
					queryData();
				}
			}
			function nextPage(){
				if(PageInfo.currentPageNumber>=PageInfo.totalPageNumber){
					alert("已经是最后一页");
				}else{
					PageInfo.currentPageNumber++;
					queryData();
				}
			}
			function lockPageControl(){
				$("#bottom_pre").prop('disabled',true);
				$("#top_pre").prop('disabled',true);
				$("#bottom_next").prop('disabled',true);
				$("#top_next").prop('disabled',true);
			}
			function unlockPageControl(){
				$("#bottom_pre").prop('disabled',false);
				$("#top_pre").prop('disabled',false);
				$("#bottom_next").prop('disabled',false);
				$("#top_next").prop('disabled',false);	
			}
			//==================================已选择的分类视图显示=============================
			function updateSelectedCategoryView(){
				var data = getAllSelectedCategoryData();
				var str = "";
				for(var CatgrayName in data){
					str = str+'<span style="margin: 3px 3px;color: rgb(0, 0, 0);background-color: rgb(248, 145, 145);padding: 6px;border-radius: 7px;display: inline-block;">';
					for(var i=0;i<data[CatgrayName].length;i++){
						if(i<(data[CatgrayName].length-1)){
							str = str + data[CatgrayName][i].name + ",";
						}else{
							str = str + data[CatgrayName][i].name;
						}
					}
					str= str+"; </span>";
				}
				$("#selectedCategoryView").html(str);
			}
			function getAllSelectedCategoryData(){
				var data = {};
				var allInputDom = $("input",$("#CategoryView"));
				for(var index=0; index<allInputDom.length;index++ ){
					$input = $(allInputDom[index]);
					if($input.prop("checked") && $input.prop("value")!="all"){
						var catgray = {"name":$input.attr("cname"),"value":$input.attr("value")}
						if(data[$input.attr("name")]){
							data[$input.attr("name")].push(catgray);
						}else{
							data[$input.attr("name")] = [catgray]
						}
						
					}
				}
				return data;
			}
			//=================================页面按钮监听======================================
			//分类显示
			$("#CategoryViewSwitch").click(function(){
				if($(this).prop("value")==="on"){
					$(this).prop("value","off")
					$("#CategoryViewSwitch_info").html("展开分类");
					hideCategoryView();
				}else{
					$(this).prop("value","on")
					$("#CategoryViewSwitch_info").html("收起分类");
					showCategoryView();
				}
			});
			//页码
			$("#bottom_pre").click(function(){
				prePage();
			});
			$("#top_pre").click(function(){
				prePage();
			});
			$("#bottom_next").click(function(){
				nextPage();
			});
			$("#top_next").click(function(){
				nextPage();
			});
			//搜索
			$("#searchKeyWord").click(function(){
				//获取关键字
				var keyWord = $.trim($("#searchTxt").val());
				if(keyWord && keyWord!=""){
					PageInfo.searchKeyWord = keyWord;
				}else if(PageInfo.searchKeyWord){
					delete PageInfo.searchKeyWord;
				}
				queryData();
			});

			//推出登录
			function _disconnection(scb,ecb){                       
					var opt = {};
					opt.url='/user/logout';
					opt.success=scb;
					opt.error=ecb;
					$.ajax(opt);
			}
            $('#logoff').click(function(){         
				var exitcbk = function(){window.top.close();}
				_disconnection(exitcbk,exitcbk);                        
			});
			$('#logout').click(function(){                 
				try{
					var reft = function(){window.location.href='/gh/login.html';}
					_disconnection(reft,reft);
				}catch(e){
					console.log("log failed");
				}
			}); 

			//下载
			$("#download").click(function(){
				//开始下载
				var url = "/userdata/shmodellib";
				var param = {};
				param.type = "furniture";
				param.data = [];
				for(var uuid in PageInfo.selectedModels){
					if(PageInfo.selectedModels[uuid]===true){
						param.data.push({"uuid":uuid});
					}
				}
				if(param.data.length===0){
					alert("请选择要下载的模型");
				}else{
					console.log(param);
					downloadingMask_toggle();
					gutil.download(url, param, 
						function(ret) {
							downloadingMask_toggle();
							console.log(ret);
						}
					);
				}
			});
			//=======================================获取 数据 的回调函数=============================================
			/**数据初始化回调
			*/
			var	dataInit_callback = function(data){
				//停止等待提示
				hideCategory_Loading();
				hideItems_Loading();
				//判断数据是否返回成功
				if(data){
					if(data.initData.success===true || data.initData.success=="true"){
						initCategoryView(data.initData.categoryData);
						initItemsView(data.initData.itemsData);	
						var userInfoDiv = document.getElementById("userInfo");
						userInfoDiv.innerHTML = "当前用户："+data.initData.nickName;
						return;
					}
				}
				//TODO 获取数据错误提示
				console.log("数据获取失败");
			}
			/**数据更新回调
			*/
			var	updateItems_callback = function(data){
				//停止等待提示
				hideItems_Loading();
				//解说页码按钮
				unlockPageControl();
				//判断数据是否返回成功
				if(data){
					if(data.initData.success===true || data.initData.success=="true"){
						initItemsView(data.initData.itemsData);
						return;
					}
				}
				//TODO 获取数据错误提示
				console.log("数据获取失败");
				
			}
			//======================================获取查询条件方法============================================
			function getAllQueryParams(){
				
				var queryParams = {
						"by": "publishDate",
						"limit": PageInfo.onePageItemNumber,
						"offset": ((PageInfo.currentPageNumber-1)*PageInfo.onePageItemNumber),
						"order": "des",
						"type": "model"
				};
				//获取关键字
				if(PageInfo.searchKeyWord && PageInfo.searchKeyWord!=""){
					queryParams["0_resourseName"]	=PageInfo.searchKeyWord;
					queryParams["0_keyInfo"]		=PageInfo.searchKeyWord;
					queryParams["0_introduction"]	=PageInfo.searchKeyWord;
				}
				//添加分类
				var catData = getAllSelectedCategoryData();
				for(var CatgrayName in catData){
					if(C_Map[CatgrayName]){
						queryParams["1_"+C_Map[CatgrayName].key] = "";
						for(var i=0;i<catData[CatgrayName].length;i++){
							if(i<(catData[CatgrayName].length-1)){
								queryParams["1_"+C_Map[CatgrayName].key] = queryParams["1_"+C_Map[CatgrayName].key] + catData[CatgrayName][i].value+";";
							}else{
								queryParams["1_"+C_Map[CatgrayName].key] = queryParams["1_"+C_Map[CatgrayName].key]  + catData[CatgrayName][i].value;
							}
						}
						
					}
				}
				console.log(queryParams)
				return queryParams;
			}
			//======================================ajax更新数据代码============================================
			function queryData(){
				//显示等待提示
				showItems_Loading();
				//锁定页码按钮
				lockPageControl();
				var content = getAllQueryParams()
				var options = {
					url : "/userdata/shmodellib/queryData",
					data: content,
					//initData
					// url : "/userdata/roomlib/initData",
					cache : false,
					dataType : "json",
					success : function(data){
						data = $.parseJSON(data);
						console.log(data);
						updateItems_callback(data);						
					},
					error : function(e){
						console.log(e);
						updateItems_callback();
					}
				};
				$("#formTest").ajaxForm(options);
				$("#formTest").submit();
			}
			
			
			function initDate(){
				var options = {
					//queryData
					url : "/userdata/shmodellib/initData",
					data: {
						by: "publishDate",
						limit: PageInfo.onePageItemNumber,
						offset: 0,
						order: "des"
					},
					//initData
					// url : "/userdata/roomlib/initData",
					cache : false,
					dataType : "json",
					success : function(data){
						data = $.parseJSON(data);
						console.log(data);
						dataInit_callback(data);						
					},
					error : function(e){
						console.log(e);
						dataInit_callback();
					}
				};
				$("#formTest").ajaxForm(options);
				$("#formTest").submit();
			}
			
			initDate();
			
			//===========================分类属性 和 模型数据上的属性对应表===============================
			var C_Map={
				"/content/modellibcategory/modelsort":{
					"name":"种类",
					"key":"sortPath"
				},
				"/content/modellibcategory/modelbrand":{
					"name":"品牌",
					"key":"brandPath"
				},
				"/content/modellibcategory/room":{
					"name":"空间",
					"key":"roomPath"
				},
				"/content/modellibcategory/modelstyle":{
					"name":"风格",
					"key":"stylePath"
				},
				"/content/modellibcategory/placeOfProduction":{
					"name":"产地",
					"key":"placeOfProductionPath"
				},
				"/content/modellibcategory/modelmadeof":{
					"name":"材质",
					"key":"madeOfPath"
				},
				"/content/modellibcategory/colorSystem":{
					"name":"色系",
					"key":"colorSystemPath"
				}
			};
        });