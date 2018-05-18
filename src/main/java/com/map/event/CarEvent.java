package com.map.event;

import org.springframework.context.ApplicationEvent;

import com.map.domain.Car;

public class CarEvent extends ApplicationEvent{
	
	private Car car;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CarEvent(Object source,Car car) {
		super(source);
		this.car=car;
	}
	
	public Car getCar(){
		return car;
		
	}

}
