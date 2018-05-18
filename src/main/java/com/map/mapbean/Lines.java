package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class Lines {
		
	private String type;
	private Road[] features;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Road[] getFeatures() {
		return features;
	}
	public void setFeatures(Road[] features) {
		this.features = features;
	}
	
	
}
