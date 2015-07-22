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
		$().ready(
				function() {

					//ҳ���һ�μ���
					loadInitData();
					// loadQuryData();

					//=================================ҳ�水ť����======================================
					$("#isedit").click(function() {
						//console.log("�༭ģʽ ");
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

					//��һҳ�����¼�
					$("#next").click(function() {
						ClickNum = ClickNum + 1;
						var options = {
							//queryData
							url : "/userdata/roomlib/queryData",
							data : definePageData(),
							cache : false,
							dataType : "json",
							success : function(data) {
								////console.log(data);
								data = JSON.parse(data);
								$("#back-top")[0].click();
								loadpage(data);
							},
							error : function() {
								//console.log("��ȡ����ʧ��");
							}
						}
						$("#formTest").ajaxForm(options);
						$("#formTest").submit();
					});

					//��һҳ�����¼�
					$("#prev").click(function() {
						ClickNum = ClickNum - 1;
						var options = {
							//queryData
							url : "/userdata/roomlib/queryData",
							data : definePageData(),
							//initData
							// url : "/userdata/roomlib/initData",
							cache : false,
							dataType : "json",
							success : function(data) {
								////console.log(data);
								data = JSON.parse(data);
								$("#back-top")[0].click();
								loadpage(data);
							},
							error : function() {
								//console.log("��ȡ����ʧ��");
							}
						}
						$("#formTest").ajaxForm(options);
						$("#formTest").submit();
					});

					//���ػ���
					$("body").delegate(
							".download",
							"click",
							function() {
								var uuid = $(this).attr("id");
								var url = "/userdata/roomlib";
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

								// var uuid = $(this).attr("id");
								// //console.log(uuid);
								// var options = {
								// url : "/userdata/roomlib/download",
								// data : {
								// type : "room",
								// "uuid" : "739fd355-6715-4d6e-b9c0-6235baba6ae0"
								// },
								// type : 'POST',
								// cache : false,
								// dataType : 'json',
								// success : function (data) {
								// //console.log(data);
								// },
								// error : function (e) {
								// //console.log(e);
								// }
								// };
								// $("#formTest").ajaxForm(options);
								// $("#formTest").submit();
							});

					//�����ʱ�䵹������
					$("#orderDateDes").click(function() {
						ClickNum = 1;
						order = "asc";
						$("#orderDateDes").css("display", "none");
						$("#orderDateAsc").css("display", "block");
						$("#items").html("<div class='ball1'></div>");
						sendAjax();
					});
					//�����ʱ����������
					$("#orderDateAsc").click(function() {
						ClickNum = 1;
						order = "des";
						$("#orderDateAsc").css("display", "none");
						$("#orderDateDes").css("display", "block");
						$("#items").html("<div class='ball1'></div>");
						sendAjax();
					});

					//չ������
					$("#CategoryViewSwitch").click(
							function() {
								if ($(this).attr("value") === "on") {
									$(this).attr("value", "off");
									$("#CategoryViewSwitch_info + b").css(
											"background-position", "-380px -20px");
									$("#CategoryViewSwitch_info").html("չ������");
									CategoryView();
								} else {
									$(this).attr("value", "on");
									$("#CategoryViewSwitch_info + b").css(
											"background-position", "-360px -20px");
									$("#CategoryViewSwitch_info").html("�������");
									CategoryView();
								}
							});

					//���search��ť
					$("#searchBtn").click(function() {
						ClickNum = 1;
						order = "des";
						searchTerm = $("#searchTxt").val();
						$("#orderDateAsc").css("display", "none");
						$("#orderDateDes").css("display", "block");
						$("#items").html("<div class='ball1'></div>");
						sendAjax();
					});

				});

		//����չʾ����

		function loadQuryData() {
			var options = {
				url : "/userdata/roomlib/queryData",
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
					//console.log(data);
					data = JSON.parse(data);
					loadpage(data);
				},
				error : function() {
					//console.log("��ȡ����ʧ��");
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
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
			var options = {
				data : {
					by : "publishDate",
					limit : OriMolNum,
					offset : OriMolNum * (ClickNum - 1),
					order : "des",
					type : "model",
				},
				//initData
				url : "/userdata/roomlib/initData",
				cache : false,
				dataType : "json",
				success : function(data) {
					////console.log(data);
					static_data = JSON.parse(data);
					var initdata = static_data.initData;
					for (var x = 0; x < initdata.categoryData.length; x++) {
						if (initdata.categoryData[x].resourceName == "���") {
							areaData = initdata.categoryData[x].catData;
						}
						if (initdata.categoryData[x].resourceName == "�ռ�") {
							roomData = initdata.categoryData[x].catData;
						}
						if (initdata.categoryData[x].resourceName == "���") {
							styleData = initdata.categoryData[x].catData;
						}
					}
					//console.log("roomData is " + roomData);
					var categoryDiv = document.getElementById("categorydiv");
					////console.log("category html is " + category(initdata));
					categoryDiv.innerHTML = category(initdata);
					displayCategory();
					loadpage(static_data);
				},
				error : function() {
					//console.log("��ȡ����ʧ��");
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}

		//=================================���ֺ���======================================
		//���μ���ҳ��

		//��һҳ
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

		//��һҳ
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

		//��̬����ģ����ʾDIV
		function singleRoom(it /**/
		) {
			roomCatch[it.uuid] = it;
			//console.log(roomCatch[it.uuid]);
			//if (it.publishDate) {
			//	var Pos = (it.publishDate).indexOf("T");
			//	var Time = (it.publishDate).substring(0, Pos);
			//}else{
			//var Pos = (it.publishDate).indexOf("T");
			var Time = (it["jcr:created"]).substring(0, 10);
			//}
			var ispublish = "";
			var Published = it.published;
			var Author = emaildecode(it["author"]);
			if (Published == "true") {
				ispublish = "ȡ������";
			}
			if (Published == "false") {
				ispublish = "����"
			}

			/*
			<a class="bwWrapper single-image plus-icon"
					href="/brand-center/ajiajiaju.html" rel="folio"> <img
					src="/sites/default/files/xuanran001.brand-center.afurniture.png"
					alt="" class="fadein">
			</a>
			 */

			var out = '<article class="four columns isotope-item" > <div class="preloader">'
					+ '<a class="bwWrapper single-image plus-icon"  rel="folio">'
					+ '<figure style="height: 220px;width: 220px"><img class="fadein" alt="" src="'
					+ ("/userdata/roomlib/" + it.nodeName + ".image")
					+ '" id="imginfo"  tag='
					+ it.uuid
					+ '> <\/figure><\/a><\/div> <a class="project-meta" href="#" > '
					+ '<h6 class="title" style="float:left;padding-left: 14px;">���ƣ�'
					+ (it.resourceName)
					+ '<\/font><\/p>'
					+ '<\/h6>'
					+ '<a class="project-meta" href="#">'
					+ '<h6 class="title" style="float:left;padding-left: 14px;">ʱ�䣺'
					+ Time
					+ '<\/p> '
					+ '<\/h6>'
					+ '<a class="project-meta" href="#" >'
					+ '<h6 class="title" style="float:left;padding-left: 14px;">���ߣ�'
					+ Author + '<\/h6> ' + '<\/a>';
			if (static_data.initData.role == "admin") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/roomlib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/roomlib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">ɾ������ <\/button>'
						+ '<\/div>';
			} else if (static_data.initData.role == "yanshou"
					&& Published == "false") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/roomlib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/roomlib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">ɾ������ <\/button>'
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

		//��̬����ҳ����ʾDIV
		function PageNum(ClickNum, CurrNum) {
			var out = '' + ClickNum + '/' + CurrNum + '';
			return out;
		}

		//չ������
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
						url : "/userdata/roomlib/" + ispublish,
						data : {
							roompath : RoomPath,
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
								$("#" + currentUuid).attr("value", "����");
							}
							if (ispublish == "publish") {
								$("#" + currentUuid).attr("tag", "true");
								$("#" + currentUuid).attr("value", "ȡ������");
							}
						},
						error : function(data) {
							//console.log(data);
							//console.log("��ȡ����ʧ��");
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
			//��ȡȨ��
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

			$("#room").html(
					"<a href='#' currentvalue='"+kongjianpath+"' class='roomA'>�ռ�: <\/a>"
							+ oneCategory(oneCategoryData[1], kongjianpath,
									canModify));

			$("#style")
					.html(
							"<a href='#' currentvalue='"+fenggepath+"' class='styleA'>���: <\/a>"
									+ oneCategory(oneCategoryData[2], fenggepath,
											canModify));
			$("#area")
					.html(
							"<a href='#'>���: <\/a><input "+canModify+" class='areaInput' type='text' value='"+mianji+"' style='width:200px;'>");
			$("#keyinfo")
					.html(
							"<a href='#'>�ؼ���: <\/a><input "+canModify+" class='keyinfoInput' type='text' value='"+guanjianzi+"' style='width:200px;'>");
			$("#name")
					.html(
							"<a href='#'>����: <\/a><input "+canModify+" class='nameInput' type='text' value='"+mingcheng+"' style='width:200px;'>");
			$("#modelpath").html(
					"<a href='#'>ģ�͵�ַ: <\/a><p class='modelpath'>" + moxingpath
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

		$("#update").click(
				function() {
					$('#update').hide();
					var content = JSON.stringify(moxingpath);
					var isInputFill = fileCheck();
					var fileState = [ "�뽫����д�������ϴ�", "��д��ȷ", "��ģ�ļ���ʽӦ��Ϊblend",
							"��ģ�͸�ʽӦ��Ϊsh3f", "Ԥ��ͼ��ʽӦ��Ϊjpg",
							"��ģ�ļ���ʽӦ��Ϊblend,��ģ�͸�ʽӦ��Ϊsh3f",
							"��ģ�ļ���ʽӦ��Ϊblend,Ԥ��ͼ��ʽӦ��Ϊjpg",
							"��ģ�͸�ʽӦ��Ϊsh3f,Ԥ��ͼ��ʽӦ��Ϊjpg",
							"��ģ�ļ���ʽӦ��Ϊblend,��ģ�͸�ʽӦ��Ϊsh3f,Ԥ��ͼ��ʽӦ��Ϊjpg" ];
					if (isInputFill == 1) {
						var options = {
							//queryData
							url : "/userdata/roomlib/updateRoom",
							data : {
								data : content
							},
							cache : false,
							dataType : "json",
							success : function(data) {
								generate('���³ɹ�', 'success');
								$('#update').show();
							},
							error : function() {
								generate('����ʧ��', 'error');
								$('#update').show();
							}
						}
						$("#formupdate").ajaxForm(options);
						$("#formupdate").submit();
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
			//console.log(savedata);
			var options = {
				url : "/userdata/roomlib/saveRoom",
				data : savedata,
				cache : false,
				dataType : "json",
				success : function(data) {
					alert("����ɹ�");
					roomPath = "";
					stylePath = "";
					$("#detailpanel").css("display", "none");
					//console.log(data);
					loadQuryData();
				},
				error : function() {
					//console.log("��ȡ����ʧ��");
					roomPath = "";
					stylePath = "";
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
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
			if (parent.getAttribute("alt") == "�ռ�") {
				if (elem.checked == true) {
					////console.log("checked test");
					room += path + ";";
					//console.log(room);
				} else if (room.length > 0) {
					room = deleteSubString(room, path);
					//console.log(room);
				}
			} else if (parent.getAttribute("alt") == "���") {
				if (elem.checked == true) {
					style += path + ";";
				} else if (style.length > 0) {
					style = deleteSubString(style, path);
				}
			} else if (parent.getAttribute("alt") == "���") {
				if (elem.checked == true) {
					area += path + ";";
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
			var options = {
				url : "/userdata/roomlib/queryData",
				data : defineQureyData(),
				cache : false,
				dataType : "json",
				success : function(data) {
					data = JSON.parse(data);
					loadpage(data);
				},
				error : function() {
					console.log("��ȡ����ʧ��");
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