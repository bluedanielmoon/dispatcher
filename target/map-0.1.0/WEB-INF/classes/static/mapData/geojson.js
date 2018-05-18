var campus = {
    "type": "Feature",
    "properties": {
        "popupContent": "这是矿区"
    },
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[[
                    [108.98609161376953, 34.27892149117007],
                    [108.9862632751465,  34.25083153959874],
                    [108.94369125366212, 34.24160804557394],
                    [108.91176223754883, 34.24799364909965],
                    [108.91725540161134, 34.27821226443234],
                    [108.94678115844728, 34.28856638069899]
                ],[
                    [108.9507293701172, 34.27721933694677],
                    [108.93218994140626, 34.27601362351852],
                    [108.9320182800293, 34.27111966795463],
                    [108.94995689392091, 34.270268516168784]
                ]
            ],[
                [
                    [108.99278640747072, 34.3248666239841],
                    [108.96600723266603, 34.30969616544571],
                    [108.98162841796876, 34.29296294830097],
                    [109.02402877807619, 34.30416606421712]
                ]
            ]
        ]
    },
    "id": 0
};
var roads = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [108.93218994140626, 34.24969639488352],
                    [108.96738052368165, 34.264310212432044]
                ]
            },  
            "properties": {
                "name": "衡山路",
                "popupContent": "这是路 001",
                "underConstruction": false
            },
            "id": '10'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [108.96738052368165, 34.264310212432044],
                    [109.0192222595215, 34.25920275895473]
                ]
            },
            "properties": {
                "name": "泰山路",
                "popupContent": "这是路 002",
                "underConstruction": false
            },
            "id": '11'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [109.0192222595215, 34.25920275895473],
                    [109.0085792541504, 34.30459146954932]
                ]
            },  
            "properties": {
                "name": "萧山路",
                "popupContent": "这是路 003",
                "underConstruction": false
            },
            "id": '12'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [109.0085792541504, 34.30459146954932],
                    [108.93476486206056, 34.296082953480635]
                ]
            },  
            "properties": {
                "name": "云梦路",
                "popupContent": "这是路 004",
                "underConstruction": false
            },
            "id": '13'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [108.93476486206056, 34.296082953480635],
                    [108.96738052368165, 34.264310212432044]
                ]
            },  
            "properties": {
                "name": "萧何路",
                "popupContent": "这是路 005",
                "underConstruction": false
            },
            "id": '14'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [108.96738052368165, 34.264310212432044],
                    [109.0085792541504,  34.30459146954932]
                ]
            },  
            "properties": {
                "name": "落雨路",
                "popupContent": "这是路 006",
                "underConstruction": false
            },
            "id": '15'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [108.93218994140626, 34.24969639488352],
                    [109.0192222595215, 34.25920275895473]
                ]
            },  
            "properties": {
                "name": "繁华路",
                "popupContent": "这是路 007",
                "underConstruction": false
            },
            "id": '16'
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [108.93218994140626, 34.24969639488352],
                    [108.93476486206056, 34.296082953480635]
                ]
            },  
            "properties": {
                "name": "繁华路",
                "popupContent": "这是路 008",
                "underConstruction": false
            },
            "id": '17'
        }
    ]
};

var sites = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "兰亭",
                "popupContent": "站点A"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [108.93218994140626, 34.24969639488352]
            },
            "id": '20'
        },{
            "type": "Feature",
            "properties": {
                "name": "玉露",
                "popupContent": "站点B"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [108.93476486206056, 34.296082953480635]
            },
            "id": '21'
        },{
            "type": "Feature",
            "properties": {
                "name": "河姬",
                "popupContent": "站点C"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [109.0085792541504,  34.30459146954932]
            },
            "id": '22'
        }
    ]
};

var middle = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "交叉口1",
                "popupContent": "交叉口1"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [108.96738052368165, 34.264310212432044]
            },
            "id": '30'
        },{
            "type": "Feature",
            "properties": {
                "name": "交叉口2",
                "popupContent": "交叉口2"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [109.0192222595215, 34.25920275895473]
            },
            "id": '31'
        }
    ]
};
