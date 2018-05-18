package com.map.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.map.serv.*;
import com.map.cache.Cache;
import com.map.domain.Car;
import com.map.domain.Task;
import com.map.util.ByteUtil;
import com.map.util.ListUtil;

@Service
public class TaskService {

	public Task regisTask(String id, String start, String end,
			String[] detailPath) {
		String[] params = new String[] { id, start, end };
		if (!ListUtil.checkNotNULL(params) || ListUtil.getTargetById(Cache.taskList, id) != null
				|| start.equals(end)) {
			return null;
		}

		Task task = new Task();
		task.setId(id);
		task.setStart(start);
		task.setEnd(end);
		task.setDetailPath(detailPath);
		Cache.taskList.add(task);
		System.out.println("注册了一个任务" + task);
		return task;
	}
	
	public Task startTask(String taskId){
		Task task = null;
		Car car = null;
		try {
			task = ListUtil.getTargetById(Cache.taskList, taskId);
			car = task.getCar();
			car.setState("1");
			System.out.println("准备发送数据");
			// byte orderTomotivate[] ={0x03,0x01};//车辆编号(0x01)，车辆状态（0--停，1--走）
			// byte coordinatesTomotivate[] =
			// {0x03,0x02,0x02,(byte)0xA1,0x04,(byte)0xA4};
			// //车辆编号，站点号有几个，具体站点加路段
			//System.out.println(car.getId());
			//System.out.println(task);
			Map<String, byte[]> send_data = ByteUtil.StringToByte(car.getId(), car.getState(),
					task.getDetailPath());
			ServiceRunner.server.SendData(Integer.parseInt(car.getId()), send_data);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(task);
		return task;
	}

	public Task assignCarToTask(String taskId, String carId) {
		Task task = null;
		Car car = null;
		try {
			task = ListUtil.getTargetById(Cache.taskList, taskId);
			car = ListUtil.getTargetById(Cache.carList, carId);
			task.setCar(car);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(task);
		return task;
	}
	
	public boolean deleteTask(String taskId){
		try {
			return ListUtil.delTargetById(Cache.taskList, taskId);
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
}
