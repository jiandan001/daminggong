	//页面就绪
		var static_data = new Object();
		var roomCatch = new Object();
		var currentRoom = new Object();
		var currentUuid = "";
		var area = "";
		var room = "";
		var style = "";
		var areaData = new Object();
		var roomData = new Object();
		var styleData = new Object();
		var order = "des";
		var searchTerm = "";
		var ClickNum = 1;
		var OriMolNum = 32;
		var pagestart = 0;
		var moxingpath = "";
		$().ready(function() {

			//页面第一次加载

			loadInitData();
			// loadQuryData();
			addIseditAction()
			addNextPageAction()
			addPrePageAction()
			addOrderDateAction()
			addSearchAction()
		});

		function addIseditAction() {
			$("#isedit").click(function() {
				//console.log("编辑模式 ");
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

		function addNextPageAction() {
			$("#next").click(
					function() {
						ClickNum = ClickNum + 1;
						var success = function(data) {
							data = JSON.parse(data);
							if (data.queryData) {
								checkSuccess("queryData", data);
							} else {
								checkSuccess("initData", data);
							}
							$("#back-top")[0].click();
							loadpage(data);
						};
						var error = function() {
							console.log("获取数据失败");
						}
						sendRequest("/userdata/roomlib/queryData",
								definePageData(), success, error);
					});
		}

		function addPrePageAction() {
			$("#prev").click(
					function() {
						ClickNum = ClickNum - 1;
						var success = function(data) {
							data = JSON.parse(data);
							if (data.queryData) {
								checkSuccess("queryData", data);
							} else {
								checkSuccess("initData", data);
							}
							$("#back-top")[0].click();
							loadpage(data);
						};
						var error = function() {
							console.log("获取数据失败");
						}
						sendRequest("/userdata/roomlib/queryData",
								definePageData(), success, error);
					});
		}

		function addOrderDateAction() {
			//点击按时间倒序排序
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

		function addSearchAction() {
			//点击search按钮
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

		//分类展示部分

		function loadQuryData() {
			var success = function(data) {
				data = JSON.parse(data);
				if (data.queryData) {
					checkSuccess("queryData", data);
				} else {
					checkSuccess("initData", data);
				}
				loadpage(data);
			};
			var error = function() {
				console.log("获取数据失败");
			}
			var requestdata = {
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "model",
				isMananger : "true",
			};
			sendRequest("/userdata/roomlib/queryData", requestdata, success, error);
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

		function loadInitData() {
			var success = function(data) {
				checkSuccess("initData", data);
				static_data = JSON.parse(data);
				var initdata = static_data.initData;
				console.log(initdata);
				for (var x = 0; x < initdata.categoryData.length; x++) {
					if (initdata.categoryData[x].resourceName == "面积") {
						areaData = initdata.categoryData[x].catData;
					}
					if (initdata.categoryData[x].resourceName == "空间") {
						roomData = initdata.categoryData[x].catData;
					}
					if (initdata.categoryData[x].resourceName == "风格") {
						styleData = initdata.categoryData[x].catData;
					}
				}
				//console.log("roomData is " + roomData);
				var categoryDiv = document.getElementById("categorydiv");
				////console.log("category html is " + category(initdata));
				categoryDiv.innerHTML = category(initdata);
				displayCategory();
				loadpage(static_data);
			}
			var error = function() {
				console.log("数据获取失败");
			}
			var requestdata = {
				by : "publishDate",
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "model",
			};
			sendRequest("/userdata/roomlib/initData", requestdata, success, error);
		}

		//动态创建模型显示DIV
		function singleRoom(it /**/
		) {
			roomCatch[it.uuid] = it;
			var Time = (it["jcr:created"]).substring(0, 10);
			var ispublish = "";
			var Published = it.published;
			var Author = emaildecode(it["author"]);
			var isPublishTag = "";
			if (Published == "true") {
				ispublish = "取消发布";
			}
			if (Published == "false") {
				ispublish = "发布"
				isPublishTag = "(未发布)"
			}

			var out = '<article class="four columns isotope-item" > <div class="preloader">'
					+ '<a class="bwWrapper single-image plus-icon"  rel="folio">'
					+ '<figure style="height: 220px;width: 220px"><img class="fadein" alt="" src="'
					+ ("/userdata/roomlib/" + it.nodeName + ".image")
					+ '" id="imginfo"  tag='
					+ it.uuid
					+ '> <\/figure><\/a><\/div> <a class="project-meta" href="#" > '
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
						+ '<input type="button" class="button medium turquoise"  path="content/roomlib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/roomlib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">删除户型 <\/button>'
						+ '<\/div>';
			} else if (static_data.initData.role == "yanshou"
					&& Published == "false") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/roomlib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/roomlib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">删除户型 <\/button>'
						+ '<\/div>';
			}
			out += '<\/div><\/article>';
			return out;
		}

		function emaildecode(email) {
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
		function PageNum(ClickNum, CurrNum) {
			var out = '' + ClickNum + '/' + CurrNum + '';
			return out;
		}

		//展开分类
		function CategoryView() {
			$("#categoryParentDiv").animate({
				height : 'toggle'
			});
		}

		function loadpage(data) {
			if (data.queryData) {
				var Roomlib = data.queryData.data;
				var TotalNum = data.queryData.totalNum;
			} else {
				var Roomlib = data.initData.roomData.data;
				var TotalNum = data.initData.roomData.totalNum;
			}
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
			$(".pagenum").empty();
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
											//console.log(ispublish);
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
										type : "model"
									};
									sendRequest("/userdata/roomlib/" + ispublish,
											requestdata, success, error);
								});
					});
			var Roompage = PageNum(ClickNum, CurrNum);
			$(".pagenum").append(Roompage);
		}

		var roomPath = "";
		var stylePath = "";
		var moxingpath = "";
		function renderModal(uuid) {
			var oneCategoryData = static_data.initData.categoryData;
			currentRoom = roomCatch[uuid];
			//console.log(JSON.stringify(currentRoom));
			var attrvalue = "/userdata/roomlib/" + currentRoom.nodeName + ".image";
			var mianji = currentRoom.area;
			var kongjianpath = currentRoom.roomPath;
			var fenggepath = currentRoom.stylePath;
			var kongjian = "";
			var fengge = "";
			for (var x = 0; x < roomData.length; x++) {
				//console.log(roomData[x].path);
				if (kongjianpath == roomData[x].path + ";") {
					kongjian = roomData[x].resourceName;
				}
			}
			for (var x = 0; x < styleData.length; x++) {
				if (fenggepath == styleData[x].path + ";") {
					fengge = styleData[x].resourceName;
				}
			}
			var guanjianzi = currentRoom.keyInfo;
			var mingcheng = currentRoom.resourceName;
			moxingpath = "/content/roomlib/" + currentRoom.nodeName;
			//console.log(mianji);
			//console.log(kongjian);
			//console.log(fengge);
			//console.log(guanjianzi);
			//console.log(moxingpath);
			//console.log(oneCategoryData);
			//获取权限
			var Published = currentRoom.published;
			var canModify = "";
			console.log("the role is " + static_data.initData.role);
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
				console.log("art and published")
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (static_data.initData.role == "art" && Published == "false") {
				console.log("art and unpublished");
				$("#savebutton").css("display", "");
				$("#updateroomli").css("display", "");
				document.getElementById("savebutton").onclick = save;
			} else {
				console.log(" else ");
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
				$("#downloadroomli").css("display", "none");
			}

			$("#room").html(
					"<a href='#' currentvalue='"+kongjianpath+"' class='roomA'>空间: <\/a>"
							+ oneCategory(oneCategoryData[1], kongjianpath,
									canModify));

			$("#style")
					.html(
							"<a href='#' currentvalue='"+fenggepath+"' class='styleA'>风格: <\/a>"
									+ oneCategory(oneCategoryData[2], fenggepath,
											canModify));
			$("#area")
					.html(
							"<a href='#'>面积: <\/a><input "+canModify+" class='areaInput' type='text' value='"+mianji+"' style='width:200px;'>");
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

			$("#download").click(
					function() {
						$(".downloadA").attr("href",
								"/userdata/roomlib/" + currentRoom.uuid + ".7z");
						$(".downloadA")[0].click();

					});
			addInputAction();
			roomPath = $(".roomA").attr("currentvalue");
			stylePath = $(".styleA").attr("currentvalue");
		}
		function addUpdateAction() {
			$("#update").click(function() {
				$('#update').hide();
				var content = JSON.stringify(moxingpath);
				var isInputFill = fileCheck();
				if (isInputFill[0]) {
					var success = function(data) {
						generate('更新成功', 'success');
						$('#update').show();
					};
					var error = function() {
						generate('更新失败', 'error');
						$('#update').show();
					}
					sendRequest("/userdata/roomlib/updateRoom",content,success,error);
				} else {
					alert(isInputFill[1]);
					$('#update').show();
				}
			});
		}

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
					if (lowformat != "sh3d") {
						alertContent += "低模格式必须为sh3d!";
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

		function save() {
			//if (roomPath == "") {
			//	roomPath = $(".roomA").attr("currentvalue");
			//}
			//if (stylePath == "") {
			//	stylePath = $(".styleA").attr("currentvalue");
			//}
			var savedata = {
				"room" : roomPath,
				"style" : stylePath,
				"area" : $(".areaInput").attr("value"),
				"keyinfo" : $(".keyinfoInput").attr("value"),
				"name" : $(".nameInput").attr("value"),
				"nodepath" : $(".modelpath").html(),
			};
			var success = function(data){
				alert("保存成功");
				roomPath = "";
				stylePath = "";
				$("#detailpanel").css("display", "none");
				loadQuryData();
			};
			var error = function(data){
				roomPath = "";
				stylePath = "";
			};
			sendRequest("/userdata/roomlib/saveRoom",savedata,success,error);
		}

		function oneCategory(it, PATH, canModify) {
			//console.log("path is "+PATH);
			var out = '';
			for (var j = 0; j < it.catData.length; j++) {
				var sppath = "";
				if (PATH.indexOf(it.catData[j].path) > -1) {
					sppath = "checked";
				}
				out += '  <input '
						+ canModify
						+ ' class="modify" type="checkbox" value="'
						+ (it.catData[j].path)
						+ '"'
						+ sppath
						+ '><label style="cursor: pointer; display: inline;" title="'
						+ (it.resourceName) + '">' + (it.catData[j].resourceName)
						+ '<\/label> ';
			}
			return out;
		}

		function addInputAction() {
			roomPath = "";
			stylePath = "";
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "modify"
						&& inputcheck[i].type == "checkbox") {
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
			if (parent.getAttribute("id") == "room") {
				if (elem.checked == true) {
					roomPath += path + ";";
					console.log(roomPath);
				} else if (roomPath.length > 0) {
					roomPath = deleteSubString(roomPath, path);
					console.log(roomPath);
				}
			} else if (parent.getAttribute("id") == "style") {
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
					if (it.categoryData[i].resourceName != "面积") {
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
					} else {
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
							out += ' <div style="padding: 2px; display: inline; width: 90px; height: 35px; padding: 5px 0px; float: left; margin-right: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"> <input class="check" type="radio" name="mianji" value="'
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
			}
			return out;
		}

		function displayCategory() {
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "check"
						&& (inputcheck[i].type == "checkbox" || inputcheck[i].type == "radio")) {
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

		function createRequestInfo(parent, path, elem) {
			if (parent.getAttribute("alt") == "空间") {
				if (elem.checked == true) {
					////console.log("checked test");
					room += path + ";";
					//console.log(room);
				} else if (room.length > 0) {
					room = deleteSubString(room, path);
					//console.log(room);
				}
			} else if (parent.getAttribute("alt") == "风格") {
				if (elem.checked == true) {
					style += path + ";";
				} else if (style.length > 0) {
					style = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "面积") {
				if (elem.checked == true) {
					area = path + ";";
				} else if (area.length > 0) {
					area = deleteSubString(area, path);
					//console.log(area);
				}
			}
		}

		function deleteSubString(string, substring) {
			string = string.substr(0, string.indexOf(substring))
					+ string.substr(string.indexOf(substring) + substring.length
							+ 1, string.length);
			return string;
		}

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

		function sendAjax() {
			var success = function(data) {
				data = JSON.parse(data);
				if (data.queryData) {
					checkSuccess("queryData", data);
				} else {
					checkSuccess("initData", data);
				}
				loadpage(data);
			};
			var error = function() {
				console.log("获取数据失败");
			}
			sendRequest("/userdata/roomlib/queryData", defineQureyData(), success,
					error);
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