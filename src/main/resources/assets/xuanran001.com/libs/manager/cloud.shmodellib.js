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
		var pagestart = 0
		$().ready(
				function() {

					//页面第一次加载
					loadInitData();
					// loadQuryData();

					//=================================页面按钮监听======================================
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

					//下一页触发事件
					$("#next").click(function() {
						ClickNum = ClickNum + 1;
						var options = {
							//queryData
							url : "/userdata/shmodellib/queryData",
							data : definePageData(),
							cache : false,
							dataType : "json",
							success : function(data) {
								$("#back-top")[0].click();
								////console.log(data);
								data = JSON.parse(data);
								loadpage(data);
							},
							error : function() {
								//console.log("获取数据失败");
							}
						}
						$("#formTest").ajaxForm(options);
						$("#formTest").submit();
					});

					//上一页触发事件
					$("#prev").click(function() {
						ClickNum = ClickNum - 1;
						var options = {
							//queryData
							url : "/userdata/shmodellib/queryData",
							data : definePageData(),
							//initData
							// url : "/userdata/roomlib/initData",
							cache : false,
							dataType : "json",
							success : function(data) {
								////console.log(data);
								$("#back-top")[0].click();
								data = JSON.parse(data);
								loadpage(data);
							},
							error : function() {
								//console.log("获取数据失败");
							}
						}
						$("#formTest").ajaxForm(options);
						$("#formTest").submit();
					});

					//下载户型
					$("body").delegate(
							".download",
							"click",
							function() {
								var uuid = $(this).attr("id");
								var url = "/userdata/shmodellib";
								var param = {};
								param.type = "room";
								param.data = [ {
									"uuid" : uuid
								} ];
								gutil.download(url, param, function(ret) {
									window.close();
									console.log("download callback called! ret:"
											+ JSON.stringify(ret));
								});

							});

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

					//展开分类
					$("#CategoryViewSwitch").click(
							function() {
								if ($(this).attr("value") === "on") {
									$(this).attr("value", "off");
									$("#CategoryViewSwitch_info + b").css(
											"background-position", "-380px -20px");
									$("#CategoryViewSwitch_info").html("展开分类");
									CategoryView();
								} else {
									$(this).attr("value", "on");
									$("#CategoryViewSwitch_info + b").css(
											"background-position", "-360px -20px");
									$("#CategoryViewSwitch_info").html("收起分类");
									CategoryView();
								}
							});

					//点击search按钮
					$("#searchBtn").click(function() {
						ClickNum = 1;
						order = "des";
						searchTerm = $("#searchTxt").val();
						//console.log(searchTerm);
						$("#orderDateAsc").css("display", "none");
						$("#orderDateDes").css("display", "block");
						$("#items").html("<div class='ball1'></div>");
						sendAjax();
					});
				});

		//分类展示部分

		function loadQuryData() {
			var options = {
				url : "/userdata/shmodellib/queryData",
				data : {
					limit : OriMolNum,
					offset : OriMolNum * (ClickNum - 1),
					order : "des",
					type : "model",
					isMananger : "true",
				},
				cache : false,
				dataType : "json",
				success : function(data) {
					////console.log("modellib data is "+data);
					data = JSON.parse(data);
					loadpage(data);
				},
				error : function() {
					//console.log("获取数据失败");
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}

		function loadInitData() {
			var options = {
				data : {
					limit : OriMolNum,
					offset : OriMolNum * (ClickNum - 1),
					order : "des",
					type : "model",
				},
				//initData
				url : "/userdata/shmodellib/initData",
				cache : false,
				dataType : "json",
				success : function(data) {
					//console.log(data);
					static_data = JSON.parse(data);
					var initdata = static_data.initData;
					var categoryDiv = document.getElementById("categorydiv");
					////console.log("category html is " + category(initdata));
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
					loadpage(static_data);
				},
				error : function() {
					//console.log("获取数据失败");
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}

		//=================================各种函数======================================
		//初次加载页面

		//下一页
		function nextpage(data) {
			var Roomlib = data.queryData.data;
			var TotalNum = data.queryData.totalNum;
			var CurrNum = Math.ceil(TotalNum / OriMolNum);
			if (ClickNum > CurrNum) {
				ClickNum = ClickNum - 1;
				return;
			} else {
				////console.log(ClickNum);
				$("#Roomlist").empty();
				$(".pagenum").empty();
				for ( var item in Roomlib) {
					var Roomdiv = singleRoom(Roomlib[item]);
					$("#Roomlist").append(Roomdiv);
				}
				var Roompage = PageNum(ClickNum, CurrNum);
				$(".pagenum").append(Roompage);
			}
		}

		//上一页
		function prepage(data) {
			var Roomlib = data.queryData.data;
			var TotalNum = data.queryData.totalNum;
			var CurrNum = Math.ceil(TotalNum / OriMolNum);
			if (ClickNum < 1) {
				ClickNum = ClickNum + 1;
				return;
			} else {
				////console.log(ClickNum);
				$("#Roomlist").empty();
				$(".pagenum").empty();
				for ( var item in Roomlib) {
					var Roomdiv = singleRoom(Roomlib[item]);
					$("#Roomlist").append(Roomdiv);
				}
				var Roompage = PageNum(ClickNum, CurrNum);
				$(".pagenum").append(Roompage);
			}
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
			var Published = it.published;
			var Author = emaildecode(it["author"]);
			if (Published == "true") {
				ispublish = "取消发布";
			}
			if (Published == "false") {
				ispublish = "发布 "
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

			$(":button").each(function() {
				$(this).click(function() {
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
					var options = {
						url : "/userdata/shmodellib/" + ispublish,
						data : {
							roompath : RoomPath,
							by : "publishDate",
							type : "model"
						},
						cache : false,
						dataType : "json",
						success : function(data) {
							//console.log(data);
							data = JSON.parse(data);
							if (ispublish == "unpublish") {
								//console.log(ispublish);
								$("#" + currentUuid).attr("tag", "false");
								$("#" + currentUuid).attr("value", "发布");
							}
							if (ispublish == "publish") {
								$("#" + currentUuid).attr("tag", "true");
								$("#" + currentUuid).attr("value", "取消发布");
							}
						},
						error : function(data) {
							//console.log(data);
							//console.log("获取数据失败");
						}
					};
					$("#formTest").ajaxForm(options);
					$("#formTest").submit();
				});
			});
			var Roompage = PageNum(ClickNum, CurrNum);
			$(".pagenum").append(Roompage);
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
			//var oneCategoryData = static_data.initData.categoryData;
			//roomData = oneCategoryData[0].catData;
			//styleData = oneCategoryData[1].catData;
			//colorData = oneCategoryData[2].catData;
			//brandData = oneCategoryData[3].catData;
			//madeofData = oneCategoryData[4].catData;
			//sortData = oneCategoryData[5].catData;
			//placeofData = oneCategoryData[6].catData;
			currentRoom = roomCatch[uuid];

			var kongjianpath = "";
			var fenggepath = "";
			var sexipath = "";
			var pinpaipath = "";
			var zhucaipath = "";
			var zhongleipath = "";
			var chandipath = "";
			////console.log(JSON.stringify(currentRoom));
			var attrvalue = "";
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
			// console.log("zhongleipath is " + zhongleipath);
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
			console.log(pinpaipath);

			var kongjian = "";
			var fengge = "";
			var sexi = "";
			var pinpai = "";
			var zhucai = "";
			var zhonglei = "";
			var chandi = "";
			console.log()
			for (var x = 0; x < roomData.length; x++) {
				////console.log(roomData[x].path);
				if (kongjianpath.indexOf(roomData[x].path) > -1) {
					//console.log("test");
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
			moxingpath = "/content/shmodellib/" + currentRoom.nodeName;

			//获取权限
			var Published = currentRoom.published;
			var canModify = "";
			if (static_data.initData.role == "admin") {
				$("#savebutton").css("display", "");
				$("#updateroomli").css("display", "");
				document.getElementById("savebutton").onclick = save;
			} else if (static_data.initData.role == "yanshou") {
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (static_data.initData.role == "art" && Published == "true") {
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (static_data.initData.role == "art" && Published == "false") {
				$("#savebutton").css("display", "");
				$("#updateroomli").css("display", "");
				document.getElementById("savebutton").onclick = save;
			} else {
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
				$("#downloadroomli").css("display", "none");
			}

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
			document.getElementById("savebutton").onclick = save;
			//$("#savebutton").click(function() {
			//	save(moxingpath);
			//});

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

			addInputAction(currentRoom);
			addRadioAction(currentRoom);
			//displayCurrentValue();
		}

		$("#update").click(
				function() {
					$('#update').hide();
					var content = JSON.stringify(moxingpath);
					var isInputFill = fileCheck();
					var fileState = [ "请将表单填写完整再上传", "填写正确", "高模文件格式应该为blend",
							"低模型格式应该为sh3f", "预览图格式应该为jpg",
							"搞模文件格式应该为blend,低模型格式应该为sh3f",
							"高模文件格式应该为blend,预览图格式应该为jpg",
							"低模型格式应该为sh3f,预览图格式应该为jpg",
							"高模文件格式应该为blend,低模型格式应该为sh3f,预览图格式应该为jpg" ];
					if (isInputFill == 1) {
						var options = {
							//queryData
							url : "/userdata/shmodellib/updateModel",
							data : {
								data : content
							},
							cache : false,
							dataType : "json",
							success : function(data) {
								generate('上传成功', 'success');
								$('#update').show();
							},
							error : function() {
								generate('上传失败', 'error');
								$('#update').show();
							}
						}
						$("#formupdate").ajaxForm(options);
						$("#formupdate").submit();
						//alert(fileState[isInputFill]);
					} else {
						alert(fileState[isInputFill]);
						$('#update').show();
					}
				});

		function fileCheck() {
			var highfile = $("#high").attr("value");
			var lowfile = $("#low").attr("value");
			var prefile = $("#preview").attr("value");
			//console.log("high is " + highfile);
			//console.log("low is " + lowfile);
			//console.log("preview is " + prefile);
			if (highfile != "" && lowfile != "" && prefile != "") {
				var highformat = highfile.substring(highfile.lastIndexOf(".") + 1,
						highfile.length);
				var lowformat = lowfile.substring(lowfile.lastIndexOf(".") + 1,
						lowfile.length);
				var preformat = prefile.substring(prefile.lastIndexOf(".") + 1,
						prefile.length);
				//console.log("highformat is " + highformat);
				//console.log("lowformat is " + lowformat);
				//console.log("previewformat is " + preformat);
				if (highformat == "blend" && lowformat == "sh3f"
						&& preformat == "jpg") {
					return 1;
				} else if (highformat != "blend" && lowformat == "sh3f"
						&& preformat == "jpg") {
					return 2;
				} else if (highformat == "blend" && lowformat != "sh3f"
						&& preformat == "jpg") {
					return 3;
				} else if (highformat == "blend" && lowformat == "sh3f"
						&& preformat != "jpg") {
					return 4;
				} else if (highformat != "blend" && lowformat != "sh3f"
						&& preformat == "jpg") {
					return 5;
				} else if (highformat != "blend" && lowformat == "sh3f"
						&& preformat != "jpg") {
					return 6;
				} else if (highformat == "blend" && lowformat != "sh3f"
						&& preformat != "jpg") {
					return 7;
				} else if (highformat != "blend" && lowformat != "sh3f"
						&& preformat != "jpg") {
					return 8;
				}
			} else {
				return 0;
			}
		}

		function save() {
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
			};
			//console.log(savedata);
			var options = {
				url : "/userdata/shmodellib/saveModel",
				data : savedata,
				cache : false,
				dataType : "json",
				success : function(data) {
					alert("保存成功");
					roomPath = "";
					stylePath = "";
					colorPath = "";
					sortPath = "";
					madeofPath = "";
					placeofPath = "";
					brandPath = "";
					$("#detailpanel").css("display", "none");
					//console.log(data);
					loadQuryData();
				},
				error : function() {
					//console.log("获取数据失败");
					roomPath = "";
					stylePath = "";
					colorPath = "";
					sortPath = "";
					madeofPath = "";
					placeofPath = "";
					brandPath = "";
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}

		//style="padding: 2px; display: inline; width: 90px; height: 35px; 
		//padding: 5px 0px; float: left; margin-right: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
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

		function displayCurrentValue() {
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "modify"
						&& inputcheck[i].type == "checkbox") {
					//console.log(inputcheck[i].parentNode.type);
					if (inputcheck[i].parentNode.className == "roomP") {
						if (inputcheck[i].value = $(".roomA").attr("currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}
					if (inputcheck[i].parentNode.className == "styleP") {
						if (inputcheck[i].value = $(".styleA").attr("currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}
					if (inputcheck[i].parentNode.className == "colorP") {
						if (inputcheck[i].value = $(".colorA").attr("currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}
					if (inputcheck[i].parentNode.className == "brandP") {
						if (inputcheck[i].value = $(".brandA").attr("currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}
					if (inputcheck[i].parentNode.className == "madeofP") {
						if (inputcheck[i].value = $(".madeofA")
								.attr("currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}
					if (inputcheck[i].parentNode.className == "sortP") {
						if (inputcheck[i].value = $(".sortA").attr("currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}
					if (inputcheck[i].parentNode.className == "placeofP") {
						if (inputcheck[i].value = $(".placeofA").attr(
								"currentvalue")) {
							inputcheck[i].checked = "true";
						}
					}

				}
			}
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
					roomPath += path;
				} else if (roomPath.length > 0) {
					roomPath = deleteSubString(roomPath, path);
				}
			} else if (parent.getAttribute("id") == "colorP") {
				if (elem.checked == true) {
					colorPath += path;
				} else if (colorPath.length > 0) {
					colorPath = deleteSubString(colorPath, path);
				}
			} else if (parent.getAttribute("id") == "brandP") {
				console.log("===========================");
				if (elem.checked == true) {
					brandPath = path;
					console.log("brandPaht is " + brandPath);
				} else if (brandPath.length > 0) {
					brandPath = deleteSubString(brandPath, path);
				}
			} else if (parent.getAttribute("id") == "madeofP") {
				if (elem.checked == true) {
					madeofPath = path;
				} else if (madeofPath.length > 0) {
					madeofPath = deleteSubString(madeofPath, path);
				}
			} else if (parent.getAttribute("id") == "sortP") {
				if (elem.checked == true) {
					sortPath = path;
				} else if (sortPath.length > 0) {
					sortPath = deleteSubString(sortPath, path);
				}
			} else if (parent.getAttribute("id") == "placeofP") {
				if (elem.checked == true) {
					placeofPath += path;
				} else if (placeofPath.length > 0) {
					placeofPath = deleteSubString(placeofPath, path);
				}
			} else if (parent.getAttribute("id") == "styleP") {
				if (elem.checked == true) {
					stylePath += path;
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

		function sendAjax() {
			var options = {
				url : "/userdata/shmodellib/queryData",
				data : defineQureyData(),
				cache : false,
				dataType : "json",
				success : function(data) {
					data = JSON.parse(data);
					loadpage(data);
				},
				error : function() {
					//console.log("获取数据失败");
				}
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