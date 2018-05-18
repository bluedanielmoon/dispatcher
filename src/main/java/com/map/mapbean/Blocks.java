package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class Blocks {
	private String type;
	private Block[] features;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Block[] getFeatures() {
		return features;
	}
	public void setFeatures(Block[] features) {
		this.features = features;
	}
	
	
	
}
