package com.map.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.map.domain.Car;
import com.map.domain.Task;
import com.map.mapbean.MapData;
import com.map.util.FileUtil;
import com.map.util.GeosonUtil;

public class Cache {
	
	public static String jvmID=new String();
	public static List<Car> carList = new ArrayList<Car>();
	public static List<Task> taskList = new ArrayList<Task>();
	public static List<Map<String, String>> lastSendData = new ArrayList<Map<String, String>>();
	public static MapData mapdata;
	public static Map<String, String> recive_data = new HashMap<>();
	
	public static List<Map<String, Object>> lightCheck=new ArrayList<Map<String,Object>>();
	public static int lightHasSend=0;
	
	public static Map<String, Object> checkLastLight(){
		
		if(lightHasSend<lightCheck.size()){
			lightHasSend=lightCheck.size();
			return lightCheck.get(lightCheck.size()-1);
		}
		return null;
		
	}
																												
	static {
		System.out.println("初始化若干实例");

		Car car1=new Car();
		car1.setId("1");
		car1.setState("1");
		car1.setPos(new String[]{"34.22609","108.99615"});
		
		Car car2=new Car();
		car2.setId("2");
		car2.setState("1");
		car2.setPos(new String[]{"34.22617","108.99764"});
		
		//下面的car对应于机器人
//		Car car1=new Car();
//		car1.setId("1");
//		car1.setState("1");
//		car1.setPos(new String[]{"34.22649","108.99508"});
//		
//		Car car2=new Car();
//		car2.setId("2");
//		car2.setState("1");
//		car2.setPos(new String[]{"34.22603","108.99505"});
//		
//		Car car3=new Car();
//		car3.setId("3");
//		car3.setState("1");
//		car3.setPos(new String[]{"34.22645","108.99714"});
//		
//		Car car4=new Car();
//		car4.setId("4");
//		car4.setState("1");
//		car4.setPos(new String[]{"34.22648","108.99914"});
		
		carList.add(car1);
		carList.add(car2);
//		carList.add(car3);
//		carList.add(car4);
		
		Task task1=new Task();
		task1.setId("001");
		task1.setStart("37");
		task1.setEnd("20");
		
		Task task2=new Task();
		task2.setId("002");
		task2.setStart("41");
		task2.setEnd("37");
		
		
//		Task task3=new Task();
//		task3.setId("003");
//		task3.setStart("21");
//		task3.setEnd("36");
		
		Task task3=new Task();
		task3.setId("003");
		task3.setStart("20");
		task3.setEnd("32");
		task3.setDetailPath(new String[]{"20","15","31","112","32","110"});
		
		taskList.add(task1);
		taskList.add(task2);
		taskList.add(task3);
	

		mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
	}
}
