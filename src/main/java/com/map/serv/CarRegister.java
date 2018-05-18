package com.map.serv;

import java.util.Map;

import com.map.cache.Cache;
import com.map.domain.Car;
import com.map.service.CarService;
import com.map.util.ListUtil;

public class CarRegister implements Runnable{
	
	public static boolean flag=true;

	@Override
	public void run() {
		
		while(flag){
//			System.out.println("每500毫秒遍历一次");
			
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
			
			//真实数据
			Map<String, String> receive = Cache.recive_data;
			//真实数据
			
			
			String id =  receive.get("id");
			
			
			if(id!=null){
				String lng = receive.get("lng");
				String lat = receive.get("lat");
				String status = receive.get("status");
				
				Car car = ListUtil.getTargetById(Cache.carList, id);
				
				if (car == null) {
					// 车没有注册过
					System.out.println("注册一辆新车");
					car = new Car();

					CarService carServ= new CarService();
					car=carServ.regisCar(id, status, new String[] { lat, lng });
				} else {
					car.setPos(new String[] { lat, lng });
					car.setState(status);		
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
