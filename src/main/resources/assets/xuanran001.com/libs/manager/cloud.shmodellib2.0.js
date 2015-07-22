	console.log("begin load page js");
		//页面就绪
		var static_data = new Object();
		var roomCatch = new Object();
		var currentRoom = new Object();
		var currentUuid = "";
		//筛选结果 
		var areaData = new Object();
		var roomData = new Object();
		var styleData = new Object();
		var colorData = new Object();
		var brandData = new Object();
		var madeofData = new Object();
		var sortData = new Object();
		var placeofData = new Object();
		var oneCategoryData = new Object();
		var area = "";
		var room = "";
		var style = "";
		var color = "";
		var brand = "";
		var madeof = "";
		var sort = "";
		var placeof = "";
		var order = "des";
		var searchTerm = "";
		var ClickNum = 1;
		var OriMolNum = 32;
		var pagestart = 0;

		$().ready(function() {
			console.log("ready functioni");
			//页面第一次加载
			loadInitData();
			//添加页面按钮事件
			addIseditAction();
			addNextPageAction();
			addPrePageAction();
			addOrderDateAction();
			addDisplayCategoryAction();
			addSearchAction();
			addUpdataAction();
		});

		//添加按照时间排序按钮的事件
		function addOrderDateAction() {
			$("#orderDateDes").click(function() {
				ClickNum = 1;
				order = "asc";
				$("#orderDateDes").css("display", "none");
				$("#orderDateAsc").css("display", "block");
				$("#items").html("<div class='ball1'></div>");
				sendAjax();
			});
			//点击按时间正序排序
			$("#orderDateAsc").click(function() {
				ClickNum = 1;
				order = "des";
				$("#orderDateAsc").css("display", "none");
				$("#orderDateDes").css("display", "block");
				$("#items").html("<div class='ball1'></div>");
				sendAjax();
			});
		}

		//编辑模式按钮事件
		function addIseditAction() {
			$("#isedit").click(function() {
				if ($(this).attr("class") == "button medium turquoise") {
					$("button").each(function() {
						if ($(this).attr("tag") == "deletebutton") {
							$(this).css("display", "inline");
						}
					});
					$(this).attr("class", "button medium brown")
				} else if ($(this).attr("class") == "button medium brown") {
					$("button").each(function() {
						if ($(this).attr("tag") == "deletebutton") {
							$(this).css("display", "none");
						}
					});
					$(this).attr("class", "button medium turquoise");
				}
			});
		}

		//添加展开分类事件
		function addDisplayCategoryAction() {
			$("#displaycategory").click(function() {
				$("#categoryParentDiv").slideToggle("slow", toggleCallback);
			});
		}
		//slideToggle回调函数
		function toggleCallback() {
			if ($("#categoryParentDiv").css("display") == "none") {
				$("#displaycategory").html("展开分类");
			}
			if ($("#categoryParentDiv").css("display") == "block") {
				$("#displaycategory").html("收起分类");
			}
		}

		//添加下一页按钮事件
		console.log("addNextPageAction")
		function addNextPageAction() {
			$("#next").click(
					function() {
						ClickNum = ClickNum + 1;
						var success = function(data) {
							$("#back-top")[0].click();
							////console.log(data);
							data = JSON.parse(data);
							if (data.queryData) {
								checkSuccess("queryData", data);
							} else {
								checkSuccess("initData", data);
							}
							loadPage(data);
						};
						var error = function() {
							console.log("获取数据失败");
						};
						sendRequest("/userdata/shmodellib/queryData",
								definePageData(), success, error);
					});
		}
		console.log("addPrePageAction")
		function addPrePageAction() {

			$("#prev").click(
					function() {
						ClickNum = ClickNum - 1;
						var success = function(data) {
							$("#back-top")[0].click();
							data = JSON.parse(data);
							if (data.queryData) {
								checkSuccess("queryData", data);
							} else {
								checkSuccess("initData", data);
							}
							loadPage(data);
						};

						var error = function() {
							console.log("获取数据失败");
						};
						sendRequest("/userdata/shmodellib/queryData",
								definePageData(), success, error);
					});
		}

		function addSearchAction() {
			$("#searchBtn").click(function() {
				ClickNum = 1;
				order = "des";
				searchTerm = $("#searchTxt").val();
				$("#orderDateAsc").css("display", "none");
				$("#orderDateDes").css("display", "block");
				$("#items").html("<div class='ball1'></div>");
				sendAjax();
			});
		}

		// 检查Success信息
		function checkSuccess(string, data) {
			if (typeof (data) == "string") {
				data = JSON.parse(data);
			}
			console.log(data);
			if (data.Success) { // TODO 修改修改哈
				console.error("【checkSuccess --> " + string + "】" + "检查到Success");
				return;
			}
			if (data[string]["success"]) {
				console.error("【checkSuccess --> " + string + "】" + "检查到success");
				return;
			}
			console.error("【checkSuccess --> " + string + "】"
					+ "没有检查到Success、success，或值为false");
		}

		console.log("loadQuryData");
		function loadQuryData() {
			var requestdata = {
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "model",
				isMananger : "true",
			};
			var success = function(data) {
				data = JSON.parse(data);
				if (data.queryData) {
					checkSuccess("queryData", data);
				} else {
					checkSuccess("initData", data);
				}
				loadPage(data);
			};
			var error = function() {
				console.log("数据获取失败");
			};
			sendRequest("/userdata/shmodellib/queryData", requestdata, success,
					error);
		}

		console.log("loadInitData");
		function loadInitData() {
			console.log("loadInitData");
			var success = function(data) {
				checkSuccess("initData", data);
				static_data = JSON.parse(data);
				var initdata = static_data.initData;
				var categoryDiv = document.getElementById("categorydiv");
				categoryDiv.innerHTML = category(initdata);
				oneCategoryData = static_data.initData.categoryData;
				roomData = oneCategoryData[0].catData;
				styleData = oneCategoryData[1].catData;
				colorData = oneCategoryData[2].catData;
				brandData = oneCategoryData[3].catData;
				madeofData = oneCategoryData[4].catData;
				sortData = oneCategoryData[5].catData;
				placeofData = oneCategoryData[6].catData;
				displayCategory();
				loadPage(static_data);
			};
			var error = function() {
				console.log("数据获取失败");
			};
			var requestdata = {
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "model",
			};
			sendRequest("/userdata/shmodellib/initData", requestdata, success,
					error);
		}

		function generate(text, type) {
			var n = noty({
				text : text,
				type : type,
				dismissQueue : true,
				layout : 'topCenter',
				theme : 'defaultTheme',
				timeout : 1000,
				maxVisible : 1
			});
		}

		//动态创建模型显示DIV
		function singleRoom(it /**/
		) {
			roomCatch[it.uuid] = it;
			////console.log(roomCatch[it.uuid]);
			//var Pos = (it.publishDate).indexOf("T");
			var Time = (it["jcr:created"]).substring(0, 10);
			var ispublish = "";
			var isPublishTag = "";
			var Published = it.published;
			var Author = emailDecode(it["author"]);
			if (Published == "true") {
				ispublish = "取消发布";
			}
			if (Published == "false") {
				ispublish = "发布 "
				isPublishTag = "(未发布)";
			}

			var out = '<article class="four columns isotope-item" > <div class="preloader">'
					+ '<a class="bwWrapper single-image plus-icon"  rel="folio">'
					+ '<figure style="height: 220px;width: 220px"><img style="height: 220px;width: 220px" class="fadein" alt="" src="'
					+ ("/userdata/shmodellib/" + it.nodeName + ".image")
					+ '" id="imginfo"  tag='
					+ it.uuid
					+ '><\/figure> <\/a><\/div> <a class="project-meta" href="#" > '
					+ '<h6 class="title" style="float:left;padding-left: 14px;">名称：'
					+ (it.resourceName)
					+ isPublishTag
					+ '<\/font><\/p>'
					+ '<\/h6>'
					+ '<a class="project-meta" href="#">'
					+ '<h6 class="title" style="float:left;padding-left: 14px;">时间：'
					+ Time
					+ '<\/p> '
					+ '<\/h6>'
					+ '<a class="project-meta" href="#" >'
					+ '<h6 class="title" style="float:left;padding-left: 14px;">作者：'
					+ Author + '<\/h6> ' + '<\/a>';
			if (static_data.initData.role == "admin") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/shmodellib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/shmodellib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">删除家具 <\/button>'
						+ '<\/div>';
			} else if (static_data.initData.role == "yanshou"
					&& Published == "false") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/shmodellib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/shmodellib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">删除家具 <\/button>'
						+ '<\/div>';
			}
			out += '<\/div><\/article>';
			return out;
		}

		function emailDecode(email) {
			var index = email.indexOf("_");
			if (index != -1) {
				email = email.replace("_40", "@");
				email = email.substring(1, email.length);
			}
			//var index = email.indexOf("@");
			//email = email.substring(1, index);
			return email;
		}

		//动态创建页数显示DIV
		function pageNum(ClickNum, CurrNum) {
			var out = '' + ClickNum + '/' + CurrNum + '';
			return out;
		}

		//展开分类
		function categoryView() {
			$("#categoryParentDiv").animate({
				height : 'toggle'
			});
		}

		//加载页面
		function loadPage(data) {
			var Roomlib = data.initData.itemsData.data;
			var TotalNum = data.initData.itemsData.totalNum;
			var CurrNum = Math.ceil(TotalNum / OriMolNum);
			if (CurrNum == 0) {
				CurrNum = 1;
			}
			if (ClickNum < 1) {
				ClickNum = ClickNum + 1;
				return;
			}
			if (ClickNum > CurrNum) {
				ClickNum = ClickNum - 1;
				return;
			}
			$("#Roomlist").empty();
			$(".pageNum").empty();
			for ( var item in Roomlib) {
				var Roomdiv = singleRoom(Roomlib[item]);
				$("#Roomlist").append(Roomdiv);
			}
			$(".fadein").each(function() {
				$(this).mouseover(function() {
					var uuid = $(this).attr("tag");
					renderModal(uuid);
				});
			});

			$(".fadein").each(function() {
				$(this).click(function() {
					$("#detailpanel").css("display", "block")
				});
			});

			$(":button").each(
					function() {
						$(this).click(
								function() {
									currentUuid = $(this).attr("id");
									var RoomPath = $(this).attr("path");
									//console.log(RoomPath);
									var ispublish = "";
									if ($(this).attr("tag") == "true") {
										ispublish = "unpublish"
									}
									if ($(this).attr("tag") == "false") {
										ispublish = "publish"
									}
									var success = function(data) {
										data = JSON.parse(data);
										if (ispublish == "unpublish") {
											$("#" + currentUuid).attr("tag",
													"false");
											$("#" + currentUuid)
													.attr("value", "发布");
										}
										if (ispublish == "publish") {
											$("#" + currentUuid)
													.attr("tag", "true");
											$("#" + currentUuid).attr("value",
													"取消发布");
										}
									};
									var error = function() {
										console.log("数据获取失败");
									};
									var requestdata = {
										roompath : RoomPath,
										by : "publishDate",
										type : "model"
									};
									sendRequest(
											"/userdata/shmodellib/" + ispublish,
											requestdata, success, error);
								});
					});
			var Roompage = pageNum(ClickNum, CurrNum);
			$(".pageNum").append(Roompage);
		}

		var roomPath = "";
		var stylePath = "";
		var colorPath = "";
		var brandPath = "";
		var madeofPath = "";
		var sortPath = "";
		var placeofPath = "";
		var moxingpath = "";
		function renderModal(uuid) {
			//从模型数据缓存中获得鼠标当前选中的模型
			currentRoom = roomCatch[uuid];
			//定义页面元素显示的变量，以及分类信息的路径变量
			var kongjianpath = "";
			var fenggepath = "";
			var sexipath = "";
			var pinpaipath = "";
			var zhucaipath = "";
			var zhongleipath = "";
			var chandipath = "";
			var kongjian = "";
			var fengge = "";
			var sexi = "";
			var pinpai = "";
			var zhucai = "";
			var zhonglei = "";
			var chandi = "";
			////console.log(JSON.stringify(currentRoom));
			var attrvalue = "";
			//获得当前模型的分类信息
			if (currentRoom.roomPath) {
				kongjianpath = currentRoom.roomPath;
			}
			if (currentRoom.stylePath) {
				fenggepath = currentRoom.stylePath;
			}
			if (currentRoom.colorSystemPath) {
				sexipath = currentRoom.colorSystemPath;
			}
			if (currentRoom.brandPath) {
				pinpaipath = currentRoom.brandPath;
			}
			if (currentRoom.madeOfPath) {
				zhucaipath = currentRoom.madeOfPath;
			}
			if (currentRoom.sortPath) {
				zhongleipath = currentRoom.sortPath;
			}
			if (currentRoom.nodeName) {
				attrvalue = "/userdata/shmodellib/" + currentRoom.nodeName
						+ ".image";
			}
			if (currentRoom.placeOfProductionPath) {
				chandipath = currentRoom.placeOfProductionPath;
			}
			//种类在分类目录中存在二级分类，所以需要处理一下路径，这里只取了第一级分类
			var i = 0;
			for (var x = 0; x < zhongleipath.length; x++) {
				if (zhongleipath[x] == "/") {
					i++;
				}
			}
			if (i >= 5) {
				zhongleipath = zhongleipath.substring(0, zhongleipath
						.lastIndexOf("/"));
			}
			//依次获得当前模型种类的名称（resourceName）
			for (var x = 0; x < roomData.length; x++) {
				if (kongjianpath.indexOf(roomData[x].path) > -1) {
					kongjian += " " + roomData[x].resourceName;
				}
			}
			for (var x = 0; x < styleData.length; x++) {
				if (fenggepath.indexOf(styleData[x].path) > -1) {
					fengge += " " + styleData[x].resourceName;
				}
			}
			for (var x = 0; x < colorData.length; x++) {
				if (sexipath.indexOf(colorData[x].path) > -1) {
					sexi += " " + colorData[x].resourceName;
				}
			}
			for (var x = 0; x < brandData.length; x++) {
				if (pinpaipath == brandData[x].path + "") {
					pinpai = brandData[x].resourceName;
				}
			}
			for (var x = 0; x < madeofData.length; x++) {

				if (zhucaipath == madeofData[x].path + "") {
					zhucai = madeofData[x].resourceName;
				}
			}
			for (var x = 0; x < sortData.length; x++) {
				//console.log("zhucaipath1"+zhongleipath);
				//console.log("zhucaipath2"+sortData[x].path)
				if (zhongleipath == sortData[x].path + "") {
					zhonglei = sortData[x].resourceName;
				}
			}
			for (var x = 0; x < placeofData.length; x++) {
				if (chandipath.indexOf(placeofData[x].path) > -1) {
					chandi += " " + placeofData[x].resourceName;
				}
			}
			var guanjianzi = currentRoom.keyInfo;
			var mingcheng = currentRoom.resourceName;
			var xinghao = currentRoom.productmodel;
			var jiage = currentRoom.price;
			var xilie = currentRoom.series;
			var tese = currentRoom.characteristic;
			moxingpath = "/content/shmodellib/" + currentRoom.nodeName;

			//获取权限
			var Published = currentRoom.published;
			var canModify = "";
			if (static_data.initData.role == "admin") {
				console.log("admin");
				$("#savebutton").css("display", "");
				$("#updateroomli").css("display", "");
				document.getElementById("savebutton").onclick = save;
			} else if (static_data.initData.role == "yanshou") {
				console.log("yanshou");
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (static_data.initData.role == "art" && Published == "true") {
				console.log("art and published");
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (static_data.initData.role == "art" && Published == "false") {
				console.log("art and unpublished");
				$("#savebutton").css("display", "");
				$("#updateroomli").css("display", "");
				document.getElementById("savebutton").onclick = save;
			} else {
				console.log("else");
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
				$("#downloadroomli").css("display", "none");
			}
			//向modal中添加页面元素
			$("#room")
					.html(
							"<a currentvalue='"
										+ kongjianpath
										+ "' class='roomA'>空间:"
									+ kongjian + "<\/a>");
			$("#roomP").html(
					oneCategory(oneCategoryData[0], kongjianpath, canModify));
			//roomData = oneCategoryData[0].catData;

			$("#style")
					.html(
							"<a currentvalue='"
								+ fenggepath + "' class='styleA'>风格:"
									+ fengge + "<\/a>");
			$("#styleP").html(
					oneCategory(oneCategoryData[1], fenggepath, canModify));
			//styleData = oneCategoryData[1].catData;

			$("#color")
					.html(
							"<a currentvalue='"
								+ sexipath + "' class='colorA'>色系:"
									+ sexi + "<\/a>");
			$("#colorP").html(oneCategory(oneCategoryData[2], sexipath, canModify));
			//colorData = oneCategoryData[2].catData;

			$("#brand")
					.html(
							"<a currentvalue='"
								+ pinpaipath + "' class='brandA'>品牌:"
									+ pinpai + "<\/a>");
			$("#brandP")
					.html(
							twoCategory(oneCategoryData[3], pinpaipath, "pinpai",
									canModify));
			//brandData = oneCategoryData[3].catData;

			$("#madeof")
					.html(
							"<a currentvalue='"
								+ zhucaipath + "' class='madeofA'>主材:"
									+ zhucai + "<\/a>");
			$("#madeofP")
					.html(
							twoCategory(oneCategoryData[4], zhucaipath, "zhucai",
									canModify));
			//madeofData = oneCategoryData[4].catData;

			$("#sort")
					.html(
							"<a currentvalue='"
								+ zhongleipath + "' class='sortA'>种类:"
									+ zhonglei + "<\/a>");
			$("#sortP").html(
					twoCategory(oneCategoryData[5], zhongleipath, "zhonglei",
							canModify));
			//sortData = oneCategoryData[5].catData;

			$("#placeof")
					.html(
							"<a currentvalue='"
										+ chandipath
										+ "' class='placeofA'>产地:"
									+ chandi + "<\/a>");
			$("#placeofP").html(
					oneCategory(oneCategoryData[6], chandipath, canModify));
			//placeofData = oneCategoryData[6].catData;

			$("#keyinfo")
					.html(
							"<a href='#'>关键字: <\/a><input "+canModify+" class='keyinfoInput' type='text' value='"+guanjianzi+"' style='width:200px;'>");
			$("#name")
					.html(
							"<a href='#'>名称: <\/a><input "+canModify+" class='nameInput' type='text' value='"+mingcheng+"' style='width:200px;'>");
			$("#modelpath").html(
					"<a href='#'>模型地址: <\/a><p class='modelpath'>" + moxingpath
							+ "<\/p>");
			$("#imgpanel").attr("src", attrvalue);
			$("#number")
					.html(
							"<a href='#' style='width: 80px;'>家具型号: <\/a><input "+canModify+" class='numberInput' type='text' value='"+xinghao+"' style='width:200px;'>");
			$("#price")
					.html(
							"<a href='#' style='width: 80px;'>家具价格: <\/a><input "+canModify+" class='priceInput' type='text' value='"+jiage+"' style='width:200px;'>");
			$("#set")
					.html(
							"<a href='#' style='width: 80px;'>家具系列: <\/a><input "+canModify+" class='setInput' type='text' value='"+xilie+"' style='width:200px;'>");
			$("#characteristic")
					.html(
							"<a href='#' style='width: 80px;'>家具特色: <\/a><input "+canModify+" class='characteristicInput' type='text' value='"+tese+"' style='width:200px;'>");
			document.getElementById("savebutton").onclick = save;
			document.getElementById("savebutton2").onclick = save;
			//给下载模型的按钮添加下载事件
			$("#download")
					.click(
							function() {
								$(".downloadA").attr(
										"href",
										"/userdata/shmodellib/" + currentRoom.uuid
												+ ".7z");
								$(".downloadA")[0].click();
							});
			$(".roomA").click(function() {
				$("#roomPanel").css("display", "block");
			});
			$(".styleA").click(function() {
				$("#stylePanel").css("display", "block");
			});
			$(".colorA").click(function() {
				$("#colorPanel").css("display", "block");
			});
			$(".brandA").click(function() {
				$("#brandPanel").css("display", "block");
			});
			$(".madeofA").click(function() {
				$("#madeofPanel").css("display", "block");
			});
			$(".sortA").click(function() {
				$("#sortPanel").css("display", "block");
			});
			$(".placeofA").click(function() {
				$("#placeofPanel").css("display", "block");
			});

			$("#closeRoomPanel").click(function() {
				$("#roomPanel").css("display", "none");
				kongjian = "";
				for (var x = 0; x < roomData.length; x++) {
					if (roomPath.indexOf(roomData[x].path) > -1) {
						kongjian += " " + roomData[x].resourceName;
					}
				}
				$("#room > a").html("空间:" + kongjian);
				$("#room > a").attr("currentvalue", roomPath);
			});
			$("#closeStylePanel").click(function() {
				$("#stylePanel").css("display", "none");
				fengge = "";
				for (var x = 0; x < styleData.length; x++) {
					if (stylePath.indexOf(styleData[x].path) > -1) {
						fengge += " " + styleData[x].resourceName;
					}
				}
				$("#style > a").html("风格:" + fengge);
				$("#style > a").attr("currentvalue", stylePath);
			});
			$("#closeColorPanel").click(function() {
				$("#colorPanel").css("display", "none");
				sexi = "";
				for (var x = 0; x < colorData.length; x++) {
					if (colorPath.indexOf(colorData[x].path) > -1) {
						sexi += " " + colorData[x].resourceName;
					}
				}
				$("#color > a").html("色系:" + sexi);
				$("#color > a").attr("currentvalue", colorPath);
			});
			$("#closeMadeofPanel").click(function() {
				$("#madeofPanel").css("display", "none");
				zhucai = "";
				for (var x = 0; x < madeofData.length; x++) {
					if (madeofPath == madeofData[x].path) {
						zhucai = madeofData[x].resourceName;
					}
				}
				$("#madeof > a").html("主材:" + zhucai);
				$("#madeof > a").attr("currentvalue", madeofPath);
			});
			$("#closeSortPanel").click(function() {
				$("#sortPanel").css("display", "none");
				zhonglei = "";
				for (var x = 0; x < sortData.length; x++) {

					if (sortPath == sortData[x].path) {
						zhonglei = sortData[x].resourceName;
					}
				}
				$("#sort > a").html("种类:" + zhonglei);
				$("#sort > a").attr("currentvalue", sortPath);
			});
			$("#closePlaceofPanel").click(function() {
				$("#placeofPanel").css("display", "none");
				chandi = "";
				for (var x = 0; x < placeofData.length; x++) {
					if (placeofPath.indexOf(placeofData[x].path) > -1) {
						chandi += " " + placeofData[x].resourceName;
					}
				}
				$("#placeof > a").html("产地:" + chandi);
				$("#placeof > a").attr("currentvalue", placeofPath);
			});
			$("#closeBrandPanel").click(function() {
				$("#brandPanel").css("display", "none");
				pinpai = "";
				for (var x = 0; x < brandData.length; x++) {
					console.log("brandpath is " + brandPath);
					console.log("pinpai is " + brandData[x].path);
					if (brandPath == brandData[x].path) {
						pinpai = brandData[x].resourceName;
					}
				}
				$("#brand > a").html("品牌:" + pinpai);
				$("#brand > a").attr("currentvalue", brandPath);
			});
			//刷新渲染信息的数据
			if (currentRoom.selftype && currentRoom.category && currentRoom.feature
					&& currentRoom.resizable) {
				$("#selftype").val(currentRoom.selftype);
				$("#category").val(currentRoom.category);
				$("#feature").val(currentRoom.feature);
				$("#resizable").val(currentRoom.resizable);
			} else {
				$("#selftype").val(0);
				$("#category").val(0);
				$("#feature").val(0);
				$("#resizable").val(0);
			}

			//给当前模型所有的input元素添加事件
			addInputAction(currentRoom);
			//给当前模型所有的radiobutton添加事件
			addRadioAction(currentRoom);
			
		}

		//添加更新上传按钮的事件
		console.log("addUpdataAction");
		function addUpdataAction() {
			$("#update").click(
					function() {
						$('#update').hide();
						var content = JSON.stringify(moxingpath);
						var isInputFill = fileCheck();
						if (isInputFill[0]) {
							var success = function(data) {
								generate('上传成功', 'success');
								$('#update').show();
							};
							var error = function() {
								generate('上传失败', 'error');
								$('#update').show();
							};
							var requestdata = {data:content}
							sendUpdateRequest("/userdata/shmodellib/updateModel",
									requestdata, success, error);
						} else {
							alert(isInputFill[1]);
							$('#update').show();
						}
					});
		}

		//检查更新模型文件的格式
		function fileCheck() {
			var highfile = $("#high").attr("value");
			var lowfile = $("#low").attr("value");
			var prefile = $("#preview").attr("value");
			var alertContent = "";
			if (highfile == "" && lowfile == "" && prefile == "") {
				alertContent = "更新表单不能都为空！";
			} else {
				if (highfile != "") {
					var highformat = highfile.substring(
							highfile.lastIndexOf(".") + 1, highfile.length);
					if (highformat != "blend") {
						alertContent += "高模格式必须为 blend!";
					}
				}
				if (lowfile != "") {
					var lowformat = lowfile.substring(lowfile.lastIndexOf(".") + 1,
							lowfile.length);
					if (lowformat != "sh3f") {
						alertContent += "低模格式必须为sh3f!";
					}
				}
				if (prefile != "") {
					var preformat = prefile.substring(prefile.lastIndexOf(".") + 1,
							prefile.length);
					if (preformat != "jpg") {
						alertContent += "预览图的格式必须为jpg!";
					}
				}
			}
			if (alertContent == "") {
				return [ true, alertContent ];
			} else {
				return [ false, alertContent ];
			}
		}

		//点击保存按钮的时间触发函数
		console.log("save");
		function save() {
			$("#savebutton").hide();
			$("#savebutton2").hide();
			if (roomPath == "") {
				roomPath = $(".roomA").attr("currentvalue");
			}
			if (stylePath == "") {
				stylePath = $(".styleA").attr("currentvalue");
			}
			if (colorPath == "") {
				colorPath = $(".colorA").attr("currentvalue");
			}
			if (sortPath == "") {
				sortPath = $(".sortA").attr("currentvalue");
			}
			if (madeofPath == "") {
				madeofPath = $(".madeofA").attr("currentvalue");
			}
			if (placeofPath == "") {
				placeofPath = $(".placeofA").attr("currentvalue");
			}
			if (brandPath == "") {
				brandPath = $(".brandA").attr("currentvalue");
			}
			var savedata = {
				"room" : roomPath,
				"style" : stylePath,
				"color" : colorPath,
				"sort" : sortPath,
				"madeof" : madeofPath,
				"placeof" : placeofPath,
				"brand" : brandPath,
				"keyinfo" : $(".keyinfoInput").attr("value"),
				"name" : $(".nameInput").attr("value"),
				"nodepath" : $(".modelpath").html(),
				//渲染信息 
				"category" : $("#category").val(),
				"selftype" : $("#selftype").val(),
				"feature" : $("#feature").val(),
				"resizable" : $("#resizable").val(),
				"type" : 1,
				"price" : $(".priceInput").val(),
				"productmodel" : $(".numberInput").val(),
				"series" : $(".setInput").val(),
				"characteristic" : $(".characteristicInput").val(),
			};
			var success = function(data) {
				alert("保存成功");
				roomPath = "";
				stylePath = "";
				colorPath = "";
				sortPath = "";
				madeofPath = "";
				placeofPath = "";
				brandPath = "";
				$("#detailpanel").css("display", "none");
				$("#savebutton").show();
				$("#savebutton2").show();
				loadQuryData();
			};
			var error = function() {
				roomPath = "";
				stylePath = "";
				colorPath = "";
				sortPath = "";
				madeofPath = "";
				placeofPath = "";
				brandPath = "";
			};
			sendRequest("/userdata/shmodellib/saveModel", savedata, success, error);
		}
		//checkbox
		function oneCategory(it, categoryPath, canModify) {
			var out = '';
			for (var j = 0; j < it.catData.length; j++) {
				var tag = categoryPath.indexOf(it.catData[j].path) > -1 ? "checked"
						: "";
				out += '<input '
						+ canModify
						+ ' class="modify" type="checkbox" value="'
						+ (it.catData[j].path)
						+ '" '
						+ (tag)
						+ '><label style="cursor: pointer; display: inline;" title="'
						+ (it.resourceName) + '">' + (it.catData[j].resourceName)
						+ '  <\/label> ';
			}
			return out;
		}
		//radio
		function twoCategory(it, categoryPath, tag1, canModify) {
			var out = '';
			for (var j = 0; j < it.catData.length; j++) {
				var tag = categoryPath.indexOf(it.catData[j].path) > -1 ? "checked"
						: "";
				out += '<input '
						+ canModify
						+ ' class="modify" type="radio"  name="'
						+ tag1
						+ '" value="'
						+ (it.catData[j].path)
						+ '" '
						+ (tag)
						+ '><label style="cursor: pointer; display: inline;" title="'
						+ (it.resourceName) + '">' + (it.catData[j].resourceName)
						+ '  <\/label> ';
			}
			return out;
		}

		function addInputAction(currentRoom) {
			roomPath = currentRoom.roomPath;
			stylePath = currentRoom.stylePath;
			colorPath = currentRoom.colorSystemPath;
			//sortPath = currentRoom.sortPath;
			//madeofPath = currentRoom.madeOfPath;
			placeofPath = currentRoom.placeOfProductionPath;
			//brandPath = currentRoom.brandPath;
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "modify"
						&& inputcheck[i].type == "checkbox") {
					inputcheck[i].onclick = modifyListener;
				}
			}
		}

		function addRadioAction(currentRoom) {
			//roomPath = currentRoom.roomPath;
			//stylePath = currentRoom.stylePath;
			//colorPath = currentRoom.colorSystemPath;
			sortPath = currentRoom.sortPath;
			madeofPath = currentRoom.madeOfPath;
			//placeofPath = currentRoom.placeOfProductionPath;
			brandPath = currentRoom.brandPath;
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "modify"
						&& inputcheck[i].type == "radio") {
					inputcheck[i].onclick = modifyListener;
				}
			}
		}

		function modifyListener() {
			var path = this.value;
			////console.log(path);
			var parent = this.parentNode;
			createModifyInfo(parent, path, this);
		}

		function createModifyInfo(parent, path, elem) {
			if (parent.getAttribute("id") == "roomP") {
				if (elem.checked == true) {
					roomPath += path + ";";
				} else if (roomPath.length > 0) {
					roomPath = deleteSubString(roomPath, path);
				}
			} else if (parent.getAttribute("id") == "colorP") {
				if (elem.checked == true) {
					colorPath += path + ";";
					console.log(colorPath);
				} else if (colorPath.length > 0) {
					colorPath = deleteSubString(colorPath, path);
					console.log(colorPath);
				}
			} else if (parent.getAttribute("id") == "brandP") {
				if (elem.checked == true) {
					brandPath = path + ";";
					console.log("brandPaht is " + brandPath);
				} else if (brandPath.length > 0) {
					brandPath = deleteSubString(brandPath, path);
				}
			} else if (parent.getAttribute("id") == "madeofP") {
				if (elem.checked == true) {
					madeofPath = path + ";";
				} else if (madeofPath.length > 0) {
					madeofPath = deleteSubString(madeofPath, path);
				}
			} else if (parent.getAttribute("id") == "sortP") {
				if (elem.checked == true) {
					sortPath = path + ";";
				} else if (sortPath.length > 0) {
					sortPath = deleteSubString(sortPath, path);
				}
			} else if (parent.getAttribute("id") == "placeofP") {
				if (elem.checked == true) {
					placeofPath += path + ";";
				} else if (placeofPath.length > 0) {
					placeofPath = deleteSubString(placeofPath, path);
				}
			} else if (parent.getAttribute("id") == "styleP") {
				if (elem.checked == true) {
					stylePath += path + ";";
				} else if (stylePath.length > 0) {
					stylePath = deleteSubString(stylePath, path);
				}
			}

		}

		function category(it) {
			var out = '';
			if (it.success) {
				for (var i = 0; i < it.categoryData.length; i++) {
					out += '<div class="category_list" alt="'
							+ (it.categoryData[i].resourceName)
							+ '" catpath="'
							+ (it.categoryData[i].path)
							+ '" isradio="false"><div class="cat_head" path="'
							+ (it.categoryData[i].path)
							+ '" isradio="false"> <span class="note_bold">'
							+ (it.categoryData[i].resourceName)
							+ '<\/span> <\/div><div class="cat_body" path="'
							+ (it.categoryData[i].path)
							+ '" style="max-height:120px;overflow:auto;height:auto;">';
					for (var j = 0; j < it.categoryData[i].catData.length; j++) {
						out += ' <div style="padding: 2px; display: inline; width: 90px; height: 35px; padding: 5px 0px; float: left; margin-right: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"> <input class="check" type="checkbox" value="'
								+ (it.categoryData[i].catData[j].path)
								+ '"><label style="cursor: pointer; display: inline;" title="'
								+ (it.categoryData[i].resourceName)
								+ '">'
								+ (it.categoryData[i].catData[j].resourceName)
								+ '<\/label> <\/div>';
					}
					out += '<\/div><\/div>';
				}
			}
			return out;
		}

		function displayCategory() {
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "check"
						&& inputcheck[i].type == "checkbox") {
					inputcheck[i].onclick = inputListener;
				}
			}
		}

		function inputListener() {
			var path = this.value;
			////console.log(path);
			var parent = this.parentNode;
			parent = parent.parentNode;
			parent = parent.parentNode;
			createRequestInfo(parent, path, this);
			sendAjax();
		}

		//创建发送请求锁需要的数据
		function createRequestInfo(parent, path, elem) {
			if (parent.getAttribute("alt") == "空间") {
				if (elem.checked == true) {
					////console.log("checked test");
					room += path + ";";
				} else if (room.length > 0) {
					room = deleteSubString(room, path);
				}
			} else if (parent.getAttribute("alt") == "风格") {
				if (elem.checked == true) {
					style += path + ";";
				} else if (style.length > 0) {
					style = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "面积") {
				if (elem.checked == true) {
					area += path + ";";
				} else if (area.length > 0) {
					area = deleteSubString(area, path);
					//console.log(area);
				}
			} else if (parent.getAttribute("alt") == "色系") {
				if (elem.checked == true) {
					color += path + ";";
				} else if (color.length > 0) {
					color = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "品牌") {
				if (elem.checked == true) {
					brand += path + ";";
				} else if (brand.length > 0) {
					brand = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "主材") {
				if (elem.checked == true) {
					madeof += path + ";";
				} else if (madeof.length > 0) {
					madeof = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "种类") {
				if (elem.checked == true) {
					sort += path + ";";
				} else if (sort.length > 0) {
					sort = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "产地") {
				if (elem.checked == true) {
					placeof += path + ";";
				} else if (placeof.length > 0) {
					placeof = deleteSubString(style, path);
				}
			}

		}
		//删除字符串中的子字符串
		function deleteSubString(string, substring) {
			string = string.substr(0, string.indexOf(substring))
					+ string.substr(string.indexOf(substring) + substring.length
							+ 1, string.length);
			return string;
		}

		//定义搜索和筛选的查询数据
		function defineQureyData() {
			var querydata = {
				limit : 32,
				offset : 0,
				type : "model",
				isMananger : "true",
			};

			if (style && style != "") {
				querydata["1_stylePath"] = style;
			}
			if (area && area != "") {
				querydata["1_areaPath"] = area;
			}
			if (room && room != "") {
				querydata["1_roomPath"] = room;
			}
			if (brand && brand != "") {
				querydata["1_brandPath"] = brand;
			}
			if (placeof && placeof != "") {
				querydata["1_placeOfProductionPath"] = placeof;
			}
			if (madeof && madeof != "") {
				querydata["1_madeOfPath"] = madeof;
			}
			if (color && color != "") {
				querydata["1_colorSystemPath"] = color;
			}
			if (sort && sort != "") {
				querydata["1_sortPath"] = sort;
			}
			if (order && order != "") {
				querydata["order"] = order;
			}
			if (searchTerm && searchTerm != "") {
				querydata["0_resourceName"] = searchTerm.trim();
				querydata["0_keyInfo"] = searchTerm.trim();
				querydata["0_introduction"] = searchTerm.trim();
			}
			return querydata
		}

		//发送搜索的ajax请求 
		function sendAjax() {
			var success = function(data) {
				console.log(data);
				data = JSON.parse(data);
				if (data.queryData) {
					checkSuccess("queryData", data);
				} else {
					checkSuccess("initData", data);
				}
				loadPage(data);
			};
			var error = function() {
				console.log("获取数据失败");
			};
			sendRequest("/userdata/shmodellib/queryData", defineQureyData(),
					success, error);
		}

		function sendRequest(requestURL, requestData, successCallback,
				errorCallback) {
			var options = {
				url : requestURL,
				data : requestData,
				cache : false,
				dataType : "json",
				success : successCallback,
				error : errorCallback,
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}
		
		function sendUpdateRequest(requestURL, requestData, successCallback,
				errorCallback) {
			var options = {
				url : requestURL,
				data : requestData,
				cache : false,
				dataType : "json",
				success : successCallback,
				error : errorCallback,
			};
			$("#formupdate").ajaxForm(options);
			$("#formupdate").submit();
		}

		//定义下一页和上一页请求需要的数据，包括分类和筛选信息
		function definePageData() {
			var querydata = {
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "model",
				isMananger : "true",
			};

			if (style && style != "") {
				querydata["1_stylePath"] = style;
			}
			if (area && area != "") {
				querydata["1_areaPath"] = area;
			}
			if (room && room != "") {
				querydata["1_roomPath"] = room;
			}
			if (brand && brand != "") {
				querydata["1_brandPath"] = brand;
			}
			if (placeof && placeof != "") {
				querydata["1_placeOfProductionPath"] = placeof;
			}
			if (madeof && madeof != "") {
				querydata["1_madeOfPath"] = madeof;
			}
			if (color && color != "") {
				querydata["1_colorSystemPath"] = color;
			}
			if (sort && sort != "") {
				querydata["1_sortPath"] = sort;
			}
			if (searchTerm && searchTerm != "") {
				querydata["0_resourceName"] = searchTerm.trim();
				querydata["0_keyInfo"] = searchTerm.trim();
				querydata["0_introduction"] = searchTerm.trim();
			}
			return querydata
		}