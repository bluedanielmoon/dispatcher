~(function(L,map) {
	var mapUtil=mapUtil ||{};

    var mapIcons={
        baseballIcon : L.icon({
            iconUrl: 'images/baseball-marker.png',
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28]
        })
    };
    function getArrayIndex(array,key,value){
        for(var i=0;i<array.length;i++){
            if(value==array[i][key]){
                return array[i];
            }
        }
        return null;
    }

    mapUtil.test=function(){
    	var a={};
    	a.data={};
    	return{
    		hi:function(){
    			alert("hi");
    		},
    		hello:function(){
				alert("hello");
    		}
    	}
    }();

    mapUtil.utils=function(){

        return{
            exchangeLatlng:function(latlng){
                return [latlng[1],latlng[0]];
            }
        }
    }();
    
    mapUtil.resource=function(){
        var icons={
            siteIcon : L.icon({
                iconUrl: 'images/site32.png',
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -28]
            }),
            carIcon : L.icon({
                iconUrl: 'images/car32.png',
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -28]
            }),
            redCarIcon : L.icon({
                iconUrl: 'images/car32_red.png',
                iconSize: [32, 37],
                iconAnchor: [16, 37],
                popupAnchor: [0, -28]
            }),
        }
        var marker={
            block:{
                strokeLinecap:"round",
                fillColor: "#ff7800",
                color: "#ff7800",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.3,
                strokeOpacity:1
            },
            line:{
                strokeLinecap:"round",
                color: "#3388ff",
                weight: 3,
                opacity: 1,
                fillOpacity: 0.5,
                strokeOpacity:1
            },
            route:{
                strokeLinecap:"round",
                color: "#FF0000",
                weight: 6,
                opacity: 1,
                fillOpacity: 1,
                strokeOpacity:1,
                dashArray:"10,10"
            },
            path:{
                strokeLinecap:"round",
                color: "#7CFC00",
                weight: 4,
                opacity: 1,
                fillOpacity: 1,
                strokeOpacity:1
            },
            circle:{
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            }
                        
        }
        return{
            getMarker:function(name){
                return marker[name];
            },
            getIcon:function(name){
                return icons[name];
            }
        }
    }();

    mapUtil.config=function(){
        var coords={
            clickMapPopCoords:true,
            clickMapConsoleCoords:true
        }
        var tempLayer;
        var pop=true;
        var campus={
            id:null,
            shape:null,
            layer:null,
            popContent:null
        };
        var roads=[];
        var sites=[];
        var middles=[];

        function checkID(array,start,key){
            if(null==array||null==key||start>=array.length){
                return null;
            }
            for(var i=start;i<array.length;i++){
                if(key==array[i]){
                    return true;
                }
            }
            return false;
        }
        function addShapesByID(idArray,shapeArray){
            if(idArray.length==0){
                for(var i=0;i<shapeArray.length;i++){
                    shapeArray[i].shape.addTo(map);
                } 
            }else{ 
                for(var i=0;i<shapeArray.length;i++){
                    if(checkID(idArray,0,shapeArray[i].id)){
                        shapeArray[i].shape.addTo(map);
            }}}
        }
        function removeShapesByID(idArray,shapeArray){
            if(idArray.length==0){
                for(var i=0;i<shapeArray.length;i++){
                    shapeArray[i].shape.remove();
                } 
            }else{ 
                for(var i=0;i<shapeArray.length;i++){
                    if(checkID(idArray,0,shapeArray[i].id)){
                        shapeArray[i].shape.remove();
            }}}
        }
        function showMap(type,ids){
            switch(type){
                case 'block':
                    campus.shape.addTo(map);
                    break;
                case 'lines':
                    addShapesByID(ids,roads);
                    break;
                case 'points':
                    addShapesByID(ids,sites);
                    break;
            }
        }
        function hideMap(type,ids){            
            switch(type){
                case 'block':
                    campus.shape.remove();
                    break;
                case 'lines':
                    removeShapesByID(ids,roads);
                    break;
                case 'points':
                    removeShapesByID(ids,sites);
                    break;
            }
        }
        function createMap(target){
            if(target.type=="FeatureCollection"){
                if(target.features[0]&&target.features[0].geometry.type=="LineString"){
                    //创建道路
                    //清空数组，下面的新建有可能是更新，有可能是新建
                    roads.splice(0,roads.length);
                    for(var i=0;i<target.features.length;i++){
                        var road=createTarget(target.features[i]);
                        roads[roads.length]={
                            id:target.features[i].id,
                            name:target.features[i].properties.name,
                            pos:target.features[i].geometry.coordinates,
                            broken:target.features[i].properties.underConstruction,
                            shape:road,
                            layer:tempLayer,
                            popContent:target.features[i].properties.name+"  "+
                                    tempLayer.getPopup().getContent()
                        }
                    }
                }else if(target.features[0].id.charAt(0)=="2"){
                    sites.splice(0,sites.length);
                    for(var i=0;i<target.features.length;i++){
                        var site=createTarget(target.features[i]);
                        sites[sites.length]={
                            id:target.features[i].id,
                            name:target.features[i].properties.name,
                            pos:target.features[i].geometry.coordinates,
                            shape:site,
                            layer:tempLayer,
                            popContent:target.features[i].properties.name+"  "+
                                    tempLayer.getPopup().getContent()
                        }
                    }
                }else{
                	middles.splice(0,middles.length);
                    for(var i=0;i<target.features.length;i++){
                        middles[middles.length]={
                            id:target.features[i].id,
                            name:target.features[i].properties.name,
                            pos:target.features[i].geometry.coordinates,
                            popContent:target.features[i].properties.name+"  "+
                                    tempLayer.getPopup().getContent()
                        }
                    }
                }

            }else{
                campus.id=target.id;
                campus.shape=createTarget(target);
                campus.layer=tempLayer;
                campus.pos=target.geometry.coordinates,
                campus.popContent=tempLayer.getPopup().getContent()
            }
        }
        function editMap(callback) {
            callback(campus);
            for(var i=0;i<roads.length;i++){
                callback(roads[i]);
            }
            for(var i=0;i<sites.length;i++){
                callback(sites[i]);
            }
        }
        function findArray(array,key,test){
            for(var i=0;i<array.length;i++){
                if(array[i][key]==test){
                    return array[i];
                }
            }
        }
        function getTargetByID(id){
            var sId=id.toString().substring(0,1);
            if(sId=='0'){
                return campus;
            }else if(sId=='1'){
                return findArray(roads,'id',id);
            }else if(sId=='2'){
                return findArray(sites,'id',id);
            }else if(sId=='3'){
                return findArray(middles,'id',id);
            }else
                return null;
        }
        function getByTypeID(type){
            switch(type){
                case 'block':
                    return campus;
                case 'lines':
                    return roads;
                case 'points':
                    return sites;
                case 'middles':
                    return middles;
            }
        }
        function addCommonPop(feature, layer) {  
            var popupContent = "";

            if (feature.properties && feature.properties.popupContent) {
                popupContent += feature.properties.popupContent;
            }
            tempLayer=layer.bindPopup(popupContent);   
        }
        function createTarget(target){
            return L.geoJSON(target, {
                filter: function (target, layer) {
                    if (target.properties) {
                        // If the property "underConstruction" exists and is true, return false (don't render features under construction)
                        return target.properties.underConstruction !== undefined ? !target.properties.underConstruction : true;
                    }
                    return false;
                },

                style: function (target) {
                    
                    switch(target.geometry.type){
                        case 'MultiPolygon':
                            return mapUtil.resource.getMarker("block");
                        case 'LineString':
                            return mapUtil.resource.getMarker("line");
                        case 'Point':
                            return mapUtil.resource.getMarker("circle");
                    }
                },
                onEachFeature: addCommonPop,

                pointToLayer: function (target, latlng) {
                    //return L.circleMarker(latlng, mapUtil.resource.getMarker("circle"));
                    return L.marker(latlng, {icon: mapUtil.resource.getIcon("siteIcon")});
                }
            });
        }

        function showCoords(e) {
            
            var popup = L.popup();
            var border=[];
            var bCount=0;
            popup.setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString());
                
            if(coords.clickMapPopCoords){
                popup.openOn(map);
            }
            if(coords.clickMapConsoleCoords){
                console.log("you just clicked "+e.latlng.toString());
            }

            border[bCount++]=e.latlng;
            for(var i=0;i<bCount;i++){
                console.log(border[i]);
            }
        
        }
        return {
            show:function(){
                var ids=[];
                for(var i=1;i<arguments.length;i++){
                    ids[ids.length]=arguments[i];
                }
                showMap(arguments[0],ids);
            },
            removeShow:function(){
                var ids=[];
                for(var i=1;i<arguments.length;i++){
                    ids[ids.length]=arguments[i];
                }
                hideMap(arguments[0],ids);
            },
            create:function(target){
                createMap(target);
            },
            onPop:function(){
                editMap(function bind(box){
                    box.layer.bindPopup(box.popContent);
                });
            },
            offPop:function(){
                editMap(function ubind(box){
                    box.layer.unbindPopup();
                });
            },
            setPop:function(){
                if(arguments==null||arguments.length<2){
                    return console.log('设置pop失败，参数不对');
                }
                var params=[];
                for(var i=0;i<arguments.length-1;i++){
                    params[params.length]=arguments[i];
                }         
                var target=getByTypeID(params[0]);
                if(target instanceof Array){
                    for(var i=0;i<target.length;i++){
                        target[i].popContent=arguments[arguments.length-1];
                        target[i].layer.bindPopup(target[i].popContent);
                    }
                }else{
                    target.popContent=arguments[arguments.length-1];
                    target.layer.bindPopup(target.popContent);
                }                
            },
            addShowCoords:function(){
                map.on('click', showCoords);
            },
            removeShowCoords:function(){
                map.off('click', showCoords);
            },
            getTargetByID:function(id){
                return getTargetByID(id);
            },
            getRoads:function(){
                return getByTypeID('lines');
            },
            getMiddles:function(){
                return getByTypeID('middles');
            }
        }
    }();

   
    mapUtil.task=function(){
        var taskList=[];
        var pathLength=[];
        //给出起点、终点和正确的中间路径，返回所有关键点集合
        function getKeyPathByPathSites(task){
            var pathPos=[];
            var keyPath=[];
            var point;//用来对比的关键点

            point=keyPath[0]=mapUtil.config.getTargetByID(task.start).pos;
            for(var i=0;i<task.path.length;i++){
                pathPos[pathPos.length]=mapUtil.config.getTargetByID(task.path[i]).pos;
            }
            
            for(var i=0;i<pathPos.length;i++){
                if(pathPos[i][0][0]==point[0]&&pathPos[i][0][1]==point[1]){
                    keyPath[i+1]=point=pathPos[i][1];
                }else if(pathPos[i][1][0]==point[0]&&pathPos[i][1][1]==point[1]){
                    keyPath[i+1]=point=pathPos[i][0];
                }
            }
            return keyPath;
        }
        function buildPath(task){
            task.path=getLeastPath(task.start,task.end);
            task.keyPath=getKeyPathByPathSites(task);
            task.detailPath=getDetailPath(task);
            for(var i=0;i<task.keyPath.length;i++){
                task.keyPath[i]=mapUtil.utils.exchangeLatlng(task.keyPath[i]);
            }
            return task;
        }
        function getDetailPath(task) {
			var middlePoints=mapUtil.config.getMiddles();
			
			var pathCouple=[];
			pathCouple[0]=task.start;
			pathCouple[1]=task.path[0];		
			for(var i=1;i<task.keyPath.length-1;i++){
				for(var j=0;j<middlePoints.length;j++){
					if(task.keyPath[i][0]==middlePoints[j].pos[0]&&
							task.keyPath[i][1]==middlePoints[j].pos[1]){
						pathCouple[pathCouple.length]=middlePoints[j].id;
						pathCouple[pathCouple.length]=task.path[i];
					}
				}
			}
			return pathCouple;
		}
        function calcuPathLength(){
            var roads=mapUtil.config.getRoads();
            for(var i=0;i<roads.length;i++){
                pathLength[pathLength.length]={
                    road:roads[i],
                    distance:map.distance(mapUtil.utils.exchangeLatlng(roads[i].pos[0])
                        ,mapUtil.utils.exchangeLatlng(roads[i].pos[1]))
                }
            }
        }
        //给定一个站点，返回站点相连的所有的道路
        //notSitePos--返回道路中两个点中不是site的那个点
        function checkPathAroundPoint(latlng,toCheckPath){
            var paths=[];
            for(var i=0;i<toCheckPath.length;i++){
                if(latlng[0]==toCheckPath[i].road.pos[0][0]&&
                    latlng[1]==toCheckPath[i].road.pos[0][1]){
                    var path={
                        content:toCheckPath[i],
                        notSitePos:toCheckPath[i].road.pos[1],
                        toGO:null
                    }
                    paths[paths.length]=path;
                }else if(latlng[0]==toCheckPath[i].road.pos[1][0]&&
                    latlng[1]==toCheckPath[i].road.pos[1][1]){
                    var path={
                        content:toCheckPath[i],
                        notSitePos:toCheckPath[i].road.pos[0],
                        toGO:null
                    }
                    paths[paths.length]=path;
                }
            }
            return paths;
        }


        //deepCopy,true---进行深复制，false---进行浅复制
        function splicePathToGo(paths,toGO,deepCopy){
            if(deepCopy){
                var newtoGO=toGO.slice(0);
            }else{
                var newtoGO=toGO;
            }
            
            if(paths instanceof Array){
                for(var i=0;i<paths.length;i++){
                    for(var j=0;j<newtoGO.length;j++){
                        if(paths[i].content.road.id==newtoGO[j].road.id){
                            newtoGO.splice(j,1);
                        }
                    }
                }
            }else{
                for(var j=0;j<newtoGO.length;j++){
                    if(paths.content.road.id==newtoGO[j].road.id){
                        newtoGO.splice(j,1);
                    }
                }              
            }
            return newtoGO;
        }
        function checkEnd(paths,endPos){
            for(var i=0;i<paths.length;i++){
                if(paths[i].notSitePos==endPos){
                    return paths[i];
                }
            }
            return null;
        }
        function checkFinishToGO(paths){
            for(var i=0;i<paths.length;i++){           
                for(var j=0;j<paths[i].length;j++){
                    if(paths[i][j].toGO.length>0){
                        return true;
                    }
                }      
            }
            return false;
        }
        function checkIfHasEnd(paths,end,findPath){
            var unfinish=[];
            for(var i=0;i<paths.length;i++){
                var last=paths[i][paths[i].length-1];
                if(last.notSitePos[0]==end.pos[0]&&
                    last.notSitePos[1]==end.pos[1]){
                    //console.log("找到一条路径");
                    findPath[findPath.length]=paths[i];
                }else{
                    if(last.toGO.length>0){//一条路径走完
                        unfinish[unfinish.length]=paths[i];
                    }
                }
            }
            return {
                findPath:findPath,
                unfinish:unfinish
            }
        }
        function findLeastPath(findPath){
            var leastDistance=0;
            var leastIndex=0;
            var tempDistance=0;
            var ids=[];

            if(findPath &&findPath.length>0){
                for(var i=0;i<findPath.length;i++){
                    //console.log("第 "+(i+1)+" 条路径");
                    
                    for(var j=0;j<findPath[i].length;j++){
                        if(i==0){
                            leastDistance+=findPath[i][j].content.distance;
                        }else{
                            tempDistance+=findPath[i][j].content.distance;
                            
                        }
                        // console.log(findPath[i][j].content.road.id);
                        // console.log(findPath[i][j].content.distance);                      
                    }
                    if(i!=0&&tempDistance<leastDistance){
                        leastDistance=tempDistance;
                        leastIndex=i;
                    }
                    tempDistance=0;
                }
                // console.log("最短的路径是：第 "+(leastIndex+1)+" 条路径");
                // console.log("最短的距离是： "+leastDistance+" 米");
            }
            for(var i=0;i<findPath[leastIndex].length;i++){
                ids[ids.length]=findPath[leastIndex][i].content.road.id;
            }
            return ids;
        }
        function getLeastPath(startSite,endSite){

            if(pathLength.length==0){
                calcuPathLength();
            }
            var initPath=[];
            var paths=[];
            var toGO=pathLength;
            var tempPath=[];
            var findPath=[];//找到的所有的路径集合
            //Object {id: "22", name: "河姬", pos: Array[2], shape: e, layer: e…}
            var start=mapUtil.config.getTargetByID(startSite);
            var end=mapUtil.config.getTargetByID(endSite);
            
            //初始化数组，一维是若干条可能路线，二维是路线的具体路径
            initPath=checkPathAroundPoint(start.pos,toGO);
            for(var i=0;i<initPath.length;i++){
                paths[i]=[];
                paths[i][0]=initPath[i];
                
                //这里的toGo是共享的，减了循环次。即初始化时减了起点的若干路径
                paths[i][0].toGO=splicePathToGo(paths[i][0],toGO,false);
            }
            var firstCheck=checkIfHasEnd(paths,end,findPath);
            paths=firstCheck.unfinish;

            while(checkFinishToGO(paths)){
                //console.log("没找完全部路径");
                tempPath=paths.slice(0);
                paths.splice(0,paths.length);

                for(var i=0;i<tempPath.length;i++){
                    
                    var dividePath=[];
                    var index=tempPath[i].length-1;
                    dividePath=checkPathAroundPoint(tempPath[i][index].notSitePos,
                        tempPath[i][index].toGO);
                    if(dividePath.length>0){//有至少一条继续的路

                        var deepCop;
                        //如果只有一条路径，用深复制。多条路径则共享剔除的路径
                        if(dividePath.length==1){
                            deepCop=false;
                        }else{
                            deepCop=false;
                        }
                        for(var j=0;j<dividePath.length;j++){
                            //console.log(dividePath.length);
                            dividePath[j].toGO=splicePathToGo(dividePath[j],
                                tempPath[i][index].toGO,deepCop);

                            var newPath=tempPath[i].slice(0);
                            newPath[newPath.length]=dividePath[j];
                            paths[paths.length]=newPath;
                        }
                    }
                    
                    
                }
                var checkResult=checkIfHasEnd(paths,end,findPath);
                paths=checkResult.unfinish;
                // for(var i=0;i<paths.length;i++){
                //     for(var j=0;j<paths[i][1].toGO.length;j++){
                //         console.log(paths[i][1].toGO[j].road.id);
                //     }
                //     console.log("-------");
                // }
            }
            //从所有找到的路径中找到一条最短的
            var leastPath=findLeastPath(findPath);
            return leastPath;
        }
        function checkWithinPath(pos1,pos2,nowPos){
            var lng=[];//经度
            var lat=[];//纬度
            
            if(pos1[0]<pos2[0]){
                lng[0]=pos1[0];
                lng[1]=pos2[0];
            }else{
                lng[0]=pos2[0];
                lng[1]=pos1[0];
            }
            if(pos1[1]<pos2[1]){
                lat[0]=pos1[1];
                lat[1]=pos2[1];
            }else{
                lat[0]=pos2[1];
                lat[1]=pos1[1];
            }
            if(nowPos[0]<=lng[1]&&nowPos[0]>=lng[0]&&
                nowPos[1]<=lat[1]&&nowPos[1]>=lat[0]){
                return true;
            }else{
                return false;
            }
            

        }
        
        function getNowPath(car){
            if(pathLength.length==0){
                calcuPathLength();
            }
            var currentPos=mapUtil.utils.exchangeLatlng(car.info.pos);
            
            var minDistance;
            if(checkWithinPath(pathLength[0].road.pos[0],pathLength[0].road.pos[1],currentPos)){
                minDistance=map.distance(nearestPointOnRoad(pathLength[0].road.pos[0],
                    pathLength[0].road.pos[1],currentPos),mapUtil.utils.exchangeLatlng(currentPos));
            }else{
                minDistance=null;
            }
            var temp;
            var index=0;
            for(var i=1;i<pathLength.length-1;i++){
                if(checkWithinPath(pathLength[i].road.pos[0],pathLength[i].road.pos[1],currentPos)){
                    temp=map.distance(nearestPointOnRoad(pathLength[i].road.pos[0],pathLength[i].road.pos[1]
                        ,currentPos),mapUtil.utils.exchangeLatlng(currentPos));
                    if(minDistance==null||minDistance>temp){
                        minDistance=temp;
                        index=i;
                    }  
                }
            }
            
            return pathLength[index].road.id;
            
        }
        
        function buildRoute(task,car){

            task.keyPath=getKeyPathByPathSites(task);//经+纬
            task.nowPath=getNowPath(car);
            var currentPos=mapUtil.utils.exchangeLatlng(car.info.pos);//[108.99536,34.25835]
            var underGoPath=mapUtil.config.getTargetByID(task.nowPath).pos;//经+纬
            task.nowPathPos=nearestPointOnRoad(underGoPath[0],underGoPath[1],currentPos);

            var hasGO=[];
            hasGO[0]=mapUtil.utils.exchangeLatlng(task.keyPath[0]);//起点坐标
            for(var i=0;i<task.path.length;i++){
                if(task.nowPath!=task.path[i]){
                    hasGO[hasGO.length]=mapUtil.utils.exchangeLatlng(task.keyPath[i+1]);
                }else{
                    hasGO[hasGO.length]=task.nowPathPos;
                    break;
                }
            }
            return hasGO;   //纬 + 经
        }


        //凡是设置L.polyline(latlng,{});其中的latlng都是纬度在前，经度
        function nearestPointOnRoad(road1,road2,pos){
            var k=(road2[1]-road1[1])/(road2[0]-road1[0]);
            var b=road2[1]-k*road2[0];

            var x=(k*(pos[1]-b)+pos[0])/(Math.pow(k,2)+1);
            var y=k*x+b;   
            //[34.27970691937742, 109.0144143263009]
            return [y,x];       
        }
        //至少要有id，起点，终点,且起点终点不相同
        function addTask(id,start,end,path){
            var task={
                id:id,
                start:start,
                end:end,
                path:path,//路径的点\
                detailPath:null,//站点号+路径号
                keyPath:null,
                nowPath:null,
                nowPathPos:null,
                pathLine:null,//起点，终点的路径
                route:null,//起点到车的当前位置的路径
                car:null
            }
            taskList[taskList.length]=task;
            return task;
        }

        return {
            test:function(){

                //在这里得到的是正经的经度 +  纬度  [109.0144 ，34.2797]
                var x=mapUtil.config.getTargetByID('12').pos;
                var kk=nearestPointOnRoad(x[0],x[1],[109.02317,34.28176]);

                //下面的marker必须是纬度+经度 [34.2797, 109.0144]
                L.marker(kk,{icon: mapUtil.resource.getIcon("carIcon")}).addTo(map);
            },
            buildTask:function(){
                return addTask(arguments);
            },
            refreshTasks:function(tasks){
            	taskList.splice(0,taskList.length);
            	for(var i=0;i<tasks.length;i++){
            		var task=addTask(tasks[i].id,tasks[i].start,tasks[i].end);
            		buildPath(task);
            	}
            	return taskList;    
            },
            assignCar:function(task,car){
                task.car=car;
            },
            getTaskById:function(id){
                return getArrayIndex(taskList,'id',id);
            },
            getTaskByCarId:function(carId){
                for(var i=0;i<taskList.length;i++){
                    if(taskList[i].car && taskList[i].car.info.name==carId){
                        return taskList[i];
                    }
                }
                return null;
            },
            getAllTask:function(){
                return taskList;
            },
            buildPath:function(task){    
               return buildPath(task);
            },
            paintPath:function(task){    
                task.pathLine= L.polyline(task.keyPath,
                     mapUtil.resource.getMarker("path")).addTo(map);
            },
            clearPath:function(task){
                task.pathLine.remove();
            },
            clearAllPath:function(){
                for(var i=0;i<taskList.length;i++){
                    if(taskList[i].pathLine!=null){
                        taskList[i].pathLine.remove();
                    }
                }  
            },
            paintRoute:function(task,car){
                task.route= L.polyline(buildRoute(task,car), 
                    mapUtil.resource.getMarker("route")).addTo(map);
            },
            clearRoute:function(task){
                task.route.remove();
            },
            clearAllRoute:function(){
                for(var i=0;i<taskList.length;i++){
                    if(taskList[i].route!=null){
                        taskList[i].route.remove();
                    }
                }  
            },
            cal:function(start,end){
                getLeastPath(start,end);
            }
        }

    }();

    mapUtil.act=function(){
    	
    	var carList=[];
        var choosedCar=null;
    	function findCarByName(name){
    		for(var i=0;i<carList.length;i++){
    			if(name==carList[i].info.name){
    				return carList[i];
    			}
    		}
    		return null;
    	}
    	function getCarIndex(name){
    		for(var i=0;i<carList.length;i++){
    			if(name==carList[i].info.name){
    				return i;
    			}
    		}
    		return null;
    	}
    	function bindCarMarker(target,green){
            if(null==target){
                return null;
            }
            var icon;
            if(typeof(green)== "undefined" || green==true){
                icon=mapUtil.resource.getIcon("carIcon");
            }else{
                icon=mapUtil.resource.getIcon("redCarIcon");
            }
            //marker的图片路径是：（leaflet.css）images/marker-icon.png
			target.marker = L.marker(target.info.pos,
                {icon: icon})
				.bindTooltip(target.info.name,{
					direction:'top',
					sticky:true
				}).on('click',function(){
                    choosedCar=target;
                    alert("你刚才选择了 "+choosedCar.info.name+" !");
                });
    	}
        function addCar(target,green){
            if(green==null){
                green=true;
            }
            if(target!=null){
                removeCar(target);
                bindCarMarker(target,green);  
                target.marker.addTo(map);
            }                        
        }
        function removeCar(target){
            target.marker.remove();
        }
    	function showCars(green){
            if(green==null){
                green=true;
            }
            if(null==carList){
                return null;
            }
    		for(var i=0;i<carList.length;i++){
                if(carList[i].marker!=null){
                    removeCar(carList[i]);
                } 
                bindCarMarker(carList[i],green);
                if(carList[i].show==true){
                    addCar(carList[i]);
                }else{
                    removeCar(carList[i]);
                }
			}
        }
		function setOne(){
			var num=arguments.length;
    		if(null==num ||num<3){
    			return null;
    		}
			var target= findCarByName(arguments[0]);
			if(null==target){
				return null;
			}
			switch(num-2){
    			case 1:
    				target[arguments[1]]=arguments[num-1];
                    return target;   			    				
    			case 2:
    				target[arguments[1]][arguments[2]]=arguments[num-1];   			   				
    				return target; 
    		}
		    return null;
		}
		function setAll(){

			var num=arguments.length;
    		if(null==num ||num<2){
    			return null;
    		}		
    		switch(num-1){
    			case 1:
    				for(var i=0;i<carList.length;i++){
    					carList[i][arguments[0]]=arguments[num-1];   			
    				}
    				break;
    			case 2:
    				for(var i=0;i<carList.length;i++){
    					carList[i][arguments[0]][arguments[1]]=arguments[num-1];   			
    				}
    				break;
    		}
		    return null;
		}
        function regisCar(carInfo){
            var car={
                info:{
                    name:carInfo.id,
                    state:parseInt(carInfo.state),
                    pos:[parseFloat(carInfo.pos[0]),parseFloat(carInfo.pos[1])],//lati+longi...维度+经度
                    color:null,
                    icon:null
                },
                show:true,
                marker:null
            };
            carList[carList.length]=car;
            return car;
        }         

    	return{
    		registCar:function(){
    			return regisCar(arguments);
    		},
    		unRegistCar:function(name){
                //先删除图像，再删除数据
                setOne(name,'show',false);
                showCars();
    		},
    		refreshCars:function(cars){
            	carList.splice(0,carList.length);
            	for(var i=0;i<cars.length;i++){
            		regisCar(cars[i]);
            	}
            	return carList;
            },
            getCarByName:function(name){
                return findCarByName(name);
            },
            getChoosedCar:function(){
                return choosedCar;
            },
            resetChoosedCar:function(){
                choosedCar=null;
            },
    		getCarList:function(){
    			return carList;
    		},
            runTask:function(d1,d2){
                //console.log(map.latLngToContainerPoint(e.latlng));
                bindMapPixels();
            },
			showCar:function(name){
				setOne(name,'show',true);
				addCar(findCarByName(name));                                                                                                          
    		},
            changeCarIcon:function(carName){
                addCar(findCarByName(carName),false);           
            },
    		hideCar:function(name){
    			setOne(name,'show',false);
    			var car =findCarByName(name);
    			removeCar(car);
    		},
    		showAllCars:function(){
	    		showCars();	
    		},
    		hideAllCars:function(){
				setAll('show',false);
		    	showCars();
	    	},
	    	move:function(name,pos){
				setOne(name,'info','pos',pos);
				var car=findCarByName(name);
				car.marker.setLatLng(L.latLng(pos[0],pos[1]));
	    	},
	    	moveByLine:function(name,timeInterval,line){

                var target=findCarByName(name);
                var count=0;
                var timer=window.setInterval(function(){
                    go(line);
                },timeInterval); 

	    		function go(line){   
                    setOne(name,'info','pos',line[count]);
                    addRemoveCar(target);
                    count++;
                    if(count==line.length){
                        window.clearTimeout(timer);
                    }
				}
	    	}
    	}
    }();

   	window.mapUtil=mapUtil;
})(L, map);