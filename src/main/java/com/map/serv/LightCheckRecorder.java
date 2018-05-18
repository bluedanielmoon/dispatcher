package com.map.serv;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.ExecutorSubscribableChannel;
import org.springframework.stereotype.Controller;

import com.map.cache.Cache;
import com.map.property.MapConfig;
import com.map.service.CarService;

public class LightCheckRecorder implements Runnable{
	public static boolean flag=true;

	public LightCheckRecorder( ) {
	} 
	
	@Override
	public void run() {
		while(flag){
			//模拟红绿灯检测数据开始
			Map<String, Object> lightCheck=new HashMap<>();	
			Random random = new Random();
			lightCheck.put("time",System.currentTimeMillis());
			random.setSeed(System.currentTimeMillis());
			lightCheck.put("result", random.nextBoolean());
			//模拟红绿灯检测数据结束  

			Cache.lightCheck.add(lightCheck);
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		
	}

}
