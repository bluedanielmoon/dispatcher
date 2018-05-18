package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class Block {
	private String id;
	private String type;
	private Fourgeometry geometry;
	private Properties properties;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Fourgeometry getGeometry() {
		return geometry;
	}
	public void setGeometry(Fourgeometry geometry) {
		this.geometry = geometry;
	}
	public Properties getProperties() {
		return properties;
	}
	public void setProperties(Properties properties) {
		this.properties = properties;
	}
	
	
	
}
