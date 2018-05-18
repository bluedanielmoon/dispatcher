	mapUtil.act.registCar('dan', 1, [ 34.29807, 108.96601 ], 'red', 'car.png');
	mapUtil.act.registCar('dan2', 1, [ 34.25695, 108.95012 ], 'red', 'car.png');
	doAjax("pushCar","post",false,{
		id:'dan',
		state:1,
		pos:[34.29807,108.96601]
	});
	doAjax("pushCar","post",false,{
		id:'dan2',
		state:1,
		pos:[34.25695,108.95012]
	});
    var task={
            id:'001',
            start:'22',
            end:'20',
            path:['12','11','10'],
            detailPath:null,//站点号+路径号
            keyPath:null,
            nowPath:null,
            nowPathPos:null,
            pathLine:null,//起点，终点的路径
            route:null,//起点到车的当前位置的路径
            car:null
        };
        var task2={
            id:'002',
            start:'21',
            end:'20',
            path:null,
            detailPath:null,//站点号+路径号
            keyPath:null,
            nowPath:null,
            nowPathPos:null,
            pathLine:null,//起点，终点的路径
            route:null,//起点到车的当前位置的路径
            car:null
        };
    var task1 = mapUtil.task.buildTask('001', '22', '20');
    var task2 = mapUtil.task.buildTask('002', '22', '21');
	doAjax("pushTask","post",true,{
		id:task1.id,
		start:task1.start,
		end:task1.end,
		detailPath:task1.detailPath
	});
	doAjax("pushTask","post",true,{
		id:task2.id,
		start:task2.start,
		end:task2.end,
		detailPath:task2.detailPath
	});
	refreshCarList();
	refreshTaskList();
	// console.log(mapUtil.config.hi());

	// mapUtil.act.hideCar('dan');
	mapUtil.act.showAllCars();
	// mapUtil.act.hideCar('dan');
	// mapUtil.act.hideAllCars();
	// mapUtil.act.move('dan',[34.27637, 109.00394]);
	// mapUtil.act.move('dan',[34.27637, 109.00394]);

	//mapUtil.config.addShowCoords();
	// mapUtil.config.removeShowCoords();
	mapUtil.config.create(campus);
	mapUtil.config.show('block');
	// mapUtil.config.removeShow('block');
	mapUtil.config.create(roads);
	mapUtil.config.show('lines');
	// mapUtil.config.show('lines','1');
	// mapUtil.config.show('lines','1','2');
	// mapUtil.config.removeShow('lines','2');

	mapUtil.config.create(sites);
	mapUtil.config.show('points');
	// mapUtil.config.removeShow('points','2');
	
	mapUtil.config.create(middle);//这是交叉口，只创建，不用显示
	mapUtil.config.offPop();
	// mapUtil.config.onPop();
	// mapUtil.config.setPop('block','这是个学校');
	// mapUtil.config.setPop(10,11,'这是巴黎路');

	// var d1=[34.27881, 108.99083];
	// var d2=[34.27882, 108.99464];
	// mapUtil.act.runTask(d1,d2);

	// var point = L.point(0, 0);
	// map.panBy(point);

	// mapUtil.task.test();
	// mapUtil.task.paintRoute(mapUtil.task.getTask());
	// var task=mapUtil.task.getTaskById('001');
	// var car=mapUtil.act.getCarByName('dan2');
	// mapUtil.task.paintRoute(task,car);

	// mapUtil.task.cal('21','20');

	//var task2 = mapUtil.task.getTaskById('002');
	// var task3=mapUtil.task.buildTask('003','20','22');
	// mapUtil.task.paintPath(task3);
	// mapUtil.task.clearPath(task3);

var newPos=[[34.30714, 108.95451],[34.29169, 108.95845],
            [34.27296, 108.99879],[34.29112, 109.02351],
            [34.30714, 108.95451],[34.29169, 108.95845],
            [34.27296, 108.99879],[34.29112, 109.02351],
            [34.30714, 108.95451],[34.29169, 108.95845],
            [34.27296, 108.99879]];
var count=0;
var timer=window.setInterval(function(){
	moveCars();
	console.log("刷新一次");
},1000); 

function moveCars(){
	var cars=mapUtil.act.getCarList();
	console.log(cars);
	for(var i=0;i<cars.length;i++){
		var car=getNowCarPos(cars[i].info.name);
		//mapUtil.act.move(car.id,car.pos);
		mapUtil.act.move(car.id,newPos[count]);//模拟数据
	}
    count++;
    if(count==10){
        window.clearTimeout(timer);
    }
    
    function getNowCarPos(carName){
    	console.log(carName);
    	var simPlecar=doAjax("getCar","get",false,{
    		carID:carName
    	});
    	console.log(simPlecar);
    	simPlecar.pos=[parseFloat(simPlecar.pos[0]), parseFloat(simPlecar.pos[1])];
    	return simPlecar;
    }
}



function doAjax(url,type,async,data) {
	console.log("准备进行-----  "+url);
	var target;
	$.ajax({
		url : url,
		type : type,
		async : async,
		contentType : "application/x-www-form-urlencoded;charset=utf-8",
		//发送时的编码信息
		data : data,
		//dataType : "json",预期服务器返回的数据类型
		success : function(result) {
			console.log(result);
			target=result;
		},
		error:function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
	return target;
}
function toggleShow(type){
	if(type=='Coords'){
		var showCoords=document.getElementById("showCoords");
		if(showCoords.value=="开启坐标显示"){
			showCoords.value="关闭坐标显示";
			mapUtil.config.addShowCoords();
		}else{
			showCoords.value="开启坐标显示";
			mapUtil.config.removeShowCoords();
		}
	}else if(type=='Blocks'){
		var showCoords=document.getElementById("showBlocks");
		if(showCoords.value=="隐藏板块"){
			showCoords.value="显示板块";
			mapUtil.config.removeShow('block');
		}else{
			showCoords.value="隐藏板块";
			mapUtil.config.show('block');
		}
	}else if(type=='Lines'){
		var showCoords=document.getElementById("showLines");
		if(showCoords.value=="隐藏路线"){
			showCoords.value="显示路线";
			mapUtil.config.removeShow('lines');
		}else{
			showCoords.value="隐藏路线";
			mapUtil.config.show('lines');
		}
	}else if(type=='Points'){
		var showCoords=document.getElementById("showPoints");
		if(showCoords.value=="隐藏站点"){
			showCoords.value="显示站点";
			mapUtil.config.removeShow('points');
		}else{
			showCoords.value="隐藏站点";
			mapUtil.config.show('points');
		}
	}else{
		var showCoords=document.getElementById("showPop");
		if(showCoords.value=="开启名称显示"){
			showCoords.value="隐藏名称显示";			
			mapUtil.config.onPop();
		}else{
			showCoords.value="开启名称显示";
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
					console.log(task);
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
	for (var i = container.childNodes.length-1; i >= 0; i--) {
		container.removeChild(container.childNodes[i]);
	}

	var cars = mapUtil.act.getCarList();
	console.log(cars);
	for (var i = 0; i < cars.length; i++) {
		container.appendChild(buildSingle(cars[i]));
	}
}

function getPosition() {
	var clickPoint;
	map.on('click', function(e) {
		clickPoint = e.latlng.toString();
		document.getElementById("pos").value = clickPoint;
	});
	console.log(clickPoint);
}
function checkRegisCar() {
	var carID = document.getElementById("carId").value;
	var state = document.getElementsByName("nowstate")[1].checked ? 2 : 1;
	var temppos = document.getElementById("pos").value;
	var pos = temppos.substring(7, temppos.length - 1);
	var comma = pos.split(',');
	pos = [ parseFloat(comma[0]), parseFloat(comma[1]) ];
	mapUtil.act.registCar(carID, state, pos, 'red', 'car.png');
	
	doAjax("pushCar","post",true,{
		id:carID,
		state:state,
		pos:pos
	});
	
	mapUtil.act.showAllCars();
	refreshCarList();
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
	var task = mapUtil.task.buildTask(taskID, start, end);
	task=mapUtil.task.buildPath(task);
	doAjax("pushTask","post",true,{
		id:task.id,
		start:task.start,
		end:task.end,
		detailPath:task.detailPath
	});
	refreshTaskList();
}
function refreshTaskList() {
	var container = document.getElementById("tasklist");
	// 一定要从后往前删除，因为每删除一次，childNodes的序号变动一次
	for (var i = container.childNodes.length - 1; i >=0; i--) {
		container.removeChild(container.childNodes[i]);
	}
	var taskList = mapUtil.task.getAllTask();
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
					
					doAjax("assginCar","post",false,{
						taskId:assign.name,
						carId:car.info.name
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

	single.appendChild(span);
	single.appendChild(start);
	single.appendChild(end);
	single.appendChild(assign);
	single.appendChild(pathBt);
	return single;
}

