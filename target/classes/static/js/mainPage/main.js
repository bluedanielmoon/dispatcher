/**
 * 整个前端主页面只有dispatcher一个变量 所有的变量名，函数都在这一个变量下 下主要有：常量，变量模块，控制台切换，通用，地图编辑，初始化
 * mapUtils.js是地图有关的函数集合 variable.js是关于表格和图像内容的集合
 */
/**
 * 1.站点道路添加后切换时没有取消
 * 2.区域的编辑提交和添加
 * 3.道路和区域的粘滞圈
 * 4.道路，站点的查重
 * 5.
 */

var dispatcher = {
	constants : null,// 保存常量
	modules : null,// 不同函数中需要用到的变量
	changeConsole : null,// 模块切换方法，用于切换页面下方的表格或是form表格
	refresh : {// 更新模块
		checkLastVisit :null,//检查session，看是否浏览过模块
		refreshMap : null,// 更新地图数据
		refreshTaskListData : null,// 更新任务列表
		refreshCarList : null,// 更新车辆列表
		refreshBlockList : null,// 更新地图区域信息
		refreshLineList : null,// 更新地图道路信息
		refreshSiteList : null,// 更新地图站点信息
		refreshRouteList : null,// 更新轨迹信息
		refreshLightCheck:null,//红绿灯检测数据更新
	},
	common : {// 通用模块
		sendAsk : null,// 发送车辆信息
		disConnect : null,// 断开实时数据连接
		moveCar : null,// 根据更新数据变化地图中车辆位置
		toggleExpandRow : null,// 展开和收缩表格中父子表
		coverPage : null,// 打开遮罩，用于地图选取操作
		clearCover : null,// 关闭遮罩
		resetButtons : null,// 重置按键
		doAjax : null,// 向后台请求数据
		setcookie : null,
		getcookie : null,
		checkcookie : null,
		setSessionStore : null,
		getSessionStore : null,
	},
	mapEdit : {// 地图编辑
		resetLinkCircles : null,//重置站点编辑时的站点处的小红圈
		createLinkCircles : null,//创建站点编辑时的站点处的小红圈
		toggleDrag : null,// 打开或关闭拖动功能
		chooseMap : null,// 选取地图站点元素
		clickCoords : null,// 用于传给mapUtils的回调函数，解绑地图点击
		chooseCar : null,// 回调函数，关于车辆点选
		toggleShow : null,// 地图元素的开闭
		editSite : null,// 设置站点响应事件
		setDragEndFunc : null,// 设置道路增加时拖动加号完毕的动作
		refreshMovedRoads : null,// 更新拖动过哪些道路，用于更新
		setLineDragger : null,// 设置路径的拖动按钮
		setBlockDragger:null,
		// createTempRoad:null,//不要直接调用,内部的方法
		setLinePlus : null,// 设置地图道路增加时小按钮
		setBlockPlus:null,
		setLineDragStyle : null,// 设置地图道路编辑时，整体样式
		setBlockDragStyle:null,
		resetLines : null,// 重置地图道路样式
		editLine : null,// 编辑道路主函数
		editBlock:null,
	},
	init : {// 初始化
		initCarConnect : null,// 初始化车辆实时数据连接，服务端推送数据
		initBootStrapTable : null,// 初始化bootstrap-table配置
		initMap : null,// 初始化地图
		initButton : null,// 初始化若干按钮
		initToolUp : null,// 初始化按键的提示信息
	}
};
dispatcher.constants = {
	COORDS_DECIMAL_COUNT : 5,// 每个坐标数据保存的位数
	EDIT_SITE_GLUECIRCLE_RADIOUS : 6,// 站点修改时粘滞圈的大小
}
dispatcher.modules = {
	client : null,// 车辆连接的客户端
	mapData : null,// 从后台来的地图的初始数据
	movedBlocks:[],
	movedSites : [],// 暂存地图编辑模块道路编辑时正在编辑的路
	movedLines : [],// 暂存地图编辑模块道路编辑时正在编辑的站点
	newSite : null,//增加一个站点时
	newLine : {// 暂存新增加一条道路时的坐标点
		shape : null,
		coords : []
	},
	newBlock:{// 暂存新增加一块区域时的坐标点
		shape : null,
		coords : []
	},
	glueCircles : [],// 用来暂存地图编辑模块站点修改时的圈圈
	lightCheck:[],//红绿灯检测的结果
};

dispatcher.changeConsole = function(type, id) {
	//存储切换过来的模块名称
	dispatcher.common.setSessionStore('consoleType', type);
	dispatcher.common.setSessionStore('consoleId', id);

	// 切换模块，要进行若干初始化
	$('#console').find('.console-item').hide();
	tables.isExpaned = false;
	dispatcher.mapEdit.toggleDrag(mapUtil.config.getSites(), false);
	dispatcher.mapEdit.resetLines();
	dispatcher.mapEdit.resetBlocks();
	dispatcher.mapEdit.resetLinkCircles();
	dispatcher.refresh.refreshMap();
	
	mapUtil.config.setPop(mapUtil.config.isPop());
	mapUtil.config.setShowCoords(mapUtil.config.isShowCoords());
	
	//按照类型进行切换
	switch (id) {
	case 'taskList':
		$('#showTable').bootstrapTable('refreshOptions', {
			tableName : 'taskList',
			columns : tables.taskTable.columns,
			detailView : false,
			uniqueId : 'id',// 代表是哪一列
			data : dispatcher.refresh.refreshTaskListData()
		});
		break;
	case 'normCars':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.normCarTable.columns,
			detailView : true,
			uniqueId : 'normCars',
			onExpandRow : tables.normCarTable.expandRow.route.table,
			data : dispatcher.refresh.refreshCarList()
		});
		break;
	case 'blockList':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.blockTable.columns,
			detailView : false,
			sortable : true,
			sortName : 'id',
			sortOrder : 'asc',
			data : dispatcher.refresh.refreshBlockList()
		});
		break;
	case 'blockEdit':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.blockEditTable.columns,
			data:dispatcher.modules.movedBlocks
		});
		dispatcher.mapEdit.editBlock();
		console.log(dispatcher.modules.movedBlocks);
		break;
	case 'siteList':

		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.siteTable.columns,
			detailView : false,
			sortable : true,
			sortName : 'id',
			sortOrder : 'asc',
			data : dispatcher.refresh.refreshSiteList()
		});
		break;
	case 'siteEdit':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.siteEditTable.columns,
			data : dispatcher.modules.movedSites
		});
		dispatcher.mapEdit.createLinkCircles();
		dispatcher.mapEdit.toggleDrag(mapUtil.config.getSites(), true);
		dispatcher.mapEdit.editSite();
		break;
	case 'roadList':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.roadTable.columns,
			detailView : false,
			sortable : true,
			sortName : 'id',
			sortOrder : 'asc',
			data : dispatcher.refresh.refreshLineList()
		});
		break;
	case 'roadEdit':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.roadEditTable.columns,
			data : dispatcher.modules.movedLines
		});
		dispatcher.mapEdit.editLine();
		break;
	case 'carManage':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.carTable.columns,
			detailView : false
		});
		$('#showTable').bootstrapTable('load', tables.carTable.data);
		break;
	case 'staffManage':
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.staffTable.columns,
			detailView : false
		});
		$('#showTable').bootstrapTable('load', tables.staffTable.data);
		break;
	case 'produceChart':
		myChart.setOption(options.produce);
		break;
	case 'workChart':
		myChart.setOption(options.work);
		break;
	case 'lightCheck'://红绿灯检测
		$('#showTable').bootstrapTable('refreshOptions', {
			columns : tables.lightTable.columns,
			detailView : false,
			sortable : true,
			sortName : 'time',
			sortOrder : 'desc',
			pagination:true,
			pageNumber:1,
			pageSize:10,
			data:dispatcher.modules.lightCheck
		});
		//data交由init模块carConnect中的订阅函数来指定更新
		break;

	}
	// 开始form表单的切换
	$('#' + type).show();
	if (type == 'console-mapHeader') {
		$('#console-table').show();
	}
	if (type == 'console-sitePlus' || type == 'console-siteEdit'
			|| type == 'console-roadPlus' || type == 'console-blockPlus') {
		$('#console-mapHeader').show();
	}
	// 结束form表单的切换
	dispatcher.init.initToolUp();// 每次切换都要激活一次toolup
}

dispatcher.refresh = {

	checkLastVisit : function() {
		var type = dispatcher.common.getSessionStore('consoleType');
		var id = dispatcher.common.getSessionStore('consoleId');
		if (type==null || id==null) {// 不是第一次来
			type='console-table';
			id='normCars';
		}
		dispatcher.changeConsole(type, id);
	},
	refreshMap : function() {
		mapUtil.config.toggleMap(false);
		dispatcher.modules.mapData = dispatcher.common.doAjax("map/data",
				"get", false, {});
		mapUtil.config.createMap(dispatcher.modules.mapData);
		mapUtil.config.toggleMap(true);
	},
	refreshTaskListData : function() {
		var tasks = dispatcher.common.doAjax('task/all', 'get', false, {});
		var taskList = mapUtil.task.refreshTasks(tasks);
		return tasks;
	},
	refreshCarList : function() {
		var cars = dispatcher.common.doAjax("car/all", 'get', false, {});
		var carList = mapUtil.act.refreshCars(cars);// 更新前端的
		return carList;
	},
	refreshBlockList : function() {
		return dispatcher.modules.mapData.blocks.features;
	},
	refreshLineList : function() {
		return dispatcher.modules.mapData.lines.features;
	},
	refreshSiteList : function() {
		return dispatcher.modules.mapData.sites.features;
	},
	refreshRouteList : function(carID, index) {
		var paths = dispatcher.common.doAjax("car/allRecords", "get", false, {
			carId : carID
		});
		var date = new Date();
		var result = [];
		for (var i = 0; i < paths.length; i++) {
			var route = {
				carID : carID,
				id : null,
				start : null,
				end : null,
				startTime : null,
				endTime : null,
				fatherIndex : index
			}
			route.id = "路径" + (i + 1);

			date.setTime(parseInt(paths[i][0]));
			route.start = date.toLocaleString();
			route.startTime = paths[i][0];

			date.setTime(parseInt(paths[i][1]));
			route.end = date.toLocaleString();
			route.endTime = paths[i][1];
			result.push(route);
		}
		return result;
	},
	refreshLightCheck:function(light){
		var date= new Date();
		date.setTime(light.time);
		var output;
		if(light.result){
			output="检测通过";
		}else{
			output="检测不通过";
		}
		dispatcher.modules.lightCheck.push({
				id:(dispatcher.modules.lightCheck.length+1),
				time:date.toLocaleString(),
				result:output
				});
		var id = dispatcher.common.getSessionStore('consoleId');
		if ( id=='lightCheck') {// 如果当前显示的是红绿灯检测表格
			$('#showTable').bootstrapTable('load', {
				data:dispatcher.modules.lightCheck
			});
		}
	}
}
dispatcher.common = {
	sendAsk : function() {
		dispatcher.modules.client.send("car/welcome", {
			priority : 9
		}, JSON.stringify({
			'name' : 'daniel',
			'age' : 20
		}));
	},
	disConnect : function() {
		dispatcher.modules.client.disconnect();
		console.log("中断与服务端的连接");
	},
	moveCar : function(singleCar) {
		if (singleCar != "" && singleCar != null
				&& typeof (singleCar) != "undefined") {
			var pos = [];
			pos[0] = parseFloat(singleCar.pos[0]);
			pos[1] = parseFloat(singleCar.pos[1]);
			var findCar = mapUtil.act.getCarByName(singleCar.id);
			if (singleCar.path.length > 0) {
				var exchangePath = mapUtil.utils
						.exchangeLatlng(singleCar.path[singleCar.path.length - 1]);
				mapUtil.act.showCarPath(findCar);
				mapUtil.act.refreshCarPath(findCar, exchangePath,
						findCar.showPath);
			}
			mapUtil.act.move(singleCar.id, pos);// 模拟数据
		}
	},
	// true,进行闭或开,false,进行闭开操作
	toggleExpandRow : function(flag, index) {

		if (flag) {
			if (tables.isExpaned) {
				$('#showTable').bootstrapTable('collapseRow', index);
				tables.isExpaned = false;
			} else {
				$('#showTable').bootstrapTable('expandRow', index);
				tables.isExpaned = true;
			}
		} else {
			$('#showTable').bootstrapTable('collapseRow', index);
			$('#showTable').bootstrapTable('expandRow', index);
			tables.isExpaned = true;
		}
	},
	coverPage : function() {
		$('#cover').css("display", "block").click(function() {
			dispatcher.common.clearCover("hhh");
		});
		$('.sidebar').click(function() {
			dispatcher.common.clearCover("hhhggg");
		});
		$('#map').css("z-index", "1002");

	},
	clearCover : function(x) {
		$('#cover').css("display", "none");
		$('#map').css("z-index", "auto");
	},
	resetButtons : function(className, noReset, value) {
		$('#showTable').find('.' + className).not(noReset).text(value);
	},
	doAjax : function(url, type, async, data) {
		if (url != "car/all") {
			console.log("准备进行-----  " + url);
		}
		var target;
		$.ajax({
			url : url,
			type : type,
			async : async,
			contentType : "application/x-www-form-urlencoded;charset=utf-8",
			// 发送时的编码信息
			data : data,
			success : function(result) {
				target = result;
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(url + '    进行失败');
				target = null;
			}
		});
		return target;
	},
	setcookie : function(key, value, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = key + "=" + value + "; " + expires;
	},
	getcookie : function() {
		var cookies = document.cookie;
		console.log(cookies);
	},
	checkcookie : function() {
	},
	setSessionStore : function(key, value) {
		sessionStorage.setItem(key, value);
	},
	getSessionStore : function(key) {
		return sessionStorage.getItem(key);
	},
	removeSessionStore : function(type) {
		window.sessionStorage && window.sessionStorage.removeItem(type);
	},

}

dispatcher.mapEdit = {

	resetLinkCircles : function() {
		mapUtil.config.removeLinkCircles(dispatcher.modules.glueCircles);
	},
	createLinkCircles : function() {
		dispatcher.modules.glueCircles = mapUtil.config.createLinkCircles();
		mapUtil.config.addLinkCircles(dispatcher.modules.glueCircles);
	},
	toggleDrag : function(array, flag) {

		if (array.length > 0 && array[0].marker) {
			if (flag) {
				for ( var i in array) {
					array[i].marker.dragging.enable();
				}
			} else {
				for ( var i in array) {
					array[i].marker.dragging.disable();
				}
			}
		}
	},
	chooseMap : function() {// 指定地图元素
		if (arguments.length == 2 && $('#' + arguments[0])
				&& typeof (arguments[1]) != "undefined") {
			$('#' + arguments[0]).text(arguments[1].name);

			dispatcher.common.clearCover();
			mapUtil.config.unbindLayerClick();
		}
	},
	clickCoords : function(coords, btn) {
		if (arguments.length == 2 && $(btn) && typeof (coords) != "undefined") {
			$(btn).text(coords);
			dispatcher.modules.newSite = coords;
			dispatcher.common.clearCover();
			mapUtil.config.unbindMapClick();
		}
	},
	clickLineCoords : function(newCoords, btn) {
		dispatcher.modules.newLine.coords.push(newCoords);
		if (dispatcher.modules.newLine.coords.length == 1) {
			// 提示不能只选择一个点
		} else if (dispatcher.modules.newLine.coords.length == 2) {
			dispatcher.modules.newLine.shape = L.polyline(
					dispatcher.modules.newLine.coords, mapUtil.resource
							.getMarker("redPolyLine"));
			mapUtil.config.toggleOneShape(dispatcher.modules.newLine.shape,
					true);
		} else {
			dispatcher.modules.newLine.shape.addLatLng(newCoords);
		}

		$(btn).text("已选取" + dispatcher.modules.newLine.coords.length + "个点");

	},
	clickBlockCoords: function(newCoords, btn) {
		dispatcher.modules.newBlock.coords.push(newCoords);
		if (dispatcher.modules.newBlock.coords.length == 1) {
			// 提示不能只选择一个点
		} else if (dispatcher.modules.newBlock.coords.length == 2) {
			dispatcher.modules.newBlock.shape = L.polygon(
					dispatcher.modules.newBlock.coords, mapUtil.resource
							.getMarker("blueBlock"));
			mapUtil.config.toggleOneShape(dispatcher.modules.newBlock.shape,
					true);
		} else {
			dispatcher.modules.newBlock.shape.addLatLng(newCoords);
		}
		console.log(dispatcher.modules.newBlock.coords);
		$(btn).text("已选取" + dispatcher.modules.newBlock.coords.length + "个点");

	},
	stopLineCoords : function(newCoords, btn) {
		if (arguments.length == 2 && $(btn)
				&& typeof (newCoords) != "undefined") {
			$(btn).text("共选取" + dispatcher.modules.newLine.coords.length+ "个点");
			dispatcher.common.clearCover();
			mapUtil.config.unBindMapManyClick();
		}
	},
	stopBlockCoords : function(newCoords, btn) {
		if (arguments.length == 2 && $(btn)
				&& typeof (newCoords) != "undefined") {
			$(btn).text("共选取" + dispatcher.modules.newBlock.coords.length
									+ "个点");
			dispatcher.common.clearCover();
			mapUtil.config.unBindMapManyClick();
		}
	},
	chooseCar : function(button, car, taskID) {// 指定车辆
		if (arguments.length == 3 && $(button) && typeof (car) != "undefined"
				&& taskID) {

			$(button).text(car.info.id);
			mapUtil.task.assignCar(mapUtil.task.getTaskById(taskID), car);
			dispatcher.common.doAjax("task/assginCar", "post", false, {
				taskId : taskID,
				carId : car.info.id
			});

			dispatcher.common.clearCover();
			mapUtil.act.unbindCarClick();
		}
	},
	toggleShow : function(type) {
		var show = $("#" + type);
		if (type == 'Coords') {
			if (show.text() == "开启") {
				show.text("关闭")
				mapUtil.config.setShowCoords(true);
			} else {
				show.text("开启")
				mapUtil.config.setShowCoords(false);
			}
		} else if (type == 'Blocks') {
			if (show.text() == "隐藏") {
				show.text("显示");
				mapUtil.config.removeShow('block');
			} else {
				show.text("隐藏");
				mapUtil.config.show('block');
			}
		} else if (type == 'Lines') {
			if (show.text() == "隐藏") {
				show.text("显示");
				mapUtil.config.removeShow('lines');
			} else {
				show.text("隐藏");
				mapUtil.config.show('lines');
			}
		} else if (type == 'Points') {
			if (show.text() == "隐藏") {
				show.text("显示");
				mapUtil.config.removeShow('points');
			} else {
				show.text("隐藏");
				mapUtil.config.show('points');
			}
		} else {
			if (show.text() == "开启") {
				show.text("关闭");
				mapUtil.config.setPop(true);
			} else {
				show.text("开启");
				mapUtil.config.setPop(false);
			}
		}
	},
	editSite : function() {// 设置站点响应事件
		var sites = mapUtil.config.getSites();
		for ( var i in sites) {
			let
			index = i;
			sites[index].marker.on('dragend', function(ev) {
				// 先判断是否需要挪动marker
				if (dispatcher.modules.glueCircles.length > 0) {
					var result = mapUtil.config.checkLinkCircle(
							dispatcher.modules.glueCircles, sites[index].marker
									.getLatLng());
					if (result != null) {
						sites[index].marker.setLatLng(result);
					}
				}
				var sigSite = mapUtil.utils.getArrayIndex(
						dispatcher.modules.movedSites, 'id', sites[index].id);
				if (sigSite == null) {
					dispatcher.modules.movedSites.push({
						id : sites[index].id,
						properties : {
							name : sites[index].name,
						},
						newPos : sites[index].marker.getLatLng()
					});
				} else {
					sigSite.newPos = sites[index].marker.getLatLng();
				}
				$('#showTable').bootstrapTable('load',
						dispatcher.modules.movedSites);
			});
		}
	},
	setDragEndFunc : function(road, index, dragger) {
		mapUtil.config.toggleOneShape(road.shape, false);
		road.shape=null;
		var originInfo = mapUtil.utils.getArrayIndex(
				dispatcher.modules.mapData.lines.features, 'id', road.id);
		
		var roadInfo=mapUtil.utils.deepCopy(originInfo);
		if (index == 0) {
			roadInfo.geometry.coordinates[index][0][0] = dragger.getLatLng().lng;
			roadInfo.geometry.coordinates[index][0][1] = dragger.getLatLng().lat;

			road.pointPlus[index].setLatLng(L.latLng(
									(road.draggers[index].getLatLng().lat + road.draggers[parseInt(index) + 1]
											.getLatLng().lat) / 2,
									(road.draggers[index].getLatLng().lng + road.draggers[parseInt(index) + 1]
											.getLatLng().lng) / 2));
		} else if (index != 0 && index != road.draggers.length - 1) {
			roadInfo.geometry.coordinates[index - 1][1][0] = dragger
					.getLatLng().lng;
			roadInfo.geometry.coordinates[index - 1][1][1] = dragger
					.getLatLng().lat;
			roadInfo.geometry.coordinates[index][0][0] = dragger.getLatLng().lng;
			roadInfo.geometry.coordinates[index][0][1] = dragger.getLatLng().lat;
			road.pointPlus[index - 1].setLatLng(L.latLng(
									(road.draggers[parseInt(index) - 1]
											.getLatLng().lat + road.draggers[index]
											.getLatLng().lat) / 2,
									(road.draggers[parseInt(index) - 1]
											.getLatLng().lng + road.draggers[index]
											.getLatLng().lng) / 2));
			road.pointPlus[index].setLatLng(L.latLng(
									(road.draggers[index].getLatLng().lat + road.draggers[parseInt(index) + 1]
											.getLatLng().lat) / 2,
									(road.draggers[index].getLatLng().lng + road.draggers[parseInt(index) + 1]
											.getLatLng().lng) / 2));
		} else {
			roadInfo.geometry.coordinates[index - 1][1][0] = dragger
					.getLatLng().lng;
			roadInfo.geometry.coordinates[index - 1][1][1] = dragger
					.getLatLng().lat;
			
			road.pointPlus[index - 1].setLatLng(L.latLng(
									(road.draggers[parseInt(index) - 1]
											.getLatLng().lat + road.draggers[index]
											.getLatLng().lat) / 2,
									(road.draggers[parseInt(index) - 1]
											.getLatLng().lng + road.draggers[index]
											.getLatLng().lng) / 2));
		}
		 

		console.log(mapUtil.utils.getArrayIndex(
				dispatcher.modules.mapData.lines.features, 'id', road.id));
		console.log(roadInfo);
		dispatcher.mapEdit.createTempRoad(roadInfo, road);
	},
	createTempRoad : function(roadInfo, road) {
		var tempRoad = mapUtil.config.createRoad(roadInfo);
		let tempShape = tempRoad.shape;
		let tempPos = tempRoad.pos;

		road.shape = tempShape;
		road.pos = tempPos;
		road.shape.setStyle(mapUtil.resource.getMarker("heavyPolyLine"));
		console.log(road);
		mapUtil.config.toggleOneShape(road.shape, true);
		road.shape.on('click', function(ev) {
			mapUtil.config.toggleLineDragIcons(road.id);
		});
	},
	setBlockDragEndFunc:function(block,index,count,dragger){
		mapUtil.config.toggleOneShape(block.shape, false);
		var blockInfo = mapUtil.utils.getArrayIndex(
				dispatcher.modules.mapData.blocks.features, 'id', block.id);
		
		
		
		blockInfo.geometry.coordinates[0][index][count][0] = dragger.getLatLng().lng;
		blockInfo.geometry.coordinates[0][index][count][1] = dragger.getLatLng().lat;
		var countLength=block.pointPlus[index].length-1;
		if (count == 0) {		
			block.pointPlus[index][countLength].setLatLng(L.latLng(
							(block.draggers[index][count].getLatLng().lat + block.draggers[index][countLength]
									.getLatLng().lat) / 2,
							(block.draggers[index][count].getLatLng().lng + block.draggers[index][countLength]
									.getLatLng().lng) / 2));
			block.pointPlus[index][count].setLatLng(L.latLng(
							(block.draggers[index][count].getLatLng().lat + block.draggers[index][parseInt(count) + 1]
									.getLatLng().lat) / 2,
							(block.draggers[index][count].getLatLng().lng + block.draggers[index][parseInt(count) + 1]
									.getLatLng().lng) / 2));
		} else if (count != 0 && count != countLength) {			
			block.pointPlus[index][count-1].setLatLng(L.latLng(
							(block.draggers[index][count - 1]
									.getLatLng().lat + block.draggers[index][count]
									.getLatLng().lat) / 2,
							(block.draggers[index][count - 1]
									.getLatLng().lng + block.draggers[index][count]
									.getLatLng().lng) / 2));
			block.pointPlus[index][count].setLatLng(L.latLng(
							(block.draggers[index][count].getLatLng().lat + block.draggers[index][parseInt(count) + 1]
									.getLatLng().lat) / 2,
							(block.draggers[index][count].getLatLng().lng + block.draggers[index][parseInt(count) + 1]
									.getLatLng().lng) / 2));
		} else {
			block.pointPlus[index][count-1].setLatLng(L.latLng(
					(block.draggers[index][count - 1]
							.getLatLng().lat + block.draggers[index][count]
							.getLatLng().lat) / 2,
					(block.draggers[index][count - 1]
							.getLatLng().lng + block.draggers[index][count]
							.getLatLng().lng) / 2));
			block.pointPlus[index][count].setLatLng(L.latLng(
					(block.draggers[index][count].getLatLng().lat + block.draggers[index][0]
							.getLatLng().lat) / 2,
					(block.draggers[index][count].getLatLng().lng + block.draggers[index][0]
							.getLatLng().lng) / 2));
		}
		dispatcher.mapEdit.createTempBlock(blockInfo, block);
	},
	createTempBlock : function(blockInfo, block) {
		var tempBlock = mapUtil.config.createBlock(blockInfo);
		let tempShape = tempBlock.shape;
		let tempPos = tempBlock.pos;
		
		block.shape = tempShape;
		block.pos = tempPos;
		block.shape.setStyle(mapUtil.resource.getMarker("blueBlock"));
		mapUtil.config.toggleOneShape(block.shape, true);
		block.shape.on('click', function(ev) {	
			dispatcher.mapEdit.setBlueBlock(block);
			mapUtil.config.toggleBlockDragIcons(block.id);
		});
	},
	refreshMovedRoads : function(road) {
		var sinRoad = mapUtil.utils.getArrayIndex(
				dispatcher.modules.movedLines, 'id', road.id);
		if (sinRoad == null) {
			dispatcher.modules.movedLines.push(road);
		}
		$('#showTable').bootstrapTable('load', dispatcher.modules.movedLines);
	},
	refreshMovedBlocks:function(block){
		console.log("111");
		var sinBlock = mapUtil.utils.getArrayIndex(
				dispatcher.modules.movedBlocks, 'id', block.id);
		if (sinBlock == null) {
			dispatcher.modules.movedBlocks.push(block);
		}
		$('#showTable').bootstrapTable('load', dispatcher.modules.movedBlocks);
	},
	setLineDragger : function(road) {
		for ( var i in road.draggers) {
			let index = i;
			road.draggers[index].on('dragend', function(ev) {
				dispatcher.mapEdit.setDragEndFunc(road, index,
						road.draggers[index]);
				dispatcher.mapEdit.refreshMovedRoads(road);

			});
		}
	},
	toggoleLineDraggers:function(target,flag){
		if(flag){
			for ( var i in target.draggers) {
				let index = i;							
				target.draggers[index].dragging.enable();			
			}
		}else{
			for ( var i in target.draggers) {
				let index = i;							
				target.draggers[index].dragging.disable();			
			}
		}
	},
	setBlockDragger:function(block){
		for ( var i in block.draggers) {
			let index = i;
			for(var j in block.draggers[i]){
				let count=j;
				block.draggers[index][count].on('dragend', function(ev) {
					dispatcher.mapEdit.setBlockDragEndFunc(block, index,count,
							block.draggers[index][count]);
					dispatcher.mapEdit.refreshMovedBlocks(block);
				});
			}
		}
	},
	toggoleBlockDraggers:function(target,flag){
		if(flag){
			for ( var i in target.draggers) {
				let index = i;
				for(var j in target.draggers[i]){
					let count=j;					
					target.draggers[index][count].dragging.enable();
				}
			}
		}else{//这里else其实没意义，因为当dragger图标被移除后，即地图上看不见，dragging就会变成未定义
			for ( var i in target.draggers) {
				let index = i;
				for(var j in target.draggers[i]){
					let count=j;
					target.draggers[index][count].dragging.disable();
				}
			}
		}
	},
	setLinePlus : function(road) {
		for ( var i in road.pointPlus) {
			let index = i;
			road.pointPlus[index].on('click',function(ev) {
								mapUtil.config.toggleLineDragIcons(road.id);
								mapUtil.config.toggleOneShape(road.shape, false);
								var roadInfo = mapUtil.utils
										.getArrayIndex(
												dispatcher.modules.mapData.lines.features,
												'id', road.id);

								roadInfo.geometry.coordinates
										.splice(index,0,[[roadInfo.geometry.coordinates[index][0][0],
														roadInfo.geometry.coordinates[index][0][1] ],
														[road.pointPlus[index].getLatLng().lng,
														road.pointPlus[index].getLatLng().lat, ] ]);
								roadInfo.geometry.coordinates[parseInt(index) + 1][0][0] = road.pointPlus[index]
										.getLatLng().lng;
								roadInfo.geometry.coordinates[parseInt(index) + 1][0][1] = road.pointPlus[index]
										.getLatLng().lat;

								dispatcher.mapEdit.createTempRoad(roadInfo,
										road);

								mapUtil.config.createSingleDragMarkers(road);
								mapUtil.config.toggleLineDragIcons(road.id);
								//必须得上面的先把图标加载，才能设置拖动
								dispatcher.mapEdit.toggoleLineDraggers(road,true);
								dispatcher.mapEdit.setLineDragger(road);
								dispatcher.mapEdit.setLinePlus(road);

								dispatcher.mapEdit.refreshMovedRoads(road);
							});
		}
	},
	setBlockPlus:function (block){
		for ( var i in block.pointPlus) {
			let index = i;
			for(var j in block.pointPlus[i]){
				let count=j;
				block.pointPlus[index][count].on('click', function(ev) {
					mapUtil.config.toggleBlockDragIcons(block.id);
					mapUtil.config.toggleOneShape(block.shape, false);
					var blockInfo = mapUtil.utils.getArrayIndex(
									dispatcher.modules.mapData.blocks.features,
									'id', block.id);
					blockInfo.geometry.coordinates[0][parseInt(index)].splice(parseInt(count)+1,0,
											[block.pointPlus[parseInt(index)][parseInt(count)].getLatLng().lng,
											 block.pointPlus[parseInt(index)][parseInt(count)].getLatLng().lat,]);
					dispatcher.mapEdit.createTempBlock(blockInfo,block);

					mapUtil.config.createSingleBlockDragMarkers(block);
					mapUtil.config.toggleBlockDragIcons(block.id);
					//必须得上面的先把图标加载，才能设置拖动
					dispatcher.mapEdit.toggoleBlockDraggers(block,true);
					dispatcher.mapEdit.setBlockDragger(block);
					dispatcher.mapEdit.setBlockPlus(block);

					dispatcher.mapEdit.refreshMovedBlocks(block);
				});
			}		
		}
	},
	setLineDragStyle : function(road) {
		road.shape.setStyle(mapUtil.resource.getMarker("heavyPolyLine"));
		road.shape.on('click', function(ev) {
			mapUtil.config.toggleLineDragIcons(road.id);
			if(road.isDrag){
				dispatcher.mapEdit.toggoleLineDraggers(road,road.isDrag);
			}	
		});
		dispatcher.mapEdit.setLineDragger(road);
		dispatcher.mapEdit.setLinePlus(road);
	},
	setBlockDragStyle : function(block) {	
		block.shape.on('click', function(ev) {
			dispatcher.mapEdit.setBlueBlock(block);
			mapUtil.config.toggleBlockDragIcons(block.id);
			if(block.isDrag){
				dispatcher.mapEdit.toggoleBlockDraggers(block,block.isDrag);
			}
		});	
		dispatcher.mapEdit.setBlockDragger(block);
		dispatcher.mapEdit.setBlockPlus(block);

	},
	setBlueBlock:function(block){
		var blocks=mapUtil.config.getBlocks();
		for ( var i in blocks) {
			if(blocks[i].id!=block.id){
				blocks[i].shape.setStyle(mapUtil.resource.getMarker("block"));
			}				
		}
		block.shape.setStyle(mapUtil.resource.getMarker("blueBlock"));
	},
	resetLines : function() {
		var roads = mapUtil.config.getRoads();
		for ( var i in roads) {
			roads[i].shape.off('click');
			roads[i].shape.setStyle(mapUtil.resource.getMarker("polyLine"));
			for ( var j in roads[i].pointPlus) {
				roads[i].pointPlus[j].off('click');
				mapUtil.config.toggleOneShape(roads[i].pointPlus[j], false);
			}
			for ( var k in roads[i].draggers) {
				roads[i].draggers[k].off('dragend');
				mapUtil.config.toggleOneShape(roads[i].draggers[k], false);
			}
		}
	},
	resetBlocks : function() {
		var blocks = mapUtil.config.getBlocks();
		for ( var i in blocks) {
			blocks[i].shape.off('click');
			blocks[i].shape.setStyle(mapUtil.resource.getMarker("block"));
			for ( var j in blocks[i].pointPlus) {
				for(var k in blocks[i].pointPlus[j]){
					blocks[i].pointPlus[j][k].off('click');
					mapUtil.config.toggleOneShape(blocks[i].pointPlus[j][k], false);
				}		
			}
			for ( var j in blocks[i].draggers) {
				for(var k in blocks[i].draggers[j]){
					blocks[i].draggers[j][k].off('dragend');
					mapUtil.config.toggleOneShape(blocks[i].draggers[j][k], false);
				}		
			}
		}
	},
	editLine : function() {
		var roads = mapUtil.config.getRoads();
		mapUtil.config.createLineDraggers();
		for ( var i in roads) {
			dispatcher.mapEdit.setLineDragStyle(roads[i]);
		}
	},
	editBlock:function(){
		var blocks=mapUtil.config.getBlocks();
		mapUtil.config.createBlockDraggers();
		for ( var i in blocks) {
			dispatcher.mapEdit.setBlockDragStyle(blocks[i]);
		}
	},
}

dispatcher.init = {
	initCarConnect : function() {
		var socket = new SockJS('/map/endpointCar');// 连接endPoint
		dispatcher.modules.client = Stomp.over(socket);// Stomp的客户端,相当于sockJs的框架
		dispatcher.modules.client.connect({}, function(frame) {// headers,callback
			console.log("与服务端建立车辆实时信息连接");
			//这里的subscribe和 @SendTo("/data/carData")中严格对应
			dispatcher.modules.client.subscribe("/data/carData", function(
					responce) {
				var cars = JSON.parse(responce.body);
				if (cars != null) {
					// 更新前端的列表
					if (cars.length != mapUtil.act.getCarList().length) {
						mapUtil.act.refreshCars(cars);
					}
					for (var i = 0; i < cars.length; i++) {
						dispatcher.common.moveCar(cars[i]);
					}
				} else {
					console.log("没有车辆数据");
				}
			});
			dispatcher.modules.client.subscribe("/data/lightCheck", function(
					responce) {
				var light = JSON.parse(responce.body);
				if (light != null) {
					dispatcher.refresh.refreshLightCheck(light);
				} else {
					console.log("没有红绿灯检测数据");
				}
				
			});
		}, function(frame) {// headers,callback
			console.log("与服务端建立连接失败");

		});
	},
	initBootStrapTable : function() {
		$('#showTable').bootstrapTable({
			// url : 'ResultFileRequest.do', // 请求后台的URL（*）
			// method : 'get', // 请求方式（*）
			// toolbar : '#toolbar', // 工具按钮用哪个容器
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			// pagination : true, // 是否显示分页（*）
			sortable : true, // 是否启用排序
			// sortOrder : "asc", // 排序方式
			// queryParams : oTableInit.queryParams,// 传递参数（*）
			// sidePagination : "client", // 分页方式：client客户端分页，server服务端分页（*）
			// pageNumber :1, // 初始化加载第一页，默认第一页 pageSize : 10, // 每页的记录行数（*）
			// pageList : [ 10, 25,50, 100 ], // 可供选择的每页的行数（*）
			// search : false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			// strictSearch : true,
			showColumns : false, // 是否显示所有的列
			// showRefresh : false, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			clickToSelect : true, // 是否启用点击选中行
			// height : 500, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ID", // 每一行的唯一标识,表示的是列名称
			showToggle : false, // 是否显示详细视图和列表视图的切换按钮
			cardView : false, // 是否显示详细视图
			detailView : true,// 是否显示父子表
		// onPostBody:function(){},
		// onPostHeader:function(){},
		// onRefreshOptions:function(){},
		// onPreBody:function(){},
		});
	},
	initMap : function() {
		dispatcher.refresh.refreshMap();

		var cars = dispatcher.common.doAjax("car/all", 'get', false, {});
		var carList = mapUtil.act.refreshCars(cars);// 更新前端的
		mapUtil.act.showAllCars();

		var tasks = dispatcher.common.doAjax('task/all', 'get', false, {});
		var taskList = mapUtil.task.refreshTasks(tasks);
	},
	initButton : function() {
		$(".list_dtt").on("click", function() {
			if ($(this).hasClass("unfold2")) {
				$(this).removeClass("unfold2").find('ul').slideUp();
			} else {
				$(this).addClass("unfold2").find('ul').slideDown();
			}
			$(".list_lii").on("click", function() {
				event.stopPropagation();
			});
		});

		$(".list_dt").on(
				"click",
				function() {
					$('.list_dd').stop();
					$(this).siblings("dt").removeClass("unfold");
					if ($(this).hasClass("unfold")) {
						$(this).removeClass("unfold").siblings("dd").slideUp();
					} else {
						$(this).addClass("unfold").next().slideDown().siblings(
								"dd").slideUp();
					}
				});
		$('.cover-map').click(dispatcher.common.coverPage);
		// 单击某一按键，在按键上显示站点
		$('.site-choose').click(chooseSite);

		$('#sub-task').click(submitTask);

		$('.coords-choose').click(chooseCoords);

		$('#sub-site').click(submitNewSite);

		$('.road-choose').click(chooseRoad);

		$('#sub-road').click(submitNewRoad);
		
		$('.block-choose').click(chooseBlock);

		$('#sub-block').click(submitNewBlock);
		
		function chooseBlock() {
			dispatcher.common.coverPage();
			mapUtil.config.bindMapManyClick(dispatcher.mapEdit.clickBlockCoords,
					dispatcher.mapEdit.stopBlockCoords, this,
					dispatcher.constants.COORDS_DECIMAL_COUNT);
		}

		function chooseRoad() {
			dispatcher.common.coverPage();
			mapUtil.config.bindMapManyClick(dispatcher.mapEdit.clickLineCoords,
					dispatcher.mapEdit.stopLineCoords, this,
					dispatcher.constants.COORDS_DECIMAL_COUNT);
		}
		function submitNewBlock() {
			var name = $('#console-blockPlus').find('form').children().eq(0)
			.find('input').val();
			var pos = [];
			var count = 0;
			for ( var i in dispatcher.modules.newBlock.coords) {
				pos[count++] = dispatcher.modules.newBlock.coords[i].lng
						.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
				pos[count++] = dispatcher.modules.newBlock.coords[i].lat
						.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
			}
			dispatcher.common.doAjax("map/addBlock", 'post', false, {
				blockName : name,
				newPos : pos
			});
			mapUtil.config.toggleOneShape(dispatcher.modules.newBlock.shape,false);
			dispatcher.modules.newBlock = {
				shape : null,
				coords : []
			};
			dispatcher.changeConsole('console-mapHeader', 'blockList');
		}

		function submitNewRoad() {
			var name = $('#console-roadPlus').find('form').children().eq(0)
					.find('input').val();
			var descrip = $('#console-roadPlus').find('form').children().eq(2)
					.find('input').val();
			var pos = [];
			var count = 0;

			for ( var i in dispatcher.modules.newLine.coords) {
				pos[count++] = dispatcher.modules.newLine.coords[i].lng
						.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
				pos[count++] = dispatcher.modules.newLine.coords[i].lat
						.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
			}
			dispatcher.common.doAjax("map/addRoad", 'post', false, {
				roadName : name,
				descrip : descrip,
				newPos : pos
			});
			mapUtil.config.toggleOneShape(dispatcher.modules.newLine.shape,
					false);
			dispatcher.modules.newLine = {
				shape : null,
				coords : []
			};
			dispatcher.changeConsole('console-mapHeader', 'roadList');
		}

		function chooseCoords() {
			dispatcher.common.coverPage();
			// var pop=mapUtil.config.isPop();
			// var coords=mapUtil.config.isShowCoords();
			mapUtil.config.bindMapClick(dispatcher.mapEdit.clickCoords, this,
					dispatcher.constants.COORDS_DECIMAL_COUNT);

		}
		function submitNewSite() {
			var name = $('#console-sitePlus').find('form').children().eq(0)
					.find('input').val();
			var descrip = $('#console-sitePlus').find('form').children().eq(4)
					.find('input').val();
			var type = $('#console-sitePlus').find('form').children().eq(6)
					.find('select').find(":selected").val();
			var sub_site;

			var lng = dispatcher.modules.newSite.lng
					.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
			var lat = dispatcher.modules.newSite.lat
					.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);

			if (type == "控制点") {
				sub_site = 'house';
			} else if (type == "采矿点") {
				sub_site = 'mine';
			} else if (type == "通信基站") {
				sub_site = 'transfer';
			} else {
				sub_site = 'commute';
			}

			if (name != '') {
				dispatcher.common.doAjax("map/addSite", "post", false, {
					name : name,
					lng : lng,
					lat : lat,
					descrip : descrip,
					type : sub_site
				});
				dispatcher.modules.newSite = null;
				dispatcher.changeConsole('console-mapHeader', 'siteList');
			}

		}

		function submitTask() {
			var taskID = $('#console-task').find('input').val();
			var start = mapUtil.config.getTargetByName($('#console-task').find(
					'#task-map-start').text()).id;
			var end = mapUtil.config.getTargetByName($('#console-task').find(
					'#task-map-end').text()).id;

			if (taskID != '' && start != null && start != null) {
				var task = {
					id : taskID,
					start : start,
					end : end,
				}
				task = mapUtil.task.buildPath(task);
				dispatcher.common.doAjax("task/push", "post", false, {
					id : task.id,
					start : task.start,
					end : task.end,
					detailPath : task.detailPath
				});
			}
		}
		function chooseSite() {
			dispatcher.common.coverPage();
			mapUtil.config
					.bindLayerClick(dispatcher.mapEdit.chooseMap, this.id);
		}
	},
	initToolUp : function() {
		$("[data-toggle='tooltip']").tooltip();
	},

};

(function initPage() {
	dispatcher.init.initMap();
	dispatcher.init.initBootStrapTable();
	dispatcher.init.initButton();
	dispatcher.init.initToolUp();
		
	dispatcher.refresh.checkLastVisit();
	dispatcher.refresh.refreshCarList();
	dispatcher.init.initCarConnect();
})();

//toastr.info('Are you the 6 fingered man?');


//var x={
//		a:1,
//		b:[
//		   [[3,2],[5,8]],
//		   [[8,9],[9,10]]
//		   ]
//}
//var y;
//y=mapUtil.utils.deepCopy(x);
//console.log(x);
//console.log(y);

