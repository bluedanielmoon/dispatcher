package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class Sites {
	
	private String type;
	private Point[] features;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Point[] getFeatures() {
		return features;
	}
	public void setFeatures(Point[] features) {
		this.features = features;
	}
	
	
}
