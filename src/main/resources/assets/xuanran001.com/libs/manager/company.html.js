	$().ready(function(){
		$("#newGroup").click(function(){
			Mask.createMask();
			$("#newGroupPanel").toggle();
		});
	
		$("#newGroupSubmitButton").click(function(){
			var resourceName = $("input[name='companyName']",$("#newGroupForm")).val();
			var image = $("input[name='image']",$("#newGroupForm")).val();
			var logo = $("input[name='logo']",$("#newGroupForm")).val();
			if(!resourceName||resourceName==""){
				alert("请填写公司称");
				return;
			}else if(!image){
				alert("请选择欢迎图片");
				return;
			}else if(!logo){
				alert("请选择公司logo");
				return;
			}
			Mask.createWaiting();
			$("#newGroupPanel").toggle();
			var options = {
				url : "/userdata/group/create",
				cache : false,
				dataType: "json",
				success: function(data){
					$("#newGroupForm").resetForm();
					Mask.remove();
					Mask.removeWaiting();
					var result = $.parseJSON(data);
					if(result.success===true){
						var $ItemTable = $("#itemTable");
						$ItemTable.append(getItemView(result.data));
						$("button[value='"+result.data.resourceName+"']",$ItemTable).click(function(){
							var currentDom = $(this);
							Mask.createMask();
							$("#alterGroupPanel").toggle();
							$("#companyPath").val(currentDom.attr("path"));
							$("#companyName").val(currentDom.attr("value"));
						});
						$("button[value='"+result.data.path+"']",$ItemTable).click(function(){
							$("tr[id='"+$(this).attr("value")+"']",$ItemTable).fadeOut("fast",function(){$(this).remove();});
						});
					}
					console.log(result);
				},
				error : function(e){
					Mask.remove();
					Mask.removeWaiting();
					console.log(e);
				}
			};
			$("#newGroupForm").ajaxForm(options);
			$("#newGroupForm").submit();
		});
		
		$("#newGroupCancelButton").click(function(){
			$("#newGroupForm").resetForm();
			Mask.remove();
			$("#newGroupPanel").toggle();
		});
	
		$("#alterGroupSubmitButton").click(function(){
			var resourceName = $("input[name='companyName']",$("#alterGroupForm")).val();
			if(!resourceName||resourceName==""){
				alert("请填写公司称");
				return;
			}
			Mask.createWaiting();
			$("#alterGroupPanel").toggle();
			var options = {
				url : "/userdata/group/alter",
				cache : false,
				dataType: "json",
				success: function(data){
					$("#alterGroupForm").resetForm();
					Mask.remove();
					Mask.removeWaiting();
					var result = $.parseJSON(data);
					if(result.success===true){
						var $ItemTable = $("#itemTable");
						$("tr[id='"+result.data.path+"']",$ItemTable).fadeOut("fast",function(){$(this).remove();});
						$ItemTable.append(getItemView(result.data));
						$("button[value='"+result.data.resourceName+"']",$ItemTable).click(function(){
							var currentDom = $(this);
							Mask.createMask();
							$("#alterGroupPanel").toggle();
							$("#companyPath").val(currentDom.attr("path"));
							$("#companyName").val(currentDom.attr("value"));
						});
						$("button[value='"+result.data.path+"']",$ItemTable).click(function(){
							$("tr[id='"+$(this).attr("value")+"']",$ItemTable).fadeOut("fast",function(){$(this).remove();});
						});
					}
					console.log(items);
				},
				error : function(e){
					Mask.remove();
					Mask.removeWaiting();
					console.log(e);
				}
			};
			$("#alterGroupForm").ajaxForm(options);
			$("#alterGroupForm").submit();
		});
		$("#alterGroupCancelButton").click(function(){
			$("#alterGroupForm").resetForm();
			Mask.remove();
			$("#alterGroupPanel").toggle();
		});
		/** dot.js 生成代码
<tr id="{{=it.path}}">
	<td style="width:500px;border: #038ca9 1px solid;">{{=it.path}}</td>
	<td style="width:300px;border: #038ca9 1px solid;">{{=it.resourceName}}</td>
	<td style="border: #038ca9 1px solid;"><button value="{{=it.resourceName}}" path="{{=it.path}}" id="alter_{{=it.path}}" class="button small turquoise" style="margin: 1px;width: 98%;"><em class="icon-pencil"></em></button></td>
	<td style="border: #038ca9 1px solid;"><button value="{{=it.path}}" id="remove_{{=it.path}}" class="button small turquoise" style="margin: 1px;width: 98%;"><em class="icon-remove-sign"></em></button></td>
</tr>		
		*/
		function getItemView(it /**/) { var out='<tr id="'+(it.path)+'"><td style="width:500px;border: #038ca9 1px solid;">'+(it.path)+'</td><td style="width:300px;border: #038ca9 1px solid;">'+(it.resourceName)+'</td><td style="border: #038ca9 1px solid;"><button value="'+(it.resourceName)+'" path="'+(it.path)+'" id="alter_'+(it.path)+'" class="button small turquoise" style="margin: 1px;width: 98%;"><em class="icon-pencil"></em></button></td><td style="border: #038ca9 1px solid;"><button value="'+(it.path)+'" id="remove_'+(it.path)+'" class="button small turquoise" style="margin: 1px;width: 98%;"><em class="icon-remove-sign"></em></button></td></tr>';return out; }
		
		function initView(data){
			var $ItemTable = $("#itemTable");
			for(var index=0;index<data.length;index++){
				$ItemTable.append(getItemView(data[index]));
				$("button[value='"+data[index].resourceName+"']",$ItemTable).click(function(){
					var currentDom = $(this);
					Mask.createMask();
					$("#alterGroupPanel").toggle();
					$("#companyPath").val(currentDom.attr("path"));
					$("#companyName").val(currentDom.attr("value"));
				});
				$("button[value='"+data[index].path+"']",$ItemTable).click(function(){
					
					$("tr[id='"+$(this).attr("value")+"']",$ItemTable).fadeOut("fast",function(){$(this).remove();});
				});
			}
			
		}
		
		function getCompanys(callback){
			var options = {
				url : "/userdata/group/getAll",
				data: {},
				cache : false,
				dataType: "json",
				success: function(data){
					Mask.remove();
					Mask.removeWaiting();
					var items = $.parseJSON(data);
					callback(items);
					console.log(items);
				},
				error : function(e){
					Mask.remove();
					Mask.removeWaiting();
					console.log(e);
				}
			};
			$("#formTest").ajaxForm(options);
			$("#formTest").submit();
		};
		
		Mask.createMask();
		Mask.createWaiting();
		getCompanys(initView);
	});