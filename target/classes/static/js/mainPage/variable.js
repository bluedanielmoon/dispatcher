var myChart;//e-chart图表
var options;//图表的选项
var tables;//展示数据的表格
myChart = echarts.init(document.getElementById('showChart'));

//指定图表的配置项和数据
options={
		produce: {
		    title: {
		        text: '生产量统计'
		    },
		    tooltip: {},
		    legend: {
		        data:['运送吨数']
		    },
		    xAxis: {
		        data: ["1月","2月","3月","4月","5月","6月"]
		    },
		    yAxis: {},
		    series: [{
		        name: '运送吨数',
		        type: 'bar',
		        data: [5, 20, 36, 10, 10, 20]
		    }]
		},
		work: {
			title: {
		        text: '车辆运行统计'
		    },
			xAxis: {
		        type: 'category',
		        data: ['1月', '2月', '3月', '4月', '5月', '6月']
		    },
		    yAxis: {
		        type: 'value'
		    },
		    series: [{
		        data: [820, 932, 901, 934, 1290, 1330, 1320],
		        type: 'line'
		    }]
		}
}
tables = {
		isExpaned:false,
		normCarTable : {
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				route : {
					table : null,
					columns : null,
					data : null,
					funcBtns : null,
					funcs : null
				}
			}
		},
		taskTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		blockTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		blockEditTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		siteTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		siteEditTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		roadTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		roadEditTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		carTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		staffTable:{
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		},
		lightTable:{//红绿灯检测表
			columns : null,
			data : null,
			funcBtns : null,
			funcs : null,
			expandRow : {
				
			}
		}
	};
//// 使用刚指定的配置项和数据显示图表。
//myChart.setOption(options.produce);

tables.normCarTable.columns = [ {
	checkbox : true
}, {
	field : 'info.id',
	align : 'center',
	title : '编号'
}, {
	field : 'info.state',
	align : 'center',
	title : '车辆状态'
}, {
	field : 'map',
	align : 'center',
	title : '线路',
	width : '300px',
	events : 'tables.normCarTable.funcs.map',
	formatter : 'tables.normCarTable.funcBtns.mapBtn'
}, {
	field : 'task',
	align : 'center',
	title : '任务',
	width : '400px',
	events : 'tables.normCarTable.funcs.task',
	formatter : 'tables.normCarTable.funcBtns.taskBtn'
}, {
	field : 'route',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.normCarTable.funcs.handle',
	formatter : 'tables.normCarTable.funcBtns.handleBtn'
} ];
tables.taskTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '任务编号'
}, {
	field : 'start',
	align : 'center',
	title : '起点'
}, {
	field : 'end',
	align : 'center',
	title : '终点'
}, {
	field : 'taskEdit',
	align : 'center',
	title : '任务编辑',
	width : '400px',
	events : 'tables.taskTable.funcs.edit',
	formatter : 'tables.taskTable.funcBtns.editBtn'
}, {
	field : 'task',
	align : 'center',
	title : '任务控制',
	width : '400px',
	events : 'tables.taskTable.funcs.control',
	formatter : 'tables.taskTable.funcBtns.controlBtn'
}];
tables.blockTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'properties.name',
	align : 'center',
	title : '名称'
}, {
	field : 'pos',
	align : 'center',
	title : '显示',
	width : '200px',
	events : 'tables.blockTable.funcs.show',
	formatter : 'tables.blockTable.funcBtns.showBtn'
}, {
	field : 'task',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.blockTable.funcs.control',
	formatter : 'tables.blockTable.funcBtns.controlBtn'
}];
tables.blockEditTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'name',
	align : 'center',
	title : '区域名称'
}, {
	field : 'task',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.blockEditTable.funcs.control',
	formatter : 'tables.blockEditTable.funcBtns.controlBtn'
}];

tables.siteTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'properties.name',
	align : 'center',
	title : '站名'
}, {
	field : 'pos',
	align : 'center',
	title : '位置',
	width : '400px',
	events : 'tables.siteTable.funcs.pos',
	formatter : 'tables.siteTable.funcBtns.posBtn'
}, {
	field : 'task',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.siteTable.funcs.control',
	formatter : 'tables.siteTable.funcBtns.controlBtn'
}];
tables.siteEditTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'properties.name',
	align : 'center',
	title : '站名'
}, {
	field : 'pos',
	align : 'center',
	title : '位置',
	width : '400px',
	events : 'tables.siteEditTable.funcs.pos',
	formatter : 'tables.siteEditTable.funcBtns.posBtn'
}, {
	field : 'task',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.siteEditTable.funcs.control',
	formatter : 'tables.siteEditTable.funcBtns.controlBtn'
}];
tables.roadTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'properties.name',
	align : 'center',
	title : '道路名'
}, {
	field : 'pos',
	align : 'center',
	title : '显示',
	width : '200px',
	events : 'tables.roadTable.funcs.show',
	formatter : 'tables.roadTable.funcBtns.showBtn'
}, {
	field : 'task',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.roadTable.funcs.control',
	formatter : 'tables.roadTable.funcBtns.controlBtn'
}];
tables.roadEditTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'name',
	align : 'center',
	title : '道路名'
}, {
	field : 'task',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.roadEditTable.funcs.control',
	formatter : 'tables.roadEditTable.funcBtns.controlBtn'
}];
tables.carTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'type',
	align : 'center',
	title : '类型'
}, {
	field : 'memo',
	align : 'center',
	title : '备注',
	width : '200px'
}, {
	field : 'handle',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'handleTableFunc',
	formatter : 'tables.carTable.funcBtns.controlBtn'
}];
tables.staffTable.columns = [ {
	checkbox : true
}, {
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'name',
	align : 'center',
	title : '姓名'
}, {
	field : 'duty',
	align : 'center',
	title : '工作类型'
}, {
	field : 'group',
	align : 'center',
	title : '班组编号'
}, {
	field : 'handle',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'handleTableFunc',
	formatter : 'tables.staffTable.funcBtns.controlBtn'
}];
tables.lightTable.columns = [{
	field : 'id',
	align : 'center',
	title : '编号'
}, {
	field : 'time',
	align : 'center',
	title : '时间'
}, {
	field : 'result',
	align : 'center',
	title : '检测结果'
}];
tables.normCarTable.funcs = {
	map:{
		'click .normcar-pos' : function(e, value, row, index) {
			e.stopPropagation();
			mapUtil.act.showAllCars();
			mapUtil.act.changeCarIcon(row.info.id);
		},
		'click .normcar-hide' : function(e, value, row, index) {
			e.stopPropagation();
			if ($(this).text() == "显示") {
				$(this).text("隐藏");
				mapUtil.act.showCar(row.info.id);
			} else {
				$(this).text("显示");
				mapUtil.act.hideCar(row.info.id);
			}

		},
		'click .normcar-route' : function(e, value, row, index) {
			e.stopPropagation();
			dispatcher.common.resetButtons('normcar-route',this,"显示线路");
			if($(this).text() == "显示线路"){	
				$(this).text("隐藏线路");
				mapUtil.task.clearAllRoute();
				var task = mapUtil.task.getTaskByCarId(row.info.id);
				if (task != null) {
					var car = mapUtil.act.getCarByName(row.info.id);
					mapUtil.task.paintRoute(task, car);
				}
			}else{
				$(this).text("显示线路");
				mapUtil.task.clearAllRoute();
			}
		}
	},
	task:{
		'click #normcar-detail' : function(e, value, row, index) {
			e.stopPropagation();
			console.log("5");
		},
		'click #normcar-task' : function(e, value, row, index) {
			e.stopPropagation(); 
			if($(this).val() == "显示"||$(this).val() == ""){	
				$(this).val("隐藏");
				mapUtil.task.clearAllPath();
				var task;
				if(row.info.id=="1"){
					task = mapUtil.task.getTaskById('001');
				}else if(row.info.id=="2"){
					task = mapUtil.task.getTaskById('002');
				}else if(row.info.id=="3"){
					task = mapUtil.task.getTaskById('003');
				}
				if (task != null) {
					mapUtil.task.paintPath(task);
				}
			}else{
				$(this).val("显示");
				mapUtil.task.clearAllPath();
			}
		},
		'click #normcar-replan' : function(e, value, row, index) {
			e.stopPropagation();
			console.log("7");
		},
		'click .normcar-check' : function(e, value, row, index) {
			e.stopPropagation();
			dispatcher.changeConsole('console-table','lightCheck');
		}
	},
	handle:{
		'click .normcar-record' : function(e, value, row, index) {
			e.stopPropagation();
			if ($(this).text() == "显示轨迹") {
				$(this).text("隐藏轨迹");
				mapUtil.act.clearAllCarPath();
				var car=mapUtil.act.getCarByName(row.info.id);
				if(car&&car.pathMarker!=null){
					mapUtil.act.toggleShowPath(car);
				}else{
					mapUtil.act.resetCarPath(car);
				}
			} else {
				$(this).text("显示轨迹");
				mapUtil.act.clearCarPath(mapUtil.act.getCarByName(row.info.id));
			}
		},
		'click .normcar-begin' : function(e, value, row, index) {
			e.stopPropagation();
			dispatcher.common.doAjax("car/beginRecord", 'post', true, {
				carId:row.info.id
			});
		},
		'click .normcar-stop' : function(e, value, row, index) {
			e.stopPropagation();
			dispatcher.common.doAjax("car/endRecord", 'post', false, {
				carId:row.info.id
			});
			var car=mapUtil.act.getCarByName(row.info.id);
			mapUtil.act.clearCarPath(car);
			mapUtil.act.resetCarPath(car);
			dispatcher.common.toggleExpandRow(false,index);
		},
		'click .normcar-list' : function(e, value, row, index) {
			e.stopPropagation();
			if($(this).val() == "显示"||$(this).val() == ""){	
				$(this).val("隐藏");
				dispatcher.common.toggleExpandRow(true,index);
			}else{
				$(this).val("显示");
				dispatcher.common.toggleExpandRow(true,index);
			}
		}
	},
	route:{
		'click .route-play' : function(e, value, row, index) {
			e.stopPropagation();
			if($(this).val() == "回放轨迹"||$(this).val() == ""){	
				$(this).val("隐藏回放");
				var result=dispatcher.common.doAjax("car/getRecord", 'get', false, {
					carId:row.carID,
					startTime:parseInt(row.startTime),
					endTime:parseInt(row.endTime)
				});
				mapUtil.act.replayPath(row.carID,result.path,true,100);	
			}else{
				$(this).val("回放轨迹");
				mapUtil.act.replayPath(row.carID,null,false);
			}
		},
		'click .route-delete' : function(e, value, row, index) {
			e.stopPropagation();
			mapUtil.act.replayPath(row.carID,null,false);
			dispatcher.common.doAjax("car/delRecord", 'post', false, {
				carId:row.carID,
				startTime:parseInt(row.startTime),
				endTime:parseInt(row.endTime)
			});
			
			$(tables.normCarTable.expandRow.route.table).bootstrapTable('refreshOptions', {
	    		data: dispatcher.refresh.refreshTaskListData(dispatcher.refresh.refreshRouteList(row.carID))
	    	});
			dispatcher.common.toggleExpandRow(false,row.fatherIndex);
		}
	}
};
tables.normCarTable.funcBtns = {
	mapBtn : function(value, row, index) {
		function setHide(row){
			if(row.show){
				return '隐藏';
			}
			return '显示';
		}
		return [
				'<button type="button" class="btn btn-default normcar-pos">位置</button>',
				'&nbsp;','&nbsp;',
				'<button type="button" class="btn btn-default normcar-hide">'+setHide(row)+'</button>',
				'&nbsp;', '&nbsp;',
				'<button type="button" class="btn btn-default normcar-route">显示线路</button>' ]
				.join('');// turn array to string
	},
	taskBtn : function(e, value, row) {
		return [
				'<button id="normcar-detail" type="button" class="btn btn-default">车辆详情</button>',
				'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
				'<button id="normcar-task" type="button" class="btn btn-default">任务详情</button>',
				'&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;',
				'<button id="normcar-replan" type="button" class="btn btn-default">重新规划</button>',
				'&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;',
				'<button  type="button" class="btn btn-default normcar-check">红绿检测</button>']
				.join('');
	},
	handleBtn : function(e, value, row) {
		
		return [
		        '<button type="button" class="btn btn-default normcar-record">显示轨迹</button>',
				'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
				'<button type="button" class="btn btn-default normcar-begin">开始记录</button>',
				'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
				'<button type="button" class="btn btn-default normcar-stop">终止记录</button>',
				'&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;',
				'<button type="button" class="btn btn-default normcar-list">轨迹列表</button>' ]
				.join('');
	},
	routeBtn : function(e, value, row) {
		return [
				'<button type="button" class="btn btn-default route-play">回放轨迹</button>',
				'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
				'<button type="button" class="btn btn-default route-delete">删除轨迹</button>']
				.join('');
	}
	
};
tables.taskTable.funcs = {
		edit:{
			'click .task-assignCar' : function(e, value, row, index) {
				e.stopPropagation();
				dispatcher.common.coverPage();
				mapUtil.act.bindCarClick(dispatcher.mapEdit.chooseCar,this,row.id);

			},
			'click .task-leastPath' : function(e, value, row, index) {
				e.stopPropagation();
				if($(this).val() == "显示"||$(this).val() == ""){	
					$(this).val("隐藏");
					mapUtil.task.clearAllPath();
					var task = mapUtil.task.getTaskById(row.id);
					mapUtil.task.paintPath(task);
					
				}else{
					$(this).val("显示");
					mapUtil.task.clearAllPath();
				}
				
			},
			'click .task-delete' : function(e, value, row, index) {
				e.stopPropagation();
				dispatcher.common.doAjax("task/delete", 'post', false, {
					taskId:row.id
					});
				dispatcher.changeConsole('console-table','taskList');
			},
		},
		control:{
			'click .task-start' : function(e, value, row, index) {
				e.stopPropagation();
				var task = dispatcher.common.doAjax('task/get', 'get', false, {
					taskID:row.id
				});
				if(task&&task!=''&&task.car!=null){
					var car=mapUtil.act.getCarByName(task.car.id);
					mapUtil.task.assignCar(mapUtil.task
							.getTaskById(task.id), car);
					dispatcher.common.doAjax("task/begin", "post", false, {
						taskId : task.id
					});
				}
				
			},
			'click .task-pause' : function(e, value, row, index) {
				e.stopPropagation();

			},
			'click .task-stop' : function(e, value, row, index) {
				e.stopPropagation();
			},
		}
}
tables.taskTable.funcBtns = {
		editBtn : function(value, row, index) {
			function setAssignBtn(row){	
				if(row.car&&row.car!=null){
					return row.car.id;
				}
				return '指定车辆';
			}
			return ['<button type="button" class="btn btn-default task-detail">任务详情</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" data-toggle="tooltip" data-placement="top"'+
		     		'title="单击后在地图单击某一车辆进行选定" class="btn btn-default task-assignCar">'+setAssignBtn(row)+'</button>',
					'&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;',
					'<button type="button" class="btn btn-default task-leastPath">最短路线</button>',
					'&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;',
					'<button type="button" class="btn btn-default task-delete">删除</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default task-start">开始任务</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" class="btn btn-default task-pause">暂停任务</button>',
					'&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;',
					'<button type="button" class="btn btn-default task-stop">终止任务</button>' ]
					.join('');
		}
	};
tables.blockTable.funcs = {
		show:{
			'click .block-show' : function(e, value, row, index) {
				e.stopPropagation();
				mapUtil.config.setRedBlock(row.id);
				
			}
		},
		control:{
			'click .block-delete' : function(e, value, row, index) {
				e.stopPropagation();
				
				dispatcher.common.doAjax("map/deleteSite", 'post', false, {
					siteId:row.id
				});
				dispatcher.changeConsole('console-mapHeader','siteList');
			}
		}
}
tables.blockTable.funcBtns={
		showBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default block-show">显示</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default block-update">修改</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" class="btn btn-default block-delete">删除</button>' ]
					.join('');
		}
};
tables.blockEditTable.funcs = {
		control:{
			'click .blockEdit-delete' : function(e, value, row, index) {
				e.stopPropagation();
				
				dispatcher.changeConsole('console-mapHeader','siteList');
			},
			'click .blockEdit-store' : function(e, value, row, index) {
				e.stopPropagation();
				var blockInfo = mapUtil.utils.getArrayIndex(
						dispatcher.modules.mapData.blocks.features, 'id', row.id);
				
				var coords=blockInfo.geometry.coordinates[0];
				var outerCount=coords.length;
				var innerCount=[];
				for(var i in coords){
					innerCount[i]=coords[i].length;
					for(var j in coords[i]){
						coords[i][j][0]=coords[i][j][0].toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
						coords[i][j][1]=coords[i][j][1].toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
					}
				}
				dispatcher.common.doAjax("map/changeBlock", 'post', false, {
					blockId:row.id,
					outerCount:outerCount,
					innerCount:innerCount,
					newCoords:blockInfo.geometry.coordinates[0]
				});
				dispatcher.changeConsole('console-mapHeader','blockList');
			}
		}
}
tables.blockEditTable.funcBtns={
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default blockEdit-delete">删除</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" class="btn btn-default blockEdit-store">保存改动</button>' ]
					.join('');
		}
};
tables.siteTable.funcs = {
		pos:{
			'click .site-origin' : function(e, value, row, index) {
				e.stopPropagation();
				mapUtil.config.setRedSite(row.id);
				
			}
		},
		control:{
			'click .site-delete' : function(e, value, row, index) {
				e.stopPropagation();
				
				dispatcher.common.doAjax("map/deleteSite", 'post', false, {
					siteId:row.id
				});
				dispatcher.changeConsole('console-mapHeader','siteList');
			}
		}
}
tables.siteTable.funcBtns={
		posBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default site-origin">当前位置</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default site-delete">删除站点</button>' ]
					.join('');
		}
};
tables.siteEditTable.funcs = {
		pos:{
			'click .site-before' : function(e, value, row, index) {
				e.stopPropagation();
				var site=mapUtil.config.getTargetByID(row.id);	
				site.marker.setLatLng(site.pos);
				
				mapUtil.config.setRedSite(site.id);
			},
			'click .site-now' : function(e, value, row, index) {
				e.stopPropagation();
				var site=mapUtil.config.getTargetByID(row.id);
				
				for(var i in dispatcher.modules.movedSites){
					if(dispatcher.modules.movedSites[i].id==site.id){
						site.marker.setLatLng(L.latLng(
								dispatcher.modules.movedSites[i].newPos.lat,
								dispatcher.modules.movedSites[i].newPos.lng));
						break;
					}
				}
				mapUtil.config.setRedSite(site.id);
			}
		},
		control:{
			'click .site-store' : function(e, value, row, index) {
				e.stopPropagation();
				var site=mapUtil.config.getTargetByID(row.id);
				
				var position=site.marker.getLatLng();
				
				var newPos={
					lat:position.lat.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT),
					lng:position.lng.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT)
				}
				dispatcher.common.doAjax("map/changeSitePos", 'post', false, {
					siteId:row.id,
					newPos:newPos
				});
			}
		}
}
tables.siteEditTable.funcBtns={
		posBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default site-before">初始位置</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" class="btn btn-default site-now">当前位置</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default site-store">保存移动</button>' ]
					.join('');
		}
};

tables.roadTable.funcs = {
		show:{
			'click .road-show' : function(e, value, row, index) {
				e.stopPropagation();
				mapUtil.config.setRedLine(row.id);
			}
		},
		control:{
			'click .road-delete' : function(e, value, row, index) {
				e.stopPropagation();
				
			}
		}
}

tables.roadTable.funcBtns={
		showBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default road-show">显示</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default road-update">修改</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" class="btn btn-default road-delete">删除</button>' ]
					.join('');
		}
};
tables.roadEditTable.funcs = {
		control:{
			'click .road-delete' : function(e, value, row, index) {
				e.stopPropagation();
				
			},
			'click .road-store' : function(e, value, row, index) {
				e.stopPropagation();
				var road=mapUtil.config.getTargetByID(row.id);
				var pos=[];
				var count=0;

				for(var i in road.pos){
					pos[count++]=road.pos[i].lng.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
					pos[count++]=road.pos[i].lat.toFixed(dispatcher.constants.COORDS_DECIMAL_COUNT);
				}
				dispatcher.common.doAjax("map/changeRoad", 'post', false, {
					roadId:row.id,
					newPos:pos
				});
			}
		}
}
tables.roadEditTable.funcBtns={
		controlBtn : function(value, row, index) {
			return ['<button type="button" class="btn btn-default road-delete">删除</button>',
			        '&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button type="button" class="btn btn-default road-store">保存移动</button>' ]
					.join('');
		}
};
tables.carTable.funcBtns={
		showBtn : function(value, row, index) {
			return ['<button id="1" type="button" class="btn btn-default">显示</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button id="1" type="button" class="btn btn-default">修改</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button id="2" type="button" class="btn btn-default">删除</button>' ]
					.join('');
		}
};
tables.staffTable.funcBtns={
		showBtn : function(value, row, index) {
			return ['<button id="1" type="button" class="btn btn-default">显示</button>']
					.join('');
		},
		controlBtn : function(value, row, index) {
			return ['<button id="1" type="button" class="btn btn-default">修改</button>',
					'&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;','&nbsp;',
					'<button id="2" type="button" class="btn btn-default">删除</button>' ]
					.join('');
		}
};

tables.normCarTable.expandRow.route.columns = [{
	field : 'id',
	align : 'center',
	title : '路径'
}, {
	field : 'start',
	align : 'center',
	title : '起始时间'
}, {
	field : 'end',
	align : 'center',
	title : '终止时间'
}, {
	field : 'handle',
	align : 'center',
	title : '操作',
	width : '400px',
	events : 'tables.normCarTable.funcs.route',
	formatter : 'tables.normCarTable.funcBtns.routeBtn'
		
}];
tables.normCarTable.expandRow.route.table = function(index, row, $detail) {
	if(typeof($detail)!= "undefined" ){
		var subtable = $detail.html('<table></table>').find('table');
		$(subtable).bootstrapTable({
			columns:tables.normCarTable.expandRow.route.columns,
			data:dispatcher.refresh.refreshRouteList(row.info.id,index)
		});
		return subtable;
	}	
};

