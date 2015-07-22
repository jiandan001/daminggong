	var static_data = new Object();
		var roomCatch = new Object();
		var currentRoom = new Object();
		var currentUuid = "";
		//ɸѡ��� 
		var areaData = new Object();
		var roomData = new Object();
		var styleData = new Object();
		var colorData = new Object();
		var brandData = new Object();
		var madeofData = new Object();
		var sortData = new Object();
		var placeofData = new Object();
		var positionData = new Object();
		var lashenData = new Object();
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
		var roomPath = "";
		var stylePath = "";
		var colorPath = "";
		var brandPath = "";
		var madeofPath = "";
		var sortPath = "";
		var placeofPath = "";
		var moxingpath = "";
		var userRole = ""
		$().ready(
				function() {

					//ҳ���һ�μ���
					loadRoleData();
					loadInitData();
					loadQuryData();

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

					$("#displaycategory").click(
							function() {
								$("#categoryParentDiv").slideToggle("slow",
										toggleCallback);
							});

					function toggleCallback() {
						if ($("#categoryParentDiv").css("display") == "none") {
							$("#displaycategory").html("չ������");
						}
						if ($("#categoryParentDiv").css("display") == "block") {
							$("#displaycategory").html("�������");
						}
					}

					//��һҳ�����¼�
					$("#next").click(function() {
						ClickNum = ClickNum + 1;
						var options = {
							//queryData
							url : "/userdata/shmateriallib/queryData",
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
							url : "/userdata/shmateriallib/queryData",
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
								var url = "/userdata/shmateriallib";
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
						//console.log(searchTerm);
						$("#orderDateAsc").css("display", "none");
						$("#orderDateDes").css("display", "block");
						$("#items").html("<div class='ball1'></div>");
						sendAjax();
					});
				});

		//����չʾ����
		//����Ȩ������
		function loadRoleData() {
			var options = {
				url : "/userdata/shmateriallib/initData",
				data : {
					limit : 0,
					offset : 0,
					order : "des",
					type : "material",
					isMananger : "true",
				},
				cache : false,
				dataType : "json",
				success : function(data) {
					data = JSON.parse(data);
					userRole = data.initData.role;
					console.log(userRole);
				},
				error : function() {
					//console.log("��ȡ����ʧ��");
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}

		//���ز�������
		function loadQuryData() {
			var options = {
				url : "/userdata/shmateriallib/queryData",
				data : {
					limit : OriMolNum,
					offset : OriMolNum * (ClickNum - 1),
					order : "des",
					type : "material",
					isMananger : "true",
				},
				cache : false,
				dataType : "json",
				success : function(data) {
					console.log("modellib data is " + data);
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

		//���ز��ʷ������� 
		function loadInitData() {
			var options = {
				data : {
					limit : OriMolNum,
					offset : OriMolNum * (ClickNum - 1),
					order : "des",
					type : "material",
				},
				//initData
				url : "/userdata/shmateriallib/getCategory",
				cache : false,
				dataType : "json",
				success : function(data) {
					console.log(data);
					static_data = JSON.parse(data);
					var initdata = static_data.categoryData;
					var categoryDiv = document.getElementById("categorydiv");
					//console.log("category html is " + category(initdata));
					categoryDiv.innerHTML = category(initdata);
					oneCategoryData = static_data.categoryData.categoryData;
					roomData = oneCategoryData[0].catData;
					styleData = oneCategoryData[1].catData;
					//colorData = oneCategoryData[2].catData;
					//brandData = oneCategoryData[3].catData;
					//madeofData = oneCategoryData[4].catData;
					//sortData = oneCategoryData[5].catData;
					//placeofData = oneCategoryData[6].catData;
					displayCategory();
					//loadpage(static_data);
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

		//��̬����ģ����ʾDIV
		function singleRoom(it /**/
		) {
			roomCatch[it.uuid] = it;
			////console.log(roomCatch[it.uuid]);
			//var Pos = (it.publishDate).indexOf("T");
			var Time = (it["jcr:created"]).substring(0, 10);
			var ispublish = "";
			var isPublishTag = "";
			var Published = it.published;
			var Author = emaildecode(it["jcr:createdBy"]);
			if (Published == "true") {
				ispublish = "ȡ������";
			}
			if (Published == "false") {
				ispublish = "���� "
				isPublishTag = "(δ����)";
			}

			var out = '<article class="four columns isotope-item" > <div class="preloader">'
					+ '<a class="bwWrapper single-image plus-icon"  rel="folio">'
					+ '<figure style="height: 220px;width: 220px"><img style="height: 220px;width: 220px" class="fadein" alt="" src="'
					+ ("/userdata/shmateriallib/" + it.nodeName + ".image")
					+ '" id="imginfo"  tag='
					+ it.uuid
					+ '><\/figure> <\/a><\/div> <a class="project-meta" href="#" > '
					+ '<h6 class="title" style="float:left;padding-left: 14px;">���ƣ�'
					+ (it.resourceName)
					+ isPublishTag
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
			if (userRole == "admin") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/shmateriallib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/shmateriallib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">ɾ���Ҿ� <\/button>'
						+ '<\/div>';
			} else if (userRole == "yanshou" && Published == "false") {
				out += '<div class="project-meta" style="padding-top: 14px;padding-bottom: 5px;">'
						+ '<input type="button" class="button medium turquoise"  path="content/shmateriallib/'+it.nodeName+'" tag="'+Published+'" id="'+it.uuid+'" value='+ispublish+' style="margin-bottom: 0px;padding: 3px 8px;font-size: 12px;">'
						+ '<button class="button medium turquoise" tag="deletebutton" path="content/shmateriallib/'+it.nodeName+'" value="'+Published+'" name="'+it.uuid+'" style="margin-left: 2px;display:none;margin-bottom: 0px;padding: 3px 8px;font-size: 12px;height: 23px;">ɾ���Ҿ� <\/button>'
						+ '<\/div>';
			}
			out += '<\/div><\/article>';
			return out;
		}

		//���������ʽ
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

		//����ҳ�棬������ʾ��ҳ���ϣ��÷�����ͳһ�ӿ�
		function loadpage(data) {
			var Roomlib = data.queryData.data;
			var TotalNum = data.queryData.totalNum;
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
			//���ҳ���������¼���ҳ������ 
			$("#Roomlist").empty();
			$(".pagenum").empty();

			//���������� 
			for ( var item in Roomlib) {
				var Roomdiv = singleRoom(Roomlib[item]);
				$("#Roomlist").append(Roomdiv);
			}
			//��������Ϣ�޸ĵĵ��������
			$(".fadein").each(function() {
				$(this).mouseover(function() {
					var uuid = $(this).attr("tag");
					renderModal(uuid);
				});
			});
			//��ÿ��Ԥ��ͼԪ����ӵ��ʱ�䣬��������޸����Եĵ�����modal��
			$(".fadein").each(function() {
				$(this).click(function() {
					$("#detailpanel").css("display", "block")
				});
			});

			//������ȡ��������ť����¼�
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
						url : "/userdata/shmateriallib/" + ispublish,
						data : {
							roompath : RoomPath,
							by : "publishDate",
							type : "material"
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

		//��Ⱦ�������е�Ԫ���Լ����е�����
		function renderModal(uuid) {
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
			if (currentRoom.seatPath) {
				kongjianpath = currentRoom.seatPath;
			}
			if (currentRoom.tensilePath) {
				fenggepath = currentRoom.tensilePath;
			}

			if (currentRoom.nodeName) {
				attrvalue = "/userdata/shmateriallib/" + currentRoom.nodeName
						+ ".image";
			}
			// console.log("zhongleipath is " + zhongleipath);

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

			//var guanjianzi = currentRoom.keyInfo;
			var mingcheng = currentRoom.resourceName;
			moxingpath = "/content/shmateriallib/" + currentRoom.nodeName;

			//��ȡȨ��
			var Published = currentRoom.published;
			var canModify = "";
			if (userRole == "admin") {
				console.log("admin");
				$("#savebutton").css("display", "");
				$("#updateroomli").css("display", "");
				document.getElementById("savebutton").onclick = save;
			} else if (userRole == "yanshou") {
				console.log("yanshou");
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (userRole == "art" && Published == "true") {
				console.log("art and published");
				canModify = "disabled";
				$("#savebutton").css("display", "none");
				$("#updateroomli").css("display", "none");
			} else if (userRole == "art" && Published == "false") {
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

			//����������
			$("#room")
					.html(
							"<a currentvalue='"
										+ kongjianpath
										+ "' class='roomA'>position:"
									+ kongjian + "<\/a>");
			$("#roomP")
					.html(
							twoCategory(oneCategoryData[0], kongjianpath, "seat",
									canModify));
			//roomData = oneCategoryData[0].catData;

			$("#style")
					.html(
							"<a currentvalue='"
								+ fenggepath + "' class='styleA'>lashen:"
									+ fengge + "<\/a>");
			$("#styleP").html(
					twoCategory(oneCategoryData[1], fenggepath, "tensile",
							canModify));
			//styleData = oneCategoryData[1].catData;

			$("#name")
					.html(
							"<a href='#'>����: <\/a><input "+canModify+" class='nameInput' type='text' value='"+mingcheng+"' style='width:200px;'>");
			$("#modelpath").html(
					"<a href='#'>ģ�͵�ַ: <\/a><p class='modelpath'>" + moxingpath
							+ "<\/p>");
			$("#imgpanel").attr("src", attrvalue);
			document.getElementById("savebutton").onclick = save;
			//$("#savebutton").click(function() {
			//	save(moxingpath);
			//});

			//���ز��ʰ�ť���¼����
			$("#download").click(
					function() {
						$(".downloadA").attr(
								"href",
								"/userdata/shmateriallib/" + currentRoom.uuid
										+ ".7z");
						$(".downloadA")[0].click();
					});
			$(".roomA").click(function() {
				$("#roomPanel").css("display", "block");
			});
			$(".styleA").click(function() {
				$("#stylePanel").css("display", "block");
			});

			$("#closeRoomPanel").click(function() {
				$("#roomPanel").css("display", "none");
				kongjian = "";
				for (var x = 0; x < roomData.length; x++) {
					if (roomPath.indexOf(roomData[x].path) > -1) {
						kongjian += " " + roomData[x].resourceName;
					}
				}
				$("#room > a").html("position:" + kongjian);
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
				$("#style > a").html("lashen:" + fengge);
				$("#style > a").attr("currentvalue", stylePath);
			});
			
			if (currentRoom.selftype && currentRoom.category && currentRoom.feature
					&& currentRoom.resizable) {
				$("#selftype").val(currentRoom.selftype);
				$("#category").val(currentRoom.category);
				$("#feature").val(currentRoom.feature);
				$("#resizable").val(currentRoom.resizable);
			}

			addInputAction(currentRoom);
			addRadioAction(currentRoom);
			//displayCurrentValue();
		}

		//�ϴ����ʵ�ʱ�����ϴ����ļ���ʽ�Ƿ���ȷ 
		$("#update").click(function() {
			$('#update').hide();
			var content = JSON.stringify(moxingpath);
			var isInputFill = fileCheck();
			if (isInputFill[0]) {
				var options = {
					//queryData
					url : "/userdata/shmateriallib/updataMaterial",
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
				alert(isInputFill[1]);
				$('#update').show();
			}
		});

		function fileCheck() {
			var highfile = $("#high").attr("value");
			var lowfile = $("#low").attr("value");
			var prefile = $("#preview").attr("value");
			var alertContent = "";
			if (highfile == "" && lowfile == "" && prefile == "") {
				alertContent = "���±����ܶ�Ϊ�գ�";
			} else {
				if (highfile != "") {
					var highformat = highfile.substring(
							highfile.lastIndexOf(".") + 1, highfile.length);
					if (highformat != "blend") {
						alertContent += "��ģ��ʽ����Ϊ blend!";
					}
				}
				if (lowfile != "") {
					var lowformat = lowfile.substring(lowfile.lastIndexOf(".") + 1,
							lowfile.length);
					if (lowformat != "jpg") {
						alertContent += "��ģ��ʽ����Ϊjpg!";
					}
				}
				if (prefile != "") {
					var preformat = prefile.substring(prefile.lastIndexOf(".") + 1,
							prefile.length);
					if (preformat != "jpg") {
						alertContent += "Ԥ��ͼ�ĸ�ʽ����Ϊjpg!";
					}
				}
			}
			if (alertContent == "") {
				return [ true, alertContent ];
			} else {
				return [ false, alertContent ];
			}
		}

		//�����޸����Եİ�ť�¼�����  
		function save() {
			if (roomPath == "") {
				roomPath = $(".roomA").attr("currentvalue");
			}
			if (stylePath == "") {
				stylePath = $(".styleA").attr("currentvalue");
			}
			var savedata = {
				"seat" : roomPath,
				"tensile" : stylePath,
				"name" : $(".nameInput").attr("value"),
				"nodepath" : $(".modelpath").html(),
				"category" : $("#category").val(),
				"selftype" : $("#selftype").val(),
				"feature" : $("#feature").val(),
				"resizable" : $("#resizable").val(),
				"type" : 3,
			};
			//console.log(savedata);
			var options = {
				url : "/userdata/shmateriallib/saveMaterial",
				data : savedata,
				cache : false,
				dataType : "json",
				success : function(data) {
					alert("����ɹ�");
					roomPath = "";
					stylePath = "";
					$("#detailpanel").css("display", "none");
					console.log(data);
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

		//��̬���ɶ�ѡ��ť�ĺ��� 
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
		//��̬���ɵ�ѡ��ť�ĺ��� 
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

		//�ú���û�б����� 
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
				}
			}
		}

		//����ѡ���ఴť����¼�
		function addInputAction(currentRoom) {
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "modify"
						&& inputcheck[i].type == "checkbox") {
					inputcheck[i].onclick = modifyListener;
				}
			}
		}
		//����ѡ���ఴť����¼�
		function addRadioAction(currentRoom) {
			roomPath = currentRoom.seatPath;
			stylePath = currentRoom.tensilePath;
			//roomPath = currentRoom.roomPath;
			//stylePath = currentRoom.stylePath;
			//colorPath = currentRoom.colorSystemPath;
			//placeofPath = currentRoom.placeOfProductionPath;
			var inputcheck = document.getElementsByTagName("input");
			// //console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "modify"
						&& inputcheck[i].type == "radio") {
					inputcheck[i].onclick = modifyListener;
				}
			}
		}
		//�޸��¼��ĺ���
		function modifyListener() {
			var path = this.value;
			////console.log(path);
			var parent = this.parentNode;
			createModifyInfo(parent, path, this);
		}
		//�����޸����Ե����ݣ�Ϊ���ϴ���������Ȼ���ڷ����������޸� 
		function createModifyInfo(parent, path, elem) {
			if (parent.getAttribute("id") == "roomP") {
				if (elem.checked == true) {
					roomPath = path;
					console.log(roomPath);
				} else if (roomPath.length > 0) {
					roomPath = deleteSubString(roomPath, path);
					console.log(roomPath);
				}
			} else if (parent.getAttribute("id") == "styleP") {
				if (elem.checked == true) {
					stylePath = path;
					console.log(stylePath);
				} else if (stylePath.length > 0) {
					stylePath = deleteSubString(stylePath, path);
					console.log(stylePath);
				}
			}

		}

		//��̬��������ɸѡ��Ϣ�� ���չ�����ఴť �Ϳ��Կ��� 
		function category(it) {
			var out = '';
			//if (it.success) {
			for (var i = 0; i < it.categoryData.length; i++) {
				out += '<div class="category_list" alt="'
						+ (it.categoryData[i].resourceName) + '" catpath="'
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
			//}
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
			if (parent.getAttribute("alt") == "position") {
				if (elem.checked == true) {
					////console.log("checked test");
					room += path + ";";
					console.log(room);
				} else if (room.length > 0) {
					room = deleteSubString(room, path);
					console.log(room);
				}
			} else if (parent.getAttribute("alt") == "lashen") {
				if (elem.checked == true) {
					style += path + ";";
					console.log(style);
				} else if (style.length > 0) {
					style = deleteSubString(style, path);
					console.log(style);
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
				type : "material",
				isMananger : "true",
			};

			if (style && style != "") {
				querydata["1_tensilePath"] = style;
			}
			if (room && room != "") {
				querydata["1_seatPath"] = room;
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
				url : "/userdata/shmateriallib/queryData",
				data : defineQureyData(),
				cache : false,
				dataType : "json",
				success : function(data) {
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

		function definePageData() {
			var querydata = {
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "material",
				isMananger : "true",
			};

			if (style && style != "") {
				querydata["1_tensilePath"] = style;
			}
			if (room && room != "") {
				querydata["1_seatPath"] = room;
			}
			if (searchTerm && searchTerm != "") {
				querydata["0_resourceName"] = searchTerm.trim();
				querydata["0_keyInfo"] = searchTerm.trim();
				querydata["0_introduction"] = searchTerm.trim();
			}
			return querydata
		}