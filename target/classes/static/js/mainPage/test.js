
//dispatcher.common.getcookie();
//dispatcher.common.setcookie('daniel','25',2);
//dispatcher.common.setcookie('da','12',2);
//dispatcher.common.setcookie('dan','3',2);
//dispatcher.common.setSessionStore('go','1');
//dispatcher.common.getSessionStore('go');

//测试mapUtil.utils.parseToFloat
//var x="3.3";
//console.log(typeof mapUtil.utils.parseToFloat(x));

//测试mapUtil.utils.turnToLatLng
/*var pos1=[34.2,108.9];
var pos2=["34.2","108.9"];
var pos3=[108.9,34.2];
var pos4=["108.9","34.2"];
var pos5={
		lat:"32.3",
		lng:"108.9"
}
var pos6={
		lat:32.3,
		lng:108.9
}

mapUtil.config.toggleOneShape(target.marker,true);
mapUtil.config.toggleShapes(arrays,key,flag);

console.log(mapUtil.utils.turnToLatLng(pos1));
console.log(mapUtil.utils.turnToLatLng(pos2));
console.log(mapUtil.utils.turnToLatLng(pos3));
console.log(mapUtil.utils.turnToLatLng(pos4));
console.log(mapUtil.utils.turnToLatLng(pos5));
console.log(mapUtil.utils.turnToLatLng(pos6));*/

//测试mapUtil.utils.compareTwoCoords
//var pos1=["34.2","108.9"];
//var pos2=["34.2","108.9"];
//console.log(mapUtil.utils.compareTwoCoords(pos1,pos2));

// mapUtil.utils.isArray
//getArrayIndex
//getArrayWithKey

//mapUtil.utils.getArrayIndex(idArray,shapeArray[i].id)==null
//for(var i=0;i<shapeArray.length;i++){
//	var checkResult=mapUtil.utils.getArrayIndex(idArray,shapeArray[i].id);
//    if(checkResult!=null){
//        shapeArray[i].shape.addTo(map);
//}}

//refreshCars:function(cars){
//            	for(var i=0;i<cars.length;i++){	
//            		if(findCarByName(cars[i].id)==null){
//            			regisCar(cars[i]);
//            		}	
//            	}
//            	for(var i=0;i<carList.length;i++){		
//            		//暂时性的初始画的方法
//            		carList[i].pathPoints=[[34.22603, 108.99625],[34.22606, 108.99619],
//    				                [34.22611, 108.99614],[34.22616, 108.99604],
//    				                [34.22623, 108.99596]];
//    	    		if(carList[i].pathMarkerLine==null){
//    	    			createUpdateCarPath(carList[i],false);
//    	    		}
//            	}
//            	return carList;
//            },