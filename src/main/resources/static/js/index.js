//构建地图，初始化配置
var mapData=doAjax("mapData/jsonNew.json", "get", false, {});
mapUtil.config.create(mapData.block,1);
mapUtil.config.show('block');
mapUtil.config.create(mapData.lines,2);
mapUtil.config.show('lines');
mapUtil.config.create(mapData.sites,3);
mapUtil.config.show('points');
mapUtil.config.create(mapData.middles,4);
mapUtil.config.offPop();

//向后台注册初始化测试数据
doAjax("pushCar", "post", false, {
	id : '2',
	state : 1,
	pos : [ 34.22636, 108.99577 ]
});
doAjax("pushCar", "post", false, {
	id : '1',
	state : 1,
	pos : [ 34.22601, 108.99564 ]
});
doAjax("pushTask", "post", false, {
	id : '001',
	start : '27',
	end : '20',
	detailPath:['22','18','30','16']
});
doAjax("pushTask", "post", false, {
	id : '002',
	start : '21',
	end : '27',
	detailPath:['21','10']
});
doAjax("pushTask", "post", false, {
	id : '003',
	start : '20',
	end : '23',
	detailPath:['20','15','31','112','32','110',]
});
doAjax("pushTask", "post", false, {
	id : '004',
	start : '22',
	end : '23'
});
doAjax("pushTask", "post", false, {
	id : '005',
	start : '26',
	end : '23'
});
doAjax("pushTask", "post", false, {
	id : '006',
	start : '24',
	end : '21'
});

refreshCarList();
refreshTaskList();
mapUtil.act.showAllCars();
tickleAll(200);


function tickleAll(timeInteval){
	var timer = window.setInterval(function() {
		var cars = doAjax("getAllCar", "get", false, {});
		if(cars!=null){
			if(cars.length!=mapUtil.act.getCarList().length){
				refreshCarList();
			}
			for(var i=0;i<cars.length;i++){
				tickleCar(cars[i]);
			}
		}else{
			window.clearTimeout(timer);
		}
		
	}, timeInteval);
}

function tickleCar(singleCar){
	if(singleCar!= ""&&singleCar!= null&&typeof(singleCar)!= "undefined" ){
		var pos=[];
		pos[0]=parseFloat(singleCar.pos[0]);
		pos[1]=parseFloat(singleCar.pos[1]);
		var findCar=mapUtil.act.getCarByName(singleCar.id);
		if(singleCar.path.length>0){
			var exchangePath=mapUtil.utils.exchangeLatlng(singleCar.path[singleCar.path.length-1]);
			mapUtil.act.showCarPath(findCar);
			mapUtil.act.refreshCarPath(findCar,exchangePath,findCar.showPath);
		}	
		mapUtil.act.move(singleCar.id, pos);// 模拟数据
	}
}

function doAjax(url, type, async, data) {
	if(url!="getAllCar"){
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
			console.log(url+'    进行失败');
			target=null;
		}
	});
	return target;
}
function toggleShow(type) {
	if (type == 'Coords') {
		var showCoords = document.getElementById("showCoords");
		if (showCoords.value == "开启坐标显示") {
			showCoords.value = "关闭坐标显示";
			mapUtil.config.addShowCoords();
		} else {
			showCoords.value = "开启坐标显示";
			mapUtil.config.removeShowCoords();
		}
	} else if (type == 'Blocks') {
		var showCoords = document.getElementById("showBlocks");
		if (showCoords.value == "隐藏板块") {
			showCoords.value = "显示板块";
			mapUtil.config.removeShow('block');
		} else {
			showCoords.value = "隐藏板块";
			mapUtil.config.show('block');
		}
	} else if (type == 'Lines') {
		var showCoords = document.getElementById("showLines");
		if (showCoords.value == "隐藏路线") {
			showCoords.value = "显示路线";
			mapUtil.config.removeShow('lines');
		} else {
			showCoords.value = "隐藏路线";
			mapUtil.config.show('lines');
		}
	} else if (type == 'Points') {
		var showCoords = document.getElementById("showPoints");
		if (showCoords.value == "隐藏站点") {
			showCoords.value = "显示站点";
			mapUtil.config.removeShow('points');
		} else {
			showCoords.value = "隐藏站点";
			mapUtil.config.show('points');
		}
	} else {
		var showCoords = document.getElementById("showPop");
		if (showCoords.value == "开启名称显示") {
			showCoords.value = "关闭名称显示";
			mapUtil.config.onPop();
		} else {
			showCoords.value = "开启名称显示";
			mapUtil.config.offPop();
		}
	}
}
function refreshCarList() {

	var container = document.getElementById("carlist");
	// 一定要从后往前删除，因为每删除一次，childNodes的序号变动一次
	for (var i = container.childNodes.length - 1; i >= 0; i--) {
		container.removeChild(container.childNodes[i]);
	}
	
	var cars =doAjax("getAllCar", 'get', false, {});
	var carList=mapUtil.act.refreshCars(cars);//更新前端的
	for (var i = 0; i < cars.length; i++) {
		container.appendChild(buildSingleCar(carList[i]));
	}
}
//函数里面有重复计算，但是考虑到以后可能会进行地图的修改，这里需要对每个任务的路径进行重新规划，所以，利用此功能刷新
function refreshTaskList() {
	var container = document.getElementById("tasklist");
	// 一定要从后往前删除，因为每删除一次，childNodes的序号变动一次
	for (var i = container.childNodes.length - 1; i >= 0; i--) {
		container.removeChild(container.childNodes[i]);
	}
	
	var tasks = doAjax('getAllTask', 'get', false, {});
	var taskList=mapUtil.task.refreshTasks(tasks);
	for (var i = 0; i < taskList.length; i++) {
		container.appendChild(buildSingleTask(taskList[i]));
	}
}
function refreshPathList(parent,containerID,target){
	if(containerID!=null){
		var container = document.getElementById(containerID);
		if(typeof(container)!= "undefined"){
			// 一定要从后往前删除，因为每删除一次，childNodes的序号变动一次
			for (var i = container.childNodes.length - 1; i >= 0; i--) {
				container.removeChild(container.childNodes[i]);
			}
		}
		container.appendChild(buildPathTitle(target));
	}else{
		parent.appendChild(buildPathTitle(target));
	}
	buildPathList(target,doAjax("getAllRecords", "get", false, {
		carId:target.info.id
	}));
}
function buildSingleCar(target) {
	var single = document.createElement("div");
	single.id = target.info.id;

	var span = document.createElement("span");
	span.innerHTML = target.info.id + ":";
	span.style.width = "30px";
	span.style.display = "inline-block";

	var posBt = document.createElement("input");
	posBt.type = "button";
	posBt.value = "位置";
	posBt.name = target.info.id;
	posBt.style.display = "inline-block";
	posBt.onclick = function() {
		mapUtil.act.showAllCars();
		mapUtil.act.changeCarIcon(this.name);
	};

	var showBt = document.createElement("input");
	showBt.type = "button";
	showBt.value = "隐藏";
	showBt.name = target.info.id;
	showBt.style.display = "inline-block";
	showBt.onclick = function() {
		if (this.value == "显示") {
			this.value = "隐藏";
			mapUtil.act.showCar(this.name);
		} else {
			this.value = "显示";
			mapUtil.act.hideCar(this.name);
		}

	};

	var routeBt = document.createElement("input");
	routeBt.type = "button";
	routeBt.value = "显示线路";
	routeBt.name = target.info.id;
	routeBt.className="toggleRoute";
	routeBt.style.display = "inline-block";

	routeBt.onclick = function() {
		var self=this;
		function clearAll(){
			var toggles=document.getElementsByClassName("toggleRoute");
			for(var i=0;i<toggles.length;i++){
				if(toggles[i].name!=self.name){
					toggles[i].value="显示线路";
				}	
			}
		}
		clearAll();
		if(this.value == "显示线路"){	
			this.value = "隐藏线路";
			this.value = "隐藏线路";
			mapUtil.task.clearAllRoute();

			var task = mapUtil.task.getTaskByCarId(this.name);
			if (task != null) {
				var car = mapUtil.act.getCarByName(this.name);
				mapUtil.task.paintRoute(task, car);
			}
		}else{
			this.value = "显示线路";
			mapUtil.task.clearAllRoute();
		}	
	};
	
	var pathBt = document.createElement("input");
	pathBt.type = "button";
	pathBt.value = "显示轨迹";
	pathBt.name = target.info.id;
	pathBt.className="togglePath";
	pathBt.style.display = "inline-block";

	pathBt.onclick = function() {
		var self=this;
		function clearAll(){
			var toggles=document.getElementsByClassName("togglePath");
			for(var i=0;i<toggles.length;i++){
				if(toggles[i].name!=self.name){
					toggles[i].value="显示轨迹";
				}	
			}
		}
		clearAll();
		if(this.value == "显示轨迹"){	
			this.value = "隐藏轨迹";
			mapUtil.act.clearAllCarPath();
			var car=mapUtil.act.getCarByName(this.name);
			if(car&&car.pathMarker!=null){
				mapUtil.act.toggleShowPath(car);
			}else{
				mapUtil.act.resetCarPath(car);
			}
			
		}else{
			this.value = "显示轨迹";
			mapUtil.act.clearCarPath(mapUtil.act.getCarByName(this.name));
		}	
	};
	
	var startRecordBt = document.createElement("input");
	startRecordBt.type = "button";
	startRecordBt.value = "开始记录轨迹";
	startRecordBt.name = target.info.id;
	startRecordBt.className="startRecordPath";
	startRecordBt.style.display = "inline-block";

	startRecordBt.onclick = function() {
		doAjax("beginRecord", 'post', true, {
			carId:this.name
		});
	};
	var endRecordBt = document.createElement("input");
	endRecordBt.type = "button";
	endRecordBt.value = "终止记录轨迹";
	endRecordBt.name = target.info.id;
	endRecordBt.className="startRecordPath";
	endRecordBt.style.display = "inline-block";

	endRecordBt.onclick = function() {
		doAjax("endRecord", 'post', false, {
			carId:this.name
		});
		var car=mapUtil.act.getCarByName(this.name);
		mapUtil.act.clearCarPath(car);
		mapUtil.act.resetCarPath(car);
		var pathList=document.getElementById(target.info.id+"-path");
		single.removeChild(pathList);
		refreshPathList(single, null, target);
	};
	
	var showListBt = document.createElement("input");
	showListBt.type = "button";
	showListBt.value = "展开轨迹列表";
	showListBt.name = target.info.id;
	showListBt.className="showPathList";
	showListBt.style.display = "inline-block";

	showListBt.onclick = function() {
		var self=this;
		function clearAll(){
			var toggles=document.getElementsByClassName("showPathList");
			for(var i=0;i<toggles.length;i++){
				if(toggles[i].name!=self.name){
					toggles[i].value="展开轨迹列表";
				}	
			}
		}
		clearAll();
		if(this.value == "展开轨迹列表"){	
			this.value = "隐藏轨迹列表";
			if(!document.getElementById(target.info.id+"-path")){
				refreshPathList(single,null,target);
			}		
		}else{
			this.value = "展开轨迹列表";
			var pathList=document.getElementById(target.info.id+"-path");
			single.removeChild(pathList);
		}	
	};

	var unRegisBt = document.createElement("input");
	unRegisBt.type = "button";
	unRegisBt.value = "注销";
	unRegisBt.name = target.info.id;
	unRegisBt.style.display = "inline-block";

	unRegisBt.onclick = function() {
		mapUtil.act.unRegistCar(this.name);
		doAjax("delCar", 'post', false, {
			carId:this.name
		});
		refreshCarList();
	};

	single.appendChild(span);
	single.appendChild(posBt);
	single.appendChild(showBt);
	single.appendChild(routeBt);
	single.appendChild(pathBt);
	single.appendChild(startRecordBt);
	single.appendChild(endRecordBt);
	single.appendChild(showListBt);
	single.appendChild(unRegisBt);
	return single;
}

//list   id--路径号  startTime--起始时间  endTime--终止时间  
function buildPathList(target,list){
	console.log(list);
	var date = new Date();  
	var container = document.getElementById(target.info.id+"-path");
	for(var i=0;i<list.length;i++){
		var item = document.createElement("div");
		item.className="carList";

		var span1 = document.createElement("span");
		span1.innerHTML = "路径"+(i+1);
		span1.className="carListTitle";
		span1.style.width = "50px";
		span1.style.display = "inline-block";
		
		let time= new Object();
		time.start=list[i][0];
		time.end=list[i][1];
		
		var span2 = document.createElement("span");
		date.setTime(parseInt(time.start));
		span2.innerHTML = date.toLocaleString();
		span2.className="carListTitle";
		span2.style.width = "130px";
		span2.style.display = "inline-block";
		
		var span3 = document.createElement("span");
		date.setTime(parseInt(time.end));
		span3.innerHTML = date.toLocaleString();
		span3.style.width = "130px";
		span3.className="carListTitle";
		span3.style.display = "inline-block";

		var pathBt = document.createElement("input");
		pathBt.type = "button";
		pathBt.value = "回放轨迹";
		pathBt.name = target.info.id;
		pathBt.dataIndex=time.start;
		pathBt.className="replayPath";
		pathBt.style.display = "inline-block";
		pathBt.onclick = function() {
			var self=this;
			function clearAll(){
				var toggles=document.getElementsByClassName("replayPath");
				for(var i=0;i<toggles.length;i++){
					if(toggles[i].dataIndex!=self.dataIndex){
						toggles[i].value="回放轨迹";
					}	
				}
			}
			clearAll();
			if(this.value == "回放轨迹"){	
				this.value = "隐藏回放";
				var result=doAjax("getRecord", 'get', false, {
					carId:this.name,
					startTime:time.start,
					endTime:time.end
				});		
				console.log(result);
				mapUtil.act.replayPath(this.name,result.path,true,100);
			}else{
				this.value = "回放轨迹";
				mapUtil.act.replayPath(this.name,null,false);
			}
		};
		
		
		var delBt = document.createElement("input");
		delBt.type = "button";
		delBt.value = "删除轨迹";
		delBt.name = target.info.id;
		delBt.className="deletePath";
		delBt.style.display = "inline-block";
		delBt.onclick = function() {
			mapUtil.act.replayPath(this.name,null,false);
			doAjax("delRecord", 'post', false, {
				carId:this.name,
				startTime:time.start,
				endTime:time.end
			});
			refreshPathList(null,this.parentNode.parentNode.id,target);
		};
		
		item.appendChild(span1);
		item.appendChild(span2);
		item.appendChild(span3);
		item.appendChild(pathBt);
		item.appendChild(delBt);
		
		container.appendChild(item);
	}
}

function buildPathTitle(target){
	
	
	var list = document.createElement("div");
	list.id = target.info.id+"-path";
	list.className="carTitle";

	var span1 = document.createElement("span");
	span1.innerHTML = "路径";
	span1.className="carListTitle";
	span1.style.width = "50px";
	span1.style.display = "inline-block";
	
	var span2 = document.createElement("span");
	span2.innerHTML = "起始时间";
	span2.className="carListTitle";
	span2.style.width = "130px";
	span2.style.display = "inline-block";
	
	var span3 = document.createElement("span");
	span3.innerHTML = "终止时间";
	span3.style.width = "130px";
	span3.className="carListTitle";
	span3.style.display = "inline-block";

	
	list.appendChild(span1);
	list.appendChild(span2);
	list.appendChild(span3);
	return list;

}

function getPosition() {
	var clickPoint;
	map.on('click', function(e) {
		clickPoint = e.latlng.toString();
		document.getElementById("pos").value = clickPoint;
	});
}
function checkRegisCar() {
	var carID = document.getElementById("carId").value;
	var state = document.getElementsByName("nowstate")[1].checked ? 2 : 1;
	var temppos = document.getElementById("pos").value;
	var pos = temppos.substring(7, temppos.length - 1);
	var comma = pos.split(',');
	pos = [ parseFloat(comma[0]), parseFloat(comma[1]) ];
	
	doAjax("pushCar", "post", true, {
		id : carID,
		state : state,
		pos : pos
	});
	refreshCarList();
	mapUtil.act.showAllCars();
}
function buildTask() {
	var task={
		id:null,
        start:null,
        end:null,
	}
	task.id = document.getElementById("taskid").value;
	for (var i = 0; i < document.getElementsByName("startSite").length; i++) {
		if (document.getElementsByName("startSite")[i].checked) {
			task.start = document.getElementsByName("startSite")[i].value;
		}
	}
	for (var i = 0; i < document.getElementsByName("endSite").length; i++) {
		if (document.getElementsByName("endSite")[i].checked) {
			task.end = document.getElementsByName("endSite")[i].value;
		}
	}
	mapUtil.task.clearAllPath();
	task=mapUtil.task.buildPath(task);
	doAjax("pushTask", "post", false, {
		id : task.id,
		start : task.start,
		end :task.end,
		detailPath:task.detailPath
	});
	refreshTaskList();
}

function buildSingleTask(target) {
	var single = document.createElement("div");
	single.id = target.id;

	var span = document.createElement("span");
	span.innerHTML = target.id + ":";
	span.style.width = "50px";
	span.style.display = "inline-block";

	var start = document.createElement("span");
	start.innerHTML = target.start;
	start.style.width = "50px";
	start.style.display = "inline-block";

	var end = document.createElement("span");
	end.innerHTML = target.end;
	end.style.width = "50px";
	end.style.display = "inline-block";

	var assign = document.createElement("input");
	assign.type = "button";
	assign.value = "指定车辆";
	assign.name = target.id;
	assign.style.width = "70px";
	assign.style.display = "inline-block";

	assign.onclick = function() {
		function waitFoClick() {
			var timer = window.setInterval(function() {
				check();
			}, 100);

			function check() {
				var car = mapUtil.act.getChoosedCar();
				if (car != null) {
					window.clearTimeout(timer);
					mapUtil.act.resetChoosedCar();

					assign.value = car.info.id;
					mapUtil.task.assignCar(mapUtil.task
							.getTaskById(assign.name), car);

					doAjax("assginCar", "post", false, {
						taskId : assign.name,
						carId : car.info.id
					});

				} else {
					console.log("等待点击一辆车");
				}
			}
		}
		waitFoClick();
	};
	
	var beginTaskBt = document.createElement("input");
	beginTaskBt.type = "button";
	beginTaskBt.value = "开始任务";
	beginTaskBt.name = target.id;
	beginTaskBt.style.width = "70px";
	beginTaskBt.style.display = "inline-block";

	beginTaskBt.onclick = function() {
		if(assign.value!="指定车辆"){
			var car=mapUtil.act.getCarByName(assign.value);
			mapUtil.task.assignCar(mapUtil.task
					.getTaskById(assign.name), car);

			doAjax("beginTask", "post", false, {
				taskId : assign.name
			});
		}
	};
	
	var finishTaskBt = document.createElement("input");
	finishTaskBt.type = "button";
	finishTaskBt.value = "终止任务";
	finishTaskBt.name = target.id;
	finishTaskBt.style.width = "70px";
	finishTaskBt.style.display = "inline-block";

	finishTaskBt.onclick = function() {
		
	};

	var pathBt = document.createElement("input");
	pathBt.type = "button";
	pathBt.value = "显示路线";
	pathBt.name = target.id;
	pathBt.className="togglePath";
	pathBt.style.display = "inline-block";

	pathBt.onclick = function() {
		var self=this;
		function clearAll(){
			var toggles=document.getElementsByClassName("togglePath");
			for(var i=0;i<toggles.length;i++){
				if(toggles[i].name!=self.name){
					toggles[i].value="显示路线";
				}	
			}
		}
		clearAll();
		if(this.value == "显示路线"){	
			this.value = "隐藏路线";
			mapUtil.task.clearAllPath();
			var task = mapUtil.task.getTaskById(this.name);
			mapUtil.task.paintPath(task);
		}else{
			this.value = "显示路线";
			mapUtil.task.clearAllPath();
		}
	};
	
	var unRegisBt = document.createElement("input");
	unRegisBt.type = "button";
	unRegisBt.value = "删除";
	unRegisBt.name =target.id;
	unRegisBt.style.display = "inline-block";

	unRegisBt.onclick = function() {
		doAjax("delTask", 'post', false, {
			taskId:this.name
			});
		refreshTaskList();
	};

	single.appendChild(span);
	single.appendChild(start);
	single.appendChild(end);
	single.appendChild(assign);
	single.appendChild(beginTaskBt);
	single.appendChild(finishTaskBt);
	single.appendChild(pathBt);
	single.appendChild(unRegisBt);
	return single;
}
