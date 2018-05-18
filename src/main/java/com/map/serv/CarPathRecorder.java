package com.map.serv;

import java.util.HashMap;
import java.util.Map;

import com.map.cache.Cache;
import com.map.domain.Car;
import com.map.util.ListUtil;

public class CarPathRecorder implements Runnable{

	public static boolean flag=true;
	private String carID;
	
	public CarPathRecorder(String carID) {
		this.carID=carID;
	} 

	@Override
	public void run() {
		
		while(flag){
			//模拟数据开始
//			Map<String, String> receive=new HashMap<String, String>();
//			
//			Random random = new Random();
//			String fakelng = new Float(Float.parseFloat("108.99571")
//					- random.nextFloat() / 1000).toString();
//			String fakelat = new Float(Float.parseFloat("34.22614")
//					- random.nextFloat() / 1000).toString();
//			
//			receive.put("id", "1");
//			receive.put("lng", fakelng);
//			receive.put("lat", fakelat);
//			receive.put("status", "1");
//			receive.put("time", String.valueOf(System.currentTimeMillis()));
			//模拟数据结束
			
			Map<String, String> receive = Cache.recive_data;
			String lng = receive.get("lng");
			String lat = receive.get("lat");
			String time = receive.get("time");
			
			Car car = ListUtil.getTargetById(Cache.carList, carID);
		
			if(car!=null){
				if(car.getPath().size()==0){
					car.addPath(new String[] { lng, lat });
					car.addTime(Long.valueOf(time));
				}else{
					Map<String, String> carData = new HashMap<>();
				
					carData.put("lat", car.getPath().get(car.getPath().size()-1)[1]);
					carData.put("lng", car.getPath().get(car.getPath().size()-1)[0]);
					carData.put("status", car.getState());
					if (!ListUtil.compareTwoMap(carData, receive, new String[] { "lng",
							"lat", "status" })) {					
						car.addPath(new String[] { lng, lat });
						car.addTime(Long.valueOf(time));
					}
				}	
			}
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
}
