package com.map.listener;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.map.event.CarEvent;

@Component
public class CarListener{

	@EventListener
	public void onApplicationEvent(CarEvent event) {
		System.out.println(event.getSource());
		System.out.println("有一辆新车注册了:  "+event.getCar().getId());  
		System.out.println("时间是:  "+new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));  
	}

}
