package com.map.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.map.serv.*;
import com.map.cache.Cache;
import com.map.domain.Car;
import com.map.domain.Task;
import com.map.event.CarEvent;
import com.map.util.FileUtil;
import com.map.util.GeosonUtil;
import com.map.util.ListUtil;

@Service
public class CarService {
	
	@Autowired
    private ApplicationContext applicationContext;
	
	public boolean deleteCar(String carId){
		try {
			return ListUtil.delTargetById(Cache.carList, carId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	public Task getTask(String taskId){
		Task task = null;
		try {
			task = ListUtil.getTargetById(Cache.taskList, taskId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return task;
	}

	public Car regisCar(String id, String state, String[] pos) {
		String[] params = new String[] { id, state };
		if (!ListUtil.checkNotNULL(params) || !ListUtil.checkNotNULL(pos)
				|| ListUtil.getTargetById(Cache.carList, id) != null) {
			return null;
		}

		Car car = new Car();
		car.setId(id);
		car.setState(state);
		car.setPos(pos);
		Cache.carList.add(car);
		System.out.println("添加了辆车");
//		applicationContext.publishEvent(new CarEvent(this,car));
		return car;
	}

	public Car getCar(String carId) {
		Car car = null;
		try {
			car = ListUtil.getTargetById(Cache.carList, carId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return car;
	}

	public void beginRecord(String carId) {
		System.out.println("启动开始记录车辆  "+carId+"轨迹的线程");
		CarPathRecorder.flag=true;
		new Thread(new CarPathRecorder(carId)).start();
		
	}

	public void endRecord(String carId) {
		System.out.println("关闭记录车辆  "+carId+"轨迹的线程");
		CarPathRecorder.flag=false;
		
		Car car = ListUtil.getTargetById(Cache.carList, carId);
		FileUtil.writeOdbjectToFile(car);
		car.getPath().clear();
		car.getTime().clear();
	}

	public List<String[]> getAllRecords(String carId) {
		return FileUtil.listFiles(carId);
	}

	public Car getRecord(String carId, String startTime, String endTime) {
		String result=FileUtil.readOdbjectFromFile(carId, startTime, endTime);
		
		return GeosonUtil.StringToObject(result, Car.class);
	}

	public boolean deleteRecord(String carId, String startTime, String endTime) {
		return FileUtil.deleteFile(carId, startTime, endTime);
	}
	
}
