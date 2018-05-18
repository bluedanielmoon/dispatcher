var map = L.map('map', {
	// 34.28243, 108.97648
	// 34.22609, 108.99558//18--曲江校区中心
	// 34.22629, 108.99712--复杂地图中心
	center : [ 34.22629, 108.99712 ],
	zoom : 18,// 17
	minZoom : 1,
	maxZoom : 20,
// maxBounds:L.latLngBounds([42.224858,107.996500],
// [33.224858,109.996500]),//维度越大越靠北，精度越大越靠右
});
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
// {
// maxZoom : 20,
// attribution : 'Map data &copy; <a
// href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
// + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
// + 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
// id : 'mapbox.streets'
// }).addTo(map);
~(function(L, map) {
	var mapUtil = mapUtil || {};

	mapUtil.utils = function() {

		return {
			// 对于没有对象，只有属性（属性可以是数组）的对象，这样就够了
			deepCopy : function(source) {
				var result = {};
				for ( var key in source) {
					if (this.isObject(source[key])) {
						if (this.isArray(source[key])) {
							result[key] = [];
							for ( var i in source[key]) {
								result[key][i] = source[key][i];
							}
						} else {
							result[key] = this.deepCopy(source[key]);
						}
					} else {
						result[key] = source[key];
					}
				}
				return result;
			},
			isObject : function(value) {
				return (typeof value === 'object');
			},
			isNumber : function(value) {
				return (typeof value === 'number');
			},
			isString : function(value) {
				return (typeof value === 'string');
			},
			isBoolean : function(value) {
				return (typeof value === 'boolean');
			},
			isArray : function(value) {
				if (value && typeof value.length != "undefined") {
					return true;
				}
				return false;
			},
			compareTwoCoords : function(latlng1, latlng2) {
				if (latlng1 && latlng2) {
					if (this.isArray(latlng1) && this.isArray(latlng2)) {
						if (latlng1[0] == latlng2[0]
								&& latlng1[1] == latlng2[1]) {
							return true;
						} else {
							return false;
						}
					} else if (latlng1.lat && latlng1.lng && latlng2.lat
							&& latlng2.lng) {
						if (latlng1.lat == latlng2.lat
								&& latlng1.lng == latlng2.lng) {
							return true;
						} else {
							return false;
						}
					}
					return null;

				}
			},
			getArrayIndex : function(array, key, value) {
				if (!array || !value) {
					return;
				}
				for (var i = 0; i < array.length; i++) {
					if (value == array[i][key]) {
						return array[i];
					}
				}
				return null;
			},
			getArrayIndexWithTwoKeys : function(array, key1, key2, value) {
				if (!array || !key1 || !key2 || !value) {
					return;
				}
				for (var i = 0; i < array.length; i++) {
					if (value == array[i][key1][key2]) {
						return array[i];
					}
				}
				return null;
			},
			getArrayWithKey : function(array, key, value) {
				if (!array || !key || !value) {
					return;
				}
				for (var i = 0; i < array.length; i++) {
					if (value == array[i][key]) {
						return array[i];
					}
				}
				return null;
			},
			getArrayWithTwoKeys : function(array, key1, key2, value) {
				if (!array || !key1 || !key2 || !value) {
					return;
				}
				for (var i = 0; i < array.length; i++) {
					if (value == array[i][key1][key2]) {
						return array[i];
					}
				}
				return null;
			},
			turnToLatLng : function(pos) {
				if (this.isArray(pos) && pos.length == 2) {
					if (this.isString(pos[0])) {
						pos[0] = this.parseToFloat(pos[0]);
						pos[1] = this.parseToFloat(pos[1]);
					}
					var newPos = {};
					if (pos[0] > pos[1]) {
						newPos.lng = pos[0];
						newPos.lat = pos[1];
					} else {
						newPos.lng = pos[1];
						newPos.lat = pos[0];
					}
					return newPos;
				} else if (pos.lat && pos.lng) {
					pos.lat = this.parseToFloat(pos.lat);
					pos.lng = this.parseToFloat(pos.lng);
					return pos;
				}
			},
			parseToFloat : function(str) {
				if (str && this.isString(str)) {
					return parseFloat(str);
				}
				return str;
			},
		}
	}();

	mapUtil.resource = function() {

		var icons = {
			siteIcon : L.icon({
				iconUrl : 'images/mapIcons/site32.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			redSiteIcon : L.icon({
				iconUrl : 'images/mapIcons/site_red.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			mineIcon : L.icon({
				iconUrl : 'images/mapIcons/box.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			redMineIcon : L.icon({
				iconUrl : 'images/mapIcons/box_red.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			commuteIcon : L.icon({
				iconUrl : 'images/mapIcons/flag.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			transferIcon : L.icon({
				iconUrl : 'images/mapIcons/tower.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			redTransferIcon : L.icon({
				iconUrl : 'images/mapIcons/tower_red.png',
				iconSize : [ 32, 32 ],
				iconAnchor : [ 16, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			carIcon : L.icon({
				//机器人-robot,64,汽车car32
				iconUrl : 'images/mapIcons/car32.png',
				iconSize : [ 32, 32 ],
				popupAnchor : [ 0, -28 ]
			}),
			redCarIcon : L.icon({
				iconUrl : 'images/mapIcons/car32_red.png',
				iconSize : [ 32, 32 ],
				popupAnchor : [ 0, 0 ]
			}),
			pointIcon : L.icon({
				iconUrl : 'images/mapIcons/point.png',
				iconSize : [ 8, 8 ],
				popupAnchor : [ 0, 0 ]
			}),
			dragIcon : L.icon({
				iconUrl : 'images/mapIcons/drag.ico',
				iconSize : [ 16, 16 ],
				popupAnchor : [ 0, 0 ]
			}),
			roadPlusIcon : L.icon({
				iconUrl : 'images/mapIcons/roadPlus.ico',
				iconSize : [ 16, 16 ],
				popupAnchor : [ 0, 0 ]
			}),
		}
		var marker = {
			block : {
				strokeLinecap : "round",
				fillColor : "#ff7800",
				color : "#ff7800",
				weight : 2,
				opacity : 1,
				fillOpacity : 0.3,
				strokeOpacity : 1
			},
			redBlock : {
				strokeLinecap : "round",
				fillColor : "#FF6347",
				color : "#FF6347",
				weight : 2,
				opacity : 1,
				fillOpacity : 0.7,
				strokeOpacity : 1
			},
			blueBlock : {
				strokeLinecap : "round",
				fillColor : "#0072E3",
				color : "#0072E3",
				weight : 1,
				opacity : 1,
				fillOpacity : 0.4,
				strokeOpacity : 1
			},
			line : {
				strokeLinecap : "round",
				color : "#3388ff",
				weight : 3,
				opacity : 1,
				fillOpacity : 0.5,
				strokeOpacity : 1
			},
			polyLine : {
				color : "#3388ff",
				weight : 3,
				opacity : 1,
				fillOpacity : 0.5,
				strokeOpacity : 1
			},
			redPolyLine : {
				color : "#FA8072",
				weight : 6,
				opacity : 1,
				fillOpacity : 0.8,
				strokeOpacity : 1
			},
			heavyPolyLine : {
				color : "#3388ff",
				weight : 15,
				opacity : 1,
				fillOpacity : 0.5,
				strokeOpacity : 1
			},
			carPath : {
				color : "#FF1493",
				weight : 3,
				opacity : 0.6,
				fillOpacity : 0.5,
				strokeOpacity : 1
			},
			route : {
				strokeLinecap : "round",
				color : "#FF0000",
				weight : 6,
				opacity : 1,
				fillOpacity : 1,
				strokeOpacity : 1,
				dashArray : "10,10"
			},
			path : {
				strokeLinecap : "round",
				color : "#7CFC00",
				weight : 4,
				opacity : 1,
				fillOpacity : 1,
				strokeOpacity : 1
			},
			circle : {
				radius : 8,
				fillColor : "#ff7800",
				color : "#000",
				weight : 1,
				opacity : 1,
				fillOpacity : 1
			},
			glueCircle : {
				radius : 4,
				fillColor : "#FF69B4",
				color : "#000",
				weight : 1,
				opacity : 0.6,
				fillOpacity : 0.6,
				className : "glue-circle"
			}

		}
		return {
			getMarker : function(name) {
				return marker[name];
			},
			getIcon : function(name) {
				return icons[name];
			}
		}
	}();

	mapUtil.config = function() {
		var flag = {
			clickMapPopCoords : true,
			clickMapConsoleCoords : true,
			isPop : false,
			isToolUp : false,
			showClickCoords : false
		}

		var tempmarker;

		var blocks = [];
		var roads = [];
		var sites = [];
		var glueCircles = [];

		function checkGlueCircle(circles, pos) {
			for ( var i in circles) {
				if (circles[i].shape.getBounds().contains(pos)) {
					return circles[i].coords;
				}
			}
			return null;
		}
		function createGlueCircles(lines) {
			glueCircles = [];// 因为路线可能会更新，每次都得重置
			var options = mapUtil.resource.getMarker("glueCircle");
			options.radius = dispatcher.constants.EDIT_SITE_GLUECIRCLE_RADIOUS;
			for ( var i in lines) {
				var length = lines[i].pos.length - 1;
				if (!check(lines[i].pos[0])) {
					var circle = L.circle(lines[i].pos[0], options);
					glueCircles.push({
						coords : lines[i].pos[0],
						shape : circle
					});
				}
				if (!check(lines[i].pos[length])) {
					var circle = L.circle(lines[i].pos[length], options);
					glueCircles.push({
						coords : lines[i].pos[length],
						shape : circle
					});
				}
			}
			function check(pos) {
				for ( var i in glueCircles) {
					if (mapUtil.utils.compareTwoCoords(glueCircles[i].coords,
							pos)) {
						return true;
					}
				}
				return false;
			}
			return glueCircles;
		}

		function initIntenals() {
			blocks.splice(0, blocks.length);
			roads.splice(0, roads.length);
			sites.splice(0, sites.length);
		}
		function toggleMap(type, flag, ids) {
			switch (type) {
			case 'blocks':
				if (ids && mapUtil.utils.isArray(ids) && ids.length > 0) {
					toggleShapesWithIDs(blocks, ids, flag);
				} else {
					toggleShapes(blocks, 'shape', flag);
				}
				break;
			case 'lines':
				if (ids && mapUtil.utils.isArray(ids) && ids.length > 0) {
					toggleShapesWithIDs(roads, ids, flag);
				} else {
					toggleShapes(roads, 'shape', flag);
				}
				break;
			case 'points':
				if (ids && mapUtil.utils.isArray(ids) && ids.length > 0) {
					toggleShapesWithIDs(sites, ids, flag);
				} else {
					toggleShapes(sites, 'shape', flag);
				}
				break;
			}
		}
		function toggleOneShape(shape, flag) {
			if (shape && shape != null) {
				if (flag) {
					shape.addTo(map);
				} else {
					shape.remove();
				}
			}
		}
		function toggleShapes(arrays, key, flag) {
			if (arrays && arrays.length > 0) {
				if (flag) {
					if (key && key != '' && key != null && arrays[0][key]) {
						for ( var i in arrays) {
							arrays[i][key].addTo(map);
						}
					} else {
						for ( var i in arrays) {
							arrays[i].addTo(map);
						}
					}
				} else {
					if (key && key != '' && key != null) {
						for ( var i in arrays) {
							if (arrays[i][key] && arrays[i][key] != null) {
								arrays[i][key].remove();
							}
						}
					} else {
						for ( var i in arrays) {
							if (arrays[i] && arrays[i] != null) {
								arrays[i].remove();
							}
						}
					}

				}
			}
		}
		function toggleShapesWithIDs(arrays, key, ids, flag) {
			if (arrays && flag && arrays.length > 0) {
				if (flag) {
					for (var i = 0; i < arrays.length; i++) {
						var checkResult = mapUtil.utils.getArrayIndex(ids,
								arrays[i].id);
						if (checkResult != null) {
							arrays[i][key].addTo(map);
						}
					}
				} else {
					for (var i = 0; i < arrays.length; i++) {
						var checkResult = mapUtil.utils.getArrayIndex(ids,
								arrays[i].id);
						if (checkResult != null) {
							arrays[i][key].remove();
						}
					}
				}
			}
		}
		function createTarget(target, marker) {

			return L
					.geoJSON(
							target,
							{
								filter : function(target) {
									if (target.properties) {
										// If the property "underConstruction"
										// exists and is true, return false
										// (don't render features under
										// construction)
										return target.properties.underConstruction !== undefined ? !target.properties.underConstruction
												: true;
									}
									return false;
								},

								style : function(target) {
									switch (target.geometry.type) {
									case 'MultiPolygon':
										return mapUtil.resource
												.getMarker("block");
									case 'MultiLineString':
										return mapUtil.resource
												.getMarker("polyLine");
									case 'Point':
										return mapUtil.resource
												.getMarker("circle");
									}
								},
								onEachFeature : null,

								pointToLayer : function(target, latlng, marker) {

									switch (target.properties.type) {
									case 'house':
										return tempmarker = L.marker(latlng, {
											icon : mapUtil.resource
													.getIcon("siteIcon")
										});
									case 'mine':
										return tempmarker = L.marker(latlng, {
											icon : mapUtil.resource
													.getIcon("mineIcon")
										});
										// case 'commute':
										// return tempmarker=L.marker(latlng,
										// {icon:
										// mapUtil.resource.getIcon("commuteIcon")});
									case 'transfer':
										return tempmarker = L.marker(latlng, {
											icon : mapUtil.resource
													.getIcon("transferIcon")
										});
									}

								}
							});
		}
		function createRoad(info) {
			var road = createTarget(info);
			var result = {
				id : info.id,
				name : info.properties.name,
				pos : null,
				type : info.properties.type,
				broken : info.properties.underConstruction,
				shape : road,
				popContent : info.properties.name
			}
			if (info.geometry.type == "MultiLineString") {
				var linkToOne = [];
				for (var j = 0; j < info.geometry.coordinates.length; j++) {
					linkToOne[linkToOne.length] = mapUtil.utils
							.turnToLatLng(info.geometry.coordinates[j][0]);
					linkToOne[linkToOne.length] = mapUtil.utils
							.turnToLatLng(info.geometry.coordinates[j][1]);
				}
				result.pos = linkToOne;
			}
			return result;
		}
		function createBlock(info) {
			var block = createTarget(info);
			var result = {
				id : info.id,
				name : info.properties.name,
				pos : null,
				type : info.properties.type,
				shape : block,
				popContent : info.properties.name
			}
			var bigList = [];
			for (var i = 0; i < info.geometry.coordinates[0].length; i++) {
				var smallList = [];
				for ( var j in info.geometry.coordinates[0][i]) {
					smallList[j] = mapUtil.utils
							.turnToLatLng(info.geometry.coordinates[0][i][j]);
				}
				bigList[i] = smallList;
			}
			result.pos = bigList;
			return result;
		}

		function createMap(target, type) {
			if (target.type == "FeatureCollection") {
				if (type == 1) {
					blocks.splice(0, blocks.length);
					for (var i = 0; i < target.features.length; i++) {
						blocks[blocks.length] = createBlock(target.features[i]);
					}
				} else if (type == 2) {
					// 创建道路,清空数组，下面的新建有可能是更新，有可能是新建
					roads.splice(0, roads.length);
					for (var i = 0; i < target.features.length; i++) {
						roads[roads.length] = createRoad(target.features[i]);
					}
				} else if (type == 3) {
					sites.splice(0, sites.length);
					for (var i = 0; i < target.features.length; i++) {
						var site = createTarget(target.features[i], tempmarker);
						sites[sites.length] = {
							id : target.features[i].id,
							name : target.features[i].properties.name,
							pos : mapUtil.utils
									.turnToLatLng(target.features[i].geometry.coordinates),
							type : target.features[i].properties.type,
							shape : site,
							marker : tempmarker,
							popContent : target.features[i].properties.name
									+ "  " + target.features[i].id + "  "
						}
					}

				}

			}
		}
		function togglePopToolUp(type, arrays, flag) {
			if (type == 'popup') {
				if (flag) {
					for (var i = 0; i < arrays.length; i++) {
						arrays[i].shape.bindPopup(arrays[i].popContent);
					}
				} else {
					for (var i = 0; i < arrays.length; i++) {
						arrays[i].shape.unbindPopup();
					}
				}
			} else if (type == 'toolup') {
				if (flag) {
					for (var i = 0; i < arrays.length; i++) {
						arrays[i].shape.bindTooltip(arrays[i].popContent);
					}
				} else {
					for (var i = 0; i < arrays.length; i++) {
						arrays[i].shape.unbindTooltip();
					}
				}
			}
		}
		function getTargetByType(type, id) {
			var result;
			if ((result = mapUtil.utils.getArrayWithKey(blocks, type, id)) != null) {
				return result;
			} else if ((result = mapUtil.utils.getArrayWithKey(roads, type, id)) != null) {
				return result;
			} else if ((result = mapUtil.utils.getArrayWithKey(sites, type, id)) != null) {
				return result;
			} else {
				return null;
			}
		}
		function getTypeList(type) {
			switch (type) {
			case 'blocks':
				return blocks;
			case 'lines':
				return roads;
			case 'points':
				return sites;
			case 'glues':
				return glueCircles;
			}
		}
		function bindSiteEvent(fn, btnID) {

			for (var i = 0; i < sites.length; i++) {
				let
				site = sites[i];
				site.shape.on({
					click : function() {
						fn(btnID, site);
					}
				});
			}
		}
		function unbindSiteEvent() {
			for (var i = 0; i < sites.length; i++) {
				sites[i].shape.off();
			}
		}
		function bindMapEvent(action, fn, btn, decimal_count) {

			map.on(action, function(e) {
				fn(e.latlng, btn);
			});
		}
		function unBindMapEvent(action) {
			map.off(action);
		}
		function showCoords(e) {
			var popup = L.popup();
			popup.setLatLng(e.latlng)
					.setContent("你点击了： " + e.latlng.toString());

			if (flag.clickMapPopCoords) {
				popup.openOn(map);
			}
			if (flag.clickMapConsoleCoords) {
				console.log(e.latlng.lng.toFixed(5) + ','
						+ e.latlng.lat.toFixed(5));
			}
		}
		function getCoords(e) {
			return e.latlng;
		}

		function setIconById(id, type) {
			var items = getTypeList(type);

			for ( var i in items) {
				changeIcon(items[i].id, true);
			}
			return changeIcon(id, false);
		}
		function changeIcon(id, green) {
			var site = getTargetByType('id', id);
			switch (site.type) {
			case 'area':
				if (green) {
					site.shape.setStyle(mapUtil.resource.getMarker("block"));
				} else {
					site.shape.setStyle(mapUtil.resource.getMarker("redBlock"));
				}
				return site;
			case 'road':
				if (green) {
					site.shape.setStyle(mapUtil.resource.getMarker("polyLine"));
				} else {
					site.shape.setStyle(mapUtil.resource
							.getMarker("redPolyLine"));
				}
				return site;
			case 'house':
				if (green) {
					site.marker.setIcon(mapUtil.resource.getIcon('siteIcon'));
				} else {
					site.marker
							.setIcon(mapUtil.resource.getIcon('redSiteIcon'));
				}
				return site;
			case 'mine':
				if (green) {
					site.marker.setIcon(mapUtil.resource.getIcon('mineIcon'));
				} else {
					site.marker
							.setIcon(mapUtil.resource.getIcon('redMineIcon'));
				}
				return site;
			case 'transfer':
				if (green) {
					site.marker.setIcon(mapUtil.resource
							.getIcon('transferIcon'));
				} else {
					site.marker.setIcon(mapUtil.resource
							.getIcon('redTransferIcon'));
				}
				return site;
			}
		}
		function createSingleBlockMarkers(block) {
			var coords = block.pos;
			var draggers = [];
			var pointPlus = [];
			for ( var i in coords) {
				var smallD = [];
				var smallP = [];
				for (var j = 0; j < coords[i].length - 1; j++) {
					smallD.push(L.marker((coords[i][j]), {
						icon : mapUtil.resource.getIcon("dragIcon")
					}));
					smallP.push(L.marker(L.latLng(
							(coords[i][j].lat + coords[i][j + 1].lat) / 2,
							(coords[i][j].lng + coords[i][j + 1].lng) / 2), {
						icon : mapUtil.resource.getIcon("roadPlusIcon")
					}));
				}
				smallD.push(L.marker((coords[i][coords[i].length - 1]), {
					icon : mapUtil.resource.getIcon("dragIcon")
				}));
				smallP
						.push(L
								.marker(
										L
												.latLng(
														(coords[i][0].lat + coords[i][coords[i].length - 1].lat) / 2,
														(coords[i][0].lng + coords[i][coords[i].length - 1].lng) / 2),
										{
											icon : mapUtil.resource
													.getIcon("roadPlusIcon")
										}));
				draggers[i] = smallD;
				pointPlus[i] = smallP;
			}

			block.isDrag = false;
			block.draggers = draggers;
			block.pointPlus = pointPlus;
			return block;
		}
		function createSingleLineMarkers(road) {
			var coords = road.pos;
			var draggers = [];// 用于拖动的减号图标
			var pointPlus = [];// 用于增加的加号图标
			for ( var i in coords) {
				if (i % 2 == 0) {// 多线段点会重复，这里去掉重复的点
					draggers.push(L.marker((coords[i]), {
						icon : mapUtil.resource.getIcon("dragIcon"),
					}));
					pointPlus.push(L.marker(L.latLng(
							(coords[i].lat + coords[parseInt(i) + 1].lat) / 2,
							(coords[i].lng + coords[parseInt(i) + 1].lng) / 2),
							{
								icon : mapUtil.resource.getIcon("roadPlusIcon")
							}));
				}
			}
			draggers.push(L.marker(L.latLng(coords[coords.length - 1].lat,
					coords[coords.length - 1].lng), {
				icon : mapUtil.resource.getIcon("dragIcon")
			}));

			road.isDrag = false;
			road.draggers = draggers;
			road.pointPlus = pointPlus;
			return road;
		}
		function createBlockDragMarkers() {
			var blocks = getTypeList('blocks');
			for ( var i in blocks) {
				createSingleBlockMarkers(blocks[i]);
			}
		}
		function createLineDragMarkers() {
			var lines = getTypeList('lines');
			for ( var i in roads) {
				createSingleLineMarkers(roads[i]);
			}
		}
		function toggleBlockDragIcons(blockID) {
			var blockList = getTypeList('blocks');
			for ( var x in blockList) {
				if (blockList[x].id == blockID) {
					var block = blockList[x];
					if (block.isDrag) {
						block.isDrag = false;
						for (var i = 0; i < block.draggers.length; i++) {
							mapUtil.config.toggleShapes(block.draggers[i],
									null, false);
							mapUtil.config.toggleShapes(block.pointPlus[i],
									null, false);
						}
					} else {
						block.isDrag = true;
						for (var i = 0; i < block.draggers.length; i++) {
							mapUtil.config.toggleShapes(block.draggers[i],
									null, true);
							mapUtil.config.toggleShapes(block.pointPlus[i],
									null, true);
						}
					}
				} else {
					blockList[x].isDrag = false;
					for (var i = 0; i < blockList[x].draggers.length; i++) {
						mapUtil.config.toggleShapes(blockList[x].draggers[i],
								null, false);
						mapUtil.config.toggleShapes(blockList[x].pointPlus[i],
								null, false);
					}
				}
			}
		}
		function toggleLineDragIcons(roadID) {
			var roadlist = getTypeList('lines');
			for ( var x in roadlist) {
				if (roadlist[x].id == roadID) {
					var road = roadlist[x];
					if (road.isDrag) {
						road.isDrag = false;
						mapUtil.config.toggleShapes(road.draggers, null, false);
						mapUtil.config
								.toggleShapes(road.pointPlus, null, false);
					} else {
						road.isDrag = true;
						mapUtil.config.toggleShapes(road.draggers, null, true);
						mapUtil.config.toggleShapes(road.pointPlus, null, true);
					}
				} else {
					roadlist[x].isDrag = false;
					mapUtil.config.toggleShapes(roadlist[x].draggers, null,
							false);
					mapUtil.config.toggleShapes(roadlist[x].pointPlus, null,
							false);
				}
			}
		}
		return {

			// 下面的函数可能会重复，是为了外面调用的简单，但是下面调用的内部函数应该尽可能通用
			toggleOneShape : function(shape, flag) {
				toggleOneShape(shape, flag);
			},
			toggleShapes : function(arrays, key, flag) {
				toggleShapes(arrays, key, flag);
			},
			show : function(type, ids) {
				toggleMap(type, 'shape', true, ids);
			},
			removeShow : function(type, ids) {
				toggleMap(type, 'shape', false, ids);
			},
			createRoad : function(roadInfo) {
				return createRoad(roadInfo);
			},
			createBlock : function(blockInfo) {
				return createBlock(blockInfo);
			},

			toggleMap : function(flag) {
				toggleMap('blocks', flag);
				toggleMap('lines', flag);
				toggleMap('points', flag);
				if (!flag) {
					initIntenals();
				}
			},
			createMap : function(mapData) {
				createMap(mapData.blocks, 1);
				createMap(mapData.lines, 2);
				createMap(mapData.sites, 3);
			},
			isPop : function() {
				return flag.isPop;
			},
			setPop : function(target) {
				if (target && mapUtil.utils.isBoolean(target)) {
					togglePopToolUp('popup', blocks, target);
					togglePopToolUp('popup', roads, target);
					togglePopToolUp('popup', sites, target);
					flag.isPop = target;
				}
				return flag.isPop;
			},
			isShowCoords : function() {
				return flag.showClickCoords;
			},
			setShowCoords : function(target) {
				if (mapUtil.utils.isBoolean(target)) {
					if (target) {
						map.on('click', showCoords);
					} else {
						map.off('click');
					}
					flag.showClickCoords = target;
				}
				return flag.showClickCoords;
			},
			getClickCoords : function() {
				var x = map.on('click', getCoords);
				console.log(x);
			},
			bindMapClick : function(fn, btn, decimal_count) {
				bindMapEvent('click', fn, btn, decimal_count);
			},
			unbindMapClick : function() {
				unBindMapEvent('click');
			},
			bindMapManyClick : function(fn, dbfn, btn, decimal_count) {
				bindMapEvent('click', fn, btn, decimal_count);
				bindMapEvent('contextmenu', dbfn, btn, decimal_count);
			},
			unBindMapManyClick : function() {
				unBindMapEvent('click');
				unBindMapEvent('contextmenu');
			},
			getTargetByID : function(id) {
				return getTargetByType('id', id);
			},
			getTargetByName : function(name) {
				return getTargetByType('name', name);
			},
			getBlocks : function() {
				return getTypeList('blocks');
			},
			getRoads : function() {
				return getTypeList('lines');
			},
			getSites : function() {
				return getTypeList('points');
			},
			bindLayerClick : function(fn, btnID) {
				bindSiteEvent(fn, btnID);
			},
			unbindLayerClick : function() {
				unbindSiteEvent();
			},
			setRedSite : function(id) {
				return setIconById(id, "points");
			},
			setRedBlock : function(id) {
				return setIconById(id, "blocks");
			},
			setRedLine : function(id) {
				return setIconById(id, "lines");
			},
			createSingleDragMarkers : function(road) {
				return createSingleLineMarkers(road);
			},
			createLineDraggers : function() {
				return createLineDragMarkers();
			},
			createSingleBlockDragMarkers : function(block) {
				return createSingleBlockMarkers(block);
			},
			createBlockDraggers : function() {
				return createBlockDragMarkers();
			},
			toggleLineDragIcons : function(roadID) {
				return toggleLineDragIcons(roadID);
			},
			toggleBlockDragIcons : function(blockID) {
				return toggleBlockDragIcons(blockID);
			},
			createLinkCircles : function() {
				var lines = getTypeList('lines');
				return createGlueCircles(lines);
			},
			checkLinkCircle : function(circles, pos) {
				return checkGlueCircle(circles, pos);
			},
			addLinkCircles : function() {
				var glues = getTypeList('glues');
				toggleShapes(glues, 'shape', true);
			},
			removeLinkCircles : function() {
				var glues = getTypeList('glues');
				toggleShapes(glues, 'shape', false);
			},
		}
	}();

	mapUtil.task = function() {
		var taskList = [];
		var pathLength = [];
		// 给出起点、终点和正确的中间路径，返回所有关键点集合
		function getKeyPathByPathSites(task) {
			var pathPos = [];// 最短路径上所有路径的坐标点
			var keyPath = [];
			var point;// 用来对比的关键点

			point = mapUtil.config.getTargetByID(task.start).pos;
			for (var i = 0; i < task.path.length; i++) {
				pathPos[pathPos.length] = mapUtil.config
						.getTargetByID(task.path[i]).pos;
			}
			// 有几个路径id，长度就是几，对于每条路径，只算起点，这样才能不重复，最后添加上终点
			for (var i = 0; i < task.path.length; i++) {
				// 对于一条曲线来说，曲线由多个线段组成
				var lastIndex = pathPos[i].length - 1;
				// 如果从起点开始
				if (mapUtil.utils.compareTwoCoords(pathPos[i][0], point)) {
					for (var j = 0; j < pathPos[i].length - 1; j = j + 2) {
						keyPath[keyPath.length] = pathPos[i][j];
					}
					point = pathPos[i][lastIndex];
				} else {// 从终点开始
					for (var j = pathPos[i].length - 1; j > 0; j = j - 2) {
						keyPath[keyPath.length] = pathPos[i][j];
					}
					point = pathPos[i][0];
				}
			}
			keyPath[keyPath.length] = mapUtil.config.getTargetByID(task.end).pos;
			return keyPath;
		}
		function buildPath(task) {
			// console.time("计时器一");
			// console.profile('性能分析器一');
			var leastPath = getLeastPath(task.start, task.end);
			// console.timeEnd("计时器一");
			// console.profileEnd();
			if (leastPath != null) {
				task.path = leastPath;// 最短路径
				task.keyPath = getKeyPathByPathSites(task);// 通过最短路径获取路径上关键点
				task.detailPath = getDetailPath(task);// 通把关键点组合成为交互用的站点名和路径名集合
			}
			return task;
		}
		// 给出一个坐标，返回一个点的id
		function getPointNameByPos(pos) {
			var sites = mapUtil.config.getSites();
			for (var j = 0; j < sites.length; j++) {

				if (mapUtil.utils.compareTwoCoords(sites[j].pos, pos)) {
					return sites[j].id;
				}
			}
			// console.log("没有这个站或者交叉口");
			return null;
		}
		// 给出包含任务正确路径id的task，返回站点名加路径名集合
		function getDetailPath(task) {
			// pathCouple是由起点到终点的站点加路径的号码的组合
			var pathCouple = [];
			var pathPos = [];// 最短路径上所有路径的坐标点
			var pointSite;
			pointSite = mapUtil.config.getTargetByID(task.start).pos;
			for (var i = 0; i < task.path.length; i++) {
				pathPos[pathPos.length] = mapUtil.config
						.getTargetByID(task.path[i]);
				var singPath = pathPos[pathPos.length - 1].pos;
				var Pos1 = singPath[0];
				var Pos2 = singPath[singPath.length - 1];

				if (mapUtil.utils.compareTwoCoords(Pos1, pointSite)) {
					pointSite = Pos2;
					pathCouple[pathCouple.length] = getPointNameByPos(Pos1);
				} else {
					pointSite = Pos1;
					pathCouple[pathCouple.length] = getPointNameByPos(Pos2);
				}
				pathCouple[pathCouple.length] = task.path[i];
			}
			return pathCouple;
		}
		function calcuPathLength() {
			var roads = mapUtil.config.getRoads();
			for (var i = 0; i < roads.length; i++) {
				var dis = 0;
				for (var j = 0; j < roads[i].pos.length - 1; j++) {
					dis += map.distance(roads[i].pos[j], roads[i].pos[j + 1]);
				}
				pathLength[pathLength.length] = {
					road : roads[i],
					distance : dis
				}
			}
		}
		// 给定一个站点，返回站点相连的所有的道路
		// notSitePos--返回道路中两个点中不是site的那个点
		function checkPathAroundPoint(latlng, toCheckPath) {
			var paths = [];
			for (var i = 0; i < toCheckPath.length; i++) {
				var lastIndex = toCheckPath[i].road.pos.length - 1;
				if (mapUtil.utils.compareTwoCoords(latlng,
						toCheckPath[i].road.pos[0])) {
					var path = {
						content : toCheckPath[i],
						notSitePos : toCheckPath[i].road.pos[lastIndex],
						toGO : null
					}
					paths[paths.length] = path;
				} else if (mapUtil.utils.compareTwoCoords(latlng,
						toCheckPath[i].road.pos[lastIndex])) {
					var path = {
						content : toCheckPath[i],
						notSitePos : toCheckPath[i].road.pos[0],
						toGO : null
					}
					paths[paths.length] = path;
				}
			}
			return paths;
		}

		// deepCopy,true---进行深复制，false---进行浅复制
		function splicePathToGo(paths, toGO, deepCopy) {
			if (deepCopy) {
				var newtoGO = toGO.slice(0);
			} else {
				var newtoGO = toGO;
			}

			if (paths instanceof Array) {
				for (var i = 0; i < paths.length; i++) {
					for (var j = 0; j < newtoGO.length; j++) {
						if (paths[i].content.road.id == newtoGO[j].road.id) {
							newtoGO.splice(j, 1);
						}
					}
				}
			} else {
				for (var j = 0; j < newtoGO.length; j++) {
					if (paths.content.road.id == newtoGO[j].road.id) {
						newtoGO.splice(j, 1);
					}
				}
			}
			return newtoGO;
		}
		function checkFinishToGO(paths) {
			for (var i = 0; i < paths.length; i++) {
				for (var j = 0; j < paths[i].length; j++) {
					if (paths[i][j].toGO.length > 0) {
						return true;
					}
				}
			}
			return false;
		}
		function checkIfHasEnd(paths, end, findPath) {
			var unfinish = [];
			for (var i = 0; i < paths.length; i++) {
				var last = paths[i][paths[i].length - 1];
				if (mapUtil.utils.compareTwoCoords(last.notSitePos, end.pos)) {
					// console.log("找到一条路径");
					findPath[findPath.length] = paths[i];
				} else {
					if (last.toGO.length > 0) {// 一条路径走完
						unfinish[unfinish.length] = paths[i];
					}
				}
			}
			return {
				findPath : findPath,
				unfinish : unfinish
			}
		}
		// 给出所有的可到达终点的路径列表信息，找出最短的一条，返回最短路径的id[]
		function findLeastPath(findPath) {
			var leastDistance = 0;
			var leastIndex = 0;
			var tempDistance = 0;
			var ids = [];

			if (findPath && findPath.length > 0) {
				for (var i = 0; i < findPath.length; i++) {
					// console.log("第 "+(i+1)+" 条路径");

					for (var j = 0; j < findPath[i].length; j++) {
						if (i == 0) {
							leastDistance += findPath[i][j].content.distance;
						} else {
							tempDistance += findPath[i][j].content.distance;

						}
						// console.log(findPath[i][j].content.road.id);
						// console.log(findPath[i][j].content.distance);
					}
					if (i != 0 && tempDistance < leastDistance) {
						leastDistance = tempDistance;
						leastIndex = i;
					}
					tempDistance = 0;
				}
				// console.log("最短的路径是：第 "+(leastIndex+1)+" 条路径");
				// console.log("最短的距离是： "+leastDistance+" 米");

				for (var i = 0; i < findPath[leastIndex].length; i++) {
					ids[ids.length] = findPath[leastIndex][i].content.road.id;
				}
				return ids;
			} else {
				// console.log("一条都没有找到");
			}
			return null;
		}
		function getLeastPath(startSite, endSite) {
			if (pathLength.length == 0) {
				calcuPathLength();
			}
			var initPath = [];
			var paths = [];
			var toGO = pathLength.slice(0);
			var tempPath = [];
			var findPath = [];// 找到的所有的路径集合
			// Object {id: "22", name: "河姬", pos: Array[2], shape: e, layer: e…}
			var start = mapUtil.config.getTargetByID(startSite);
			var end = mapUtil.config.getTargetByID(endSite);

			// 初始化数组，一维是若干条可能路线，二维是路线的具体路径

			initPath = checkPathAroundPoint(start.pos, toGO);
			for (var i = 0; i < initPath.length; i++) {
				paths[i] = [];
				paths[i][0] = initPath[i];

				// 这里的toGo是共享的，减了循环次。即初始化时减了起点的若干路径
				paths[i][0].toGO = splicePathToGo(paths[i][0], toGO, false);
			}
			var firstCheck = checkIfHasEnd(paths, end, findPath);
			paths = firstCheck.unfinish;

			while (checkFinishToGO(paths)) {
				// console.log("没找完全部路径");
				tempPath = paths.slice(0);
				paths.splice(0, paths.length);

				for (var i = 0; i < tempPath.length; i++) {
					var dividePath = [];
					var index = tempPath[i].length - 1;
					dividePath = checkPathAroundPoint(
							tempPath[i][index].notSitePos,
							tempPath[i][index].toGO);
					if (dividePath.length > 0) {// 有至少一条继续的路

						var deepCop = true;
						for (var j = 0; j < dividePath.length; j++) {
							// console.log("dividePath.length
							// "+dividePath.length);
							dividePath[j].toGO = splicePathToGo(dividePath[j],
									tempPath[i][index].toGO, deepCop);

							var newPath = tempPath[i].slice(0);
							newPath[newPath.length] = dividePath[j];
							paths[paths.length] = newPath;
						}
					}
				}
				var checkResult = checkIfHasEnd(paths, end, findPath);
				paths = checkResult.unfinish;
				// for(var i=0;i<paths.length;i++){
				// for(var j=0;j<paths[i][1].toGO.length;j++){
				// console.log(paths[i][1].toGO[j].road.id);
				// }
				// console.log("-------");
				// }
			}
			// 从所有找到的路径中找到一条最短的
			return findLeastPath(findPath);
		}
		function checkWithinPath(pos1, pos2, nowPos) {
			var lng = {
				min : null,
				max : null
			};// 经度,0小1大
			var lat = {
				min : null,
				max : null
			};// 纬度

			if (pos1.lng < pos2.lng) {
				lng.min = pos1.lng;
				lng.max = pos2.lng;
			} else {
				lng.min = pos2.lng;
				lng.max = pos1.lng;
			}
			if (pos1.lat < pos2.lat) {
				lat.min = pos1.lat;
				lat.max = pos2.lat;
			} else {
				lat.min = pos2.lat;
				lat.max = pos1.lat;
			}
			if (nowPos.lng <= lng.max && nowPos.lng >= lng.min
					&& nowPos.lat <= lat.max && nowPos.lat >= lat.min) {
				return true;
			} else {
				return false;
			}

		}

		function getNowPath(car) {
			if (pathLength.length == 0) {
				calcuPathLength();
			}
			var currentPos = car.info.pos;

			var minDistance;

			if (checkWithinPath(pathLength[0].road.pos[0],
					pathLength[0].road.pos[1], currentPos)) {
				minDistance = map.distance(nearestPointOnRoad(
						pathLength[0].road.pos[0], pathLength[0].road.pos[1],
						currentPos), currentPos);

			} else {
				minDistance = null;
			}
			var temp = 0;
			var index = 0;
			for (var i = 1; i < pathLength.length - 1; i++) {
				if (checkWithinPath(pathLength[i].road.pos[0],
						pathLength[i].road.pos[1], currentPos)) {
					temp = map.distance(nearestPointOnRoad(
							pathLength[i].road.pos[0],
							pathLength[i].road.pos[1], currentPos), currentPos);
					if (minDistance == null || minDistance > temp) {
						minDistance = temp;
						index = i;
					}
				}
			}
			return pathLength[index].road.id;

		}

		function buildRoute(task, car) {// 画当前位置的路线

			task.keyPath = getKeyPathByPathSites(task);
			task.nowPath = getNowPath(car);
			var currentPos = car.info.pos;
			var underGoPath = mapUtil.config.getTargetByID(task.nowPath).pos;// 经+纬
			task.nowPathPos = nearestPointOnRoad(underGoPath[0],
					underGoPath[1], currentPos);
			var hasGO = [];
			hasGO[0] = task.keyPath[0];// 起点坐标
			for (var i = 0; i < task.path.length; i++) {
				if (task.nowPath != task.path[i]) {
					hasGO[hasGO.length] = task.keyPath[i + 1];
				} else {
					hasGO[hasGO.length] = task.nowPathPos;
					break;
				}
			}
			return hasGO;
		}

		// 给定两个点，求某一点在线上的投影点
		function nearestPointOnRoad(road1, road2, pos) {
			var k = (road2.lat - road1.lat) / (road2.lng - road1.lng);
			var b = road2.lat - k * road2.lng;

			var x = (k * (pos.lat - b) + pos.lng) / (Math.pow(k, 2) + 1);
			var y = k * x + b;
			// [34.27970691937742, 109.0144143263009][y,x]
			return {
				lng : x,
				lat : y
			};
		}
		// 至少要有id，起点，终点,且起点终点不相同
		function addTask(id, start, end, path) {
			var task = {
				id : id,
				start : start,
				end : end,
				path : path,// 路径的点\
				detailPath : null,// 站点号+路径号
				keyPath : null,
				nowPath : null,
				nowPathPos : null,
				pathLine : null,// 起点，终点的路径
				route : null,// 起点到车的当前位置的路径
				car : null
			}
			taskList[taskList.length] = task;
			return task;
		}

		return {
			refreshTasks : function(tasks) {
				for (var i = 0; i < tasks.length; i++) {
					if (mapUtil.utils
							.getArrayIndex(taskList, 'id', tasks[i].id) == null) {
						var task = addTask(tasks[i].id, tasks[i].start,
								tasks[i].end);
						buildPath(task);
					}
				}
				return taskList;
			},
			assignCar : function(task, car) {
				task.car = car;
			},
			getTaskById : function(id) {
				return mapUtil.utils.getArrayIndex(taskList, 'id', id);
			},
			getTaskByCarId : function(carId) {
				for (var i = 0; i < taskList.length; i++) {
					if (taskList[i].car && taskList[i].car.info.id == carId) {
						return taskList[i];
					}
				}
				return null;
			},
			getAllTask : function() {
				return taskList;
			},
			buildPath : function(task) {
				return buildPath(task);
			},
			paintPath : function(task) {
				if (task.keyPath != null) {
					task.pathLine = L.polyline(task.keyPath, mapUtil.resource
							.getMarker("path"));
					mapUtil.config.toggleOneShape(task.pathLine, true);
				}
			},
			clearPath : function(task) {
				mapUtil.config.toggleOneShape(task.pathLine, false);
			},
			clearAllPath : function() {
				mapUtil.config.toggleShapes(taskList, 'pathLine', false);
			},
			paintRoute : function(task, car) {
				task.route = L.polyline(buildRoute(task, car), mapUtil.resource
						.getMarker("route"));
				mapUtil.config.toggleOneShape(task.route, true);
			},
			clearRoute : function(task) {
				mapUtil.config.toggleOneShape(task.route, false);
			},
			clearAllRoute : function() {
				mapUtil.config.toggleShapes(taskList, 'route', false);
			}
		}

	}();

	mapUtil.act = function() {

		var carList = [];
		var choosedCar = null;
		function findCarByName(name) {
			return mapUtil.utils.getArrayWithTwoKeys(carList, 'info', 'id',
					name);
		}
		function getCarIndex(name) {
			return mapUtil.utils.getArrayIndexWithTwoKeys(carList, 'info',
					'id', name);
		}
		function bindCarMarker(target, green) {
			if (null == target) {
				return null;
			}
			var icon;
			if (typeof (green) == "undefined" || green == true) {
				icon = mapUtil.resource.getIcon("carIcon");
			} else {
				icon = mapUtil.resource.getIcon("redCarIcon");
			}
			// marker的图片路径是：（leaflet.css）images/marker-icon.png
			target.marker = L.marker(target.info.pos, {
				icon : icon
			});
			target.marker.bindTooltip(target.info.id, {
				direction : 'top',
				sticky : false
			});
		}
		function bindEvent(fn, btn, taskID) {
			for (var i = 0; i < carList.length; i++) {
				let
				car = carList[i];// 这里面用let，要不然全绑定到最后一个了
				car.marker.on({
					click : function() {
						fn(btn, car, taskID);
					}
				});
			}
		}
		function unbindEvent() {
			for (var i = 0; i < carList.length; i++) {
				mapUtil.config.toggleOneShape(carList[i].marker, false);
				addCar(carList[i], true);
			}
		}

		function addCar(target, green) {
			if (green == null) {
				green = true;
			}
			if (target != null) {
				removeCar(target);
				bindCarMarker(target, green);
				mapUtil.config.toggleOneShape(target.marker, true);
			}
		}
		function removeCar(target) {
			mapUtil.config.toggleOneShape(target.marker, false);
		}
		function showCars() {
			if (null == carList) {
				return null;
			}
			for (var i = 0; i < carList.length; i++) {
				if (carList[i].show == true) {
					addCar(carList[i]);
				} else {
					removeCar(carList[i]);
				}
			}
		}

		function setOne() {
			var num = arguments.length;
			if (null == num || num < 3) {
				return null;
			}
			var target = findCarByName(arguments[0]);
			if (null == target) {
				return null;
			}
			switch (num - 2) {
			case 1:
				target[arguments[1]] = arguments[num - 1];
				return target;
			case 2:
				target[arguments[1]][arguments[2]] = arguments[num - 1];
				return target;
			}
			return null;
		}
		function setAll() {

			var num = arguments.length;
			if (null == num || num < 2) {
				return null;
			}
			switch (num - 1) {
			case 1:
				for (var i = 0; i < carList.length; i++) {
					carList[i][arguments[0]] = arguments[num - 1];
				}
				break;
			case 2:
				for (var i = 0; i < carList.length; i++) {
					carList[i][arguments[0]][arguments[1]] = arguments[num - 1];
				}
				break;
			}
			return null;
		}
		function createUpdateCarPath(car, refresh) {
			if (refresh) {// 进行更新
				var lastPos = car.pathPoints[car.pathPoints.length - 1];
				car.pathMarker[car.pathMarker.length] = L.marker(lastPos, {
					icon : mapUtil.resource.getIcon("pointIcon")
				});
				car.pathMarkerLine.addLatLng(lastPos);
			} else {// 新建轨迹
				var pathMarker = [];
				for (var i = 0; i < car.pathPoints.length; i++) {
					pathMarker[pathMarker.length] = L.marker(car.pathPoints[i],
							{
								icon : mapUtil.resource.getIcon("pointIcon")
							});
				}
				car.pathMarker = pathMarker;
				car.pathMarkerLine = L.polyline(car.pathPoints,
						mapUtil.resource.getMarker("carPath"));
			}
		}
		function removeCarPath(car) {
			if (car.pathMarker) {
				mapUtil.config.toggleShapes(car.pathMarker, null, false);
			}
			if (car.pathMarkerLine != null) {
				mapUtil.config.toggleOneShape(car.pathMarkerLine, false);
			}
		}
		function regisCar(carInfo) {
			var car = {
				info : {
					id : carInfo.id,
					state : parseInt(carInfo.state),
					pos : mapUtil.utils.turnToLatLng(carInfo.pos),
					color : null,
					icon : null
				},
				show : true,// 汽车当前位置是否显示
				marker : null,// 汽车的图标
				showPath : false,// 轨迹是否显示
				pathPoints : [],// 组成轨迹的基本点
				pathMarker : null,// 轨迹的基本点的图标集
				pathMarkerLine : null,// 轨迹的基本点组成的连线
				replayMarker : null,
				replayMarkerLine : null
			};
			carList[carList.length] = car;
			bindCarMarker(car, true);
			return car;
		}
		function toggleReplayPath(carId, pos, change, inteval) {
			var car = findCarByName(carId);

			mapUtil.config.toggleShapes(car.replayMarker, null, false);
			mapUtil.config.toggleOneShape(car.replayMarkerLine, false);

			// change-true，切换为目标路径，false，取消显示
			if (change) {
				var pathMarker = [];
				for (var i = 0; i < pos.length; i++) {
					pos[i] = mapUtil.utils.turnToLatLng(pos[i]);
					pathMarker[pathMarker.length] = L.marker(pos[i], {
						icon : mapUtil.resource.getIcon("pointIcon")
					});
				}
				car.replayMarker = pathMarker;
				car.replayMarkerLine = L.polyline([], mapUtil.resource
						.getMarker("carPath"));
				mapUtil.config.toggleOneShape(car.replayMarkerLine, true);

				if (inteval != null) {
					var count = 0;
					var pathTimer = window.setInterval(function() {
						mapUtil.config.toggleOneShape(car.replayMarker[count],
								true);
						car.replayMarkerLine.addLatLng(pos[count]);
						if (count == pos.length - 1) {
							window.clearInterval(pathTimer);
						}
						count++;
					}, inteval);
				} else {
					mapUtil.config.toggleShapes(car.replayMarker, null, true);
					car.replayMarkerLine = L.polyline(pos, mapUtil.resource
							.getMarker("carPath"));
					mapUtil.config.toggleOneShape(car.replayMarkerLine, true);
				}

			}
		}

		return {
			registCar : function() {
				return regisCar(arguments);
			},
			unRegistCar : function(name) {
				// 先删除图像，再删除数据
				setOne(name, 'show', false);
				showCars();
				carList.splice(getCarIndex(name), 1);
			},
			refreshCars : function(cars) {
				for (var i = 0; i < cars.length; i++) {
					if (findCarByName(cars[i].id) == null) {
						regisCar(cars[i]);
					}
				}
				for (var i = 0; i < carList.length; i++) {
					// 暂时性的初始画的方法
					if (carList[i].pathMarkerLine == null) {
						createUpdateCarPath(carList[i], false);
					}
				}
				return carList;
			},
			getCarByName : function(name) {
				return findCarByName(name);
			},
			getCarList : function() {
				return carList;
			},
			showCar : function(name) {
				setOne(name, 'show', true);
				addCar(findCarByName(name));
			},
			changeCarIcon : function(carName) {
				var car = findCarByName(carName);
				car.marker.setIcon(mapUtil.resource.getIcon('redCarIcon'));
			},
			hideCar : function(name) {
				setOne(name, 'show', false);
				removeCar(findCarByName(name));
			},
			showAllCars : function() {
				showCars();
			},
			hideAllCars : function() {
				setAll('show', false);
				showCars();
			},
			move : function(name, pos) {
				setOne(name, 'info', 'pos', pos);
				var car = findCarByName(name);
				car.marker.setLatLng(L.latLng(pos[0], pos[1]));
			},
			showCarPath : function(car) {
				if (car.showPath == true) {
					mapUtil.config.toggleShapes(car.pathMarker, null, true);
					mapUtil.config.toggleOneShape(car.pathMarkerLine, true);
				}
			},
			toggleShowPath : function(car) {

				if (car.showPath) {
					car.showPath = false;
				} else {
					car.showPath = true;
				}
			},
			refreshCarPath : function(car, newPos, showNew) {
				car.pathPoints[car.pathPoints.length] = newPos;
				createUpdateCarPath(car, true);
				if (showNew) {
					mapUtil.config.toggleOneShape(
							ar.pathMarker[car.pathMarker.length - 1], true);
				}
			},
			clearCarPath : function(car) {
				car.showPath = false;
				removeCarPath(car);
			},
			resetCarPath : function(car) {
				car.pathMarker = null;
				car.pathMarkerLine = null;
				car.pathPoints = [];
				car.showPath = true;
				createUpdateCarPath(car, false);
			},
			clearAllCarPath : function() {
				for (var i = 0; i < carList.length; i++) {
					removeCarPath(carList[i]);
				}
			},
			replayPath : function(carId, pos, change, inteval) {
				toggleReplayPath(carId, pos, change, inteval);
			},
			bindCarClick : function(fn, btn, taskID) {
				bindEvent(fn, btn, taskID);
			},
			unbindCarClick : function() {
				unbindEvent();
			}
		}
	}();

	window.mapUtil = mapUtil;
})(L, map);