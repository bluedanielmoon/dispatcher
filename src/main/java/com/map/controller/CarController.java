package com.map.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.map.property.*;
import com.map.cache.Cache;
import com.map.domain.Car;
import com.map.service.CarService;

@EnableScheduling
@Controller
@RequestMapping(path = "/car")
public class CarController {
	
	private static Logger logger=LoggerFactory.getLogger(CarController.class);
	
	private CarService carServ=new CarService();
	private MapConfig mapCon;
	
	private int count=0;
	
	@Autowired
    public SimpMessagingTemplate messagingTemplate;
	
	@Autowired
    public CarController(CarService carServ,MapConfig mapCon){
        this.carServ = carServ;
        this.mapCon=mapCon;
    }
	
	//messageMapping==requestMapping,sendto==订阅号
//    @MessageMapping("/welcome")
//    @SendTo("/data/carData")
//    public List<Car> send(String greeting,MessageHeaders  heads) throws Exception {
////    	System.out.println(heads.getReplyChannel());
////    	System.out.println(heads.getId());	   	
////    	heads.keySet();
////    	for(String s:heads.keySet()){
////    		System.out.println(s+"     "+heads.get(s));
////    		
////    	}
////    	System.out.println(heads.size());
////    	logger.info("有一辆车来了");
////		logger.debug("hi");
////		logger.error("ppp");
////		logger.warn("000000");
//    	
//    	//messagingTemplate.convertAndSend("/data/carData",car); 
//    	return Cache.carList;
//    	    	
//    }
	@SendTo("/data/carData")
	@Scheduled(fixedRate = 500)
    public void sendCarData() throws Exception {
    	messagingTemplate.convertAndSend("/data/carData",Cache.carList); 
    }
    
    
	
    
	@Scheduled(fixedRate = 100)
    public void sendCheckLight() throws Exception {
		Map<String, Object> lastest= new HashMap<String, Object>();
		if((lastest=Cache.checkLastLight())!=null){
			messagingTemplate.convertAndSend("/data/lightCheck",lastest); 
		}
    }
	
	@RequestMapping(path = "/push", method = RequestMethod.POST)
	@ResponseBody
	public Car buildCar(HttpServletRequest request) {
		String id = request.getParameter("id");
		String state = request.getParameter("state");
		String[] pos = request.getParameterValues("pos[]");
		
		
		return carServ.regisCar(id, state,pos);
	}

	
	

	@RequestMapping(path = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteCarById(HttpServletRequest request) {
		String carId = request.getParameter("carId");
		
		return carServ.deleteCar(carId);
	}

	@RequestMapping(path = "/get", method = RequestMethod.GET)
	@ResponseBody
	public Car getCarById(HttpServletRequest request) {
		String carId = request.getParameter("carID");

		return carServ.getCar(carId);
	}


	@RequestMapping(path = "/all", method = RequestMethod.GET)
	@ResponseBody
	public List<Car> getCarList(HttpServletRequest request) {
//		System.out.println(mapCon.getFeature());
		return Cache.carList;
	}

	@RequestMapping(path = "/beginRecord", method = RequestMethod.POST)
	@ResponseBody
	public void beginCarRecord(HttpServletRequest request) {
		String carId = request.getParameter("carId");
		carServ.beginRecord(carId);
	}
	
	@RequestMapping(path = "/endRecord", method = RequestMethod.POST)
	@ResponseBody
	public void endCarRecord(HttpServletRequest request) {
		String carId = request.getParameter("carId");
		carServ.endRecord(carId);
	}
	
	@RequestMapping(path = "/allRecords", method = RequestMethod.GET)
	@ResponseBody
	public List<String[]> getCarRecords(HttpServletRequest request) {
		String carId = request.getParameter("carId");
		return carServ.getAllRecords(carId);
	}
	
	@RequestMapping(path = "/getRecord", method = RequestMethod.GET)
	@ResponseBody
	public Car getOneRecord(HttpServletRequest request) {
		String carId = request.getParameter("carId");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		return carServ.getRecord(carId,startTime,endTime);
	}
	
	@RequestMapping(path = "/delRecord", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteOneRecord(HttpServletRequest request) {
		String carId = request.getParameter("carId");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		return carServ.deleteRecord(carId,startTime,endTime);
	}
}
