
mapUtil.config.create(campus);
mapUtil.config.show('block');
mapUtil.config.create(roads);
mapUtil.config.show('lines');
mapUtil.config.create(sites);
mapUtil.config.show('points');
mapUtil.config.create(middle);

mapUtil.config.offPop();

doAjax("pushCar", "post", false, {
	id : 'dan',
	state : 1,
	pos : [ 34.29807, 108.96601 ]
});
doAjax("pushCar", "post", false, {
	id : 'dan2',
	state : 1,
	pos : [ 34.25695, 108.95012 ]
});
doAjax("pushTask", "post", true, {
	id : '001',
	start : '22',
	end : '20'
});
doAjax("pushTask", "post", true, {
	id : '002',
	start : '21',
	end : '20'
});
refreshCarList();
refreshTaskList();

mapUtil.act.showAllCars();
var newPos = [ [ 34.30714, 108.95451 ], [ 34.29169, 108.95845 ],
		[ 34.27296, 108.99879 ], [ 34.29112, 109.02351 ],
		[ 34.30714, 108.95451 ], [ 34.29169, 108.95845 ],
		[ 34.27296, 108.99879 ], [ 34.29112, 109.02351 ],
		[ 34.30714, 108.95451 ], [ 34.29169, 108.95845 ],
		[ 34.27296, 108.99879 ] ];
var count = 0;
//var timer = window.setInterval(function() {
//	moveCars();
//	console.log("刷新一次");
//}, 1000);

function moveCars() {
	var cars = mapUtil.act.getCarList();
	for (var i = 0; i < cars.length; i++) {
		var car = getNowCarPos(cars[i].info.name);
		mapUtil.act.move(car.id, newPos[count]);// 模拟数据
	}
	count++;
	if (count == 10) {
		window.clearTimeout(timer);
	}

	function getNowCarPos(carName) {
		var singleCar = doAjax("getCar", "get", false, {
			carID : carName
		});
		singleCar.pos = [ parseFloat(singleCar.pos[0]),
				parseFloat(singleCar.pos[1]) ];
		return singleCar;
	}
}

function doAjax(url, type, async, data) {
	console.log("准备进行-----  " + url);
	var target;
	$.ajax({
		url : url,
		type : type,
		async : async,
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		// 发送时的编码信息
		data : data,
		success : function(result) {
			console.log(result);
			target = result;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(url+'    进行失败');
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
function buildSingle(target) {
	var single = document.createElement("div");
	single.id = target.info.name;

	var span = document.createElement("span");
	span.innerHTML = target.info.name + ":";
	span.style.width = "100px";
	span.style.display = "inline-block";

	var posBt = document.createElement("input");
	posBt.type = "button";
	posBt.value = "位置";
	posBt.name = target.info.name;
	posBt.style.display = "inline-block";
	posBt.onclick = function() {
		mapUtil.act.showAllCars();
		mapUtil.act.changeCarIcon(this.name);
	};

	var showBt = document.createElement("input");
	showBt.type = "button";
	showBt.value = "隐藏";
	showBt.name = target.info.name;
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
	routeBt.name = target.info.name;
	routeBt.style.display = "inline-block";

	routeBt.onclick = function() {
		lastRouteClick = this.name;
		if (lastRouteClick == this.name) {
			if (this.value == "显示线路") {
				this.value = "隐藏线路";
				mapUtil.task.clearAllRoute();

				var task = mapUtil.task.getTaskByCarId(this.name);
				if (task != null) {
					var car = mapUtil.act.getCarByName(this.name);
					mapUtil.task.paintRoute(task, car);
				}
			} else {
				this.value = "显示线路";
				mapUtil.task.clearAllRoute();
			}
		} else {
			mapUtil.task.clearAllRoute();
			var task = mapUtil.task.getTaskByCarId(this.name);
			if (task != null) {
				var car = mapUtil.act.getCarByName(this.name);
				mapUtil.task.paintRoute(task, car);
			}
		}
	};

	var unRegisBt = document.createElement("input");
	unRegisBt.type = "button";
	unRegisBt.value = "注销";
	unRegisBt.name = target.info.name;
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
	single.appendChild(unRegisBt);
	return single;
}
function refreshCarList() {

	var container = document.getElementById("carlist");
	// 一定要从后往前删除，因为每删除一次，childNodes的序号变动一次
	for (var i = container.childNodes.length - 1; i >= 0; i--) {
		container.removeChild(container.childNodes[i]);
	}
	
	var cars =doAjax("getAllCar", 'get', false, {});
	var carList=mapUtil.act.refreshCars(cars);
	for (var i = 0; i < cars.length; i++) {
		container.appendChild(buildSingle(carList[i]));
	}
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
	var taskID = document.getElementById("taskid").value;
	var start;
	var end;
	for (var i = 0; i < document.getElementsByName("startSite").length; i++) {
		if (document.getElementsByName("startSite")[i].checked) {
			start = document.getElementsByName("startSite")[i].value;
		}
	}
	for (var i = 0; i < document.getElementsByName("endSite").length; i++) {
		if (document.getElementsByName("endSite")[i].checked) {
			end = document.getElementsByName("endSite")[i].value;
		}
	}
	doAjax("pushTask", "post", false, {
		id : taskID,
		start : start,
		end :end
	});
	refreshTaskList();
}
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
function buildSingleTask(target) {
	var single = document.createElement("div");
	single.id = target.id;

	var span = document.createElement("span");
	span.innerHTML = target.id + ":";
	span.style.width = "100px";
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
	assign.style.width = "100px";
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

					assign.value = car.info.name;
					mapUtil.task.assignCar(mapUtil.task
							.getTaskById(assign.name), car);

					doAjax("assginCar", "post", false, {
						taskId : assign.name,
						carId : car.info.name
					});

				} else {
					console.log("等待点击一辆车");
				}
			}
		}
		waitFoClick();
	};

	var pathBt = document.createElement("input");
	pathBt.type = "button";
	pathBt.value = "显示路线";
	pathBt.name = target.id;
	pathBt.style.display = "inline-block";

	pathBt.onclick = function() {
		lastPathClick = this.name;
		if (lastPathClick == this.name) {
			if (this.value == "显示路线") {
				this.value = "隐藏路线";
				mapUtil.task.clearAllPath();
				var task = mapUtil.task.getTaskById(this.name);
				mapUtil.task.paintPath(task);

			} else {
				this.value = "显示路线";
				mapUtil.task.clearAllPath();
			}
		} else {
			mapUtil.task.clearAllPath();
			var task = mapUtil.task.getTaskById(this.name);
			mapUtil.task.paintPath(task);
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
	single.appendChild(pathBt);
	single.appendChild(unRegisBt);
	return single;
}
