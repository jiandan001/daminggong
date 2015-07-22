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
					 + '</span> </div><div class="cat_body" path="'
					 + (it.categoryData[i].path)
					 + '" style="max-height:120px;overflow:auto;height:auto;">';
					for (var j = 0; j < it.categoryData[i].catData.length; j++) {
						out += ' <div style="padding: 2px; display: inline; width: 90px; height: 35px; padding: 5px 0px; float: left; margin-right: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"> <input class="check" type="checkbox" value="'
						 + (it.categoryData[i].catData[j].path)
						 + '"><label style="cursor: pointer; display: inline;" title="'
						 + (it.categoryData[i].resourceName)
						 + '">'
						 + (it.categoryData[i].catData[j].resourceName)
						 + '</label> </div>';
					}
					out += '</div></div>';
				}
			}
			return out;
		}

		function displayCategory() {
			var inputcheck = document.getElementsByTagName("input");
			// console.log(inputcheck.length);
			for (var i = 0; i < inputcheck.length; i++) {
				if (inputcheck[i].className == "check"
					 && inputcheck[i].type == "checkbox") {
					inputcheck[i].onclick = inputListener;
				}
			}
		}

		function inputListener() {
			var path = this.value;
			//console.log(path);
			var parent = this.parentNode;
			parent = parent.parentNode;
			parent = parent.parentNode;
			createRequestInfo(parent, path, this);
			sendAjax();
		}

		function createRequestInfo(parent, path, elem) {
			if (parent.getAttribute("alt") == "空间") {
				if (elem.checked == true) {
					//console.log("checked test");
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
				}
			}
		}

		function deleteSubString(string, substring) {
			string = string.substr(0, string.indexOf(substring))
				 + string.substr(string.indexOf(substring)
					 + substring.length + 1, string.length);
			return string;
		}

		function defineQureyData() {
			var querydata = {
				by : "publishDate",
				limit : 32,
				offset : 0,
				type : "model"
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
				success : function (data) {
					data = JSON.parse(data);
					loadpage(data);
				},
				error : function () {
					console.log("获取数据失败");
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		}

		function definePageData() {
			var querydata = {
				by : "publishDate",
				limit : OriMolNum,
				offset : OriMolNum * (ClickNum - 1),
				order : "des",
				type : "model"
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