package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class Road {
	private String id;
	private String type;
	private Threegeometry geometry;
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
	public Threegeometry getGeometry() {
		return geometry;
	}
	public void setGeometry(Threegeometry geometry) {
		this.geometry = geometry;
	}
	public Properties getProperties() {
		return properties;
	}
	public void setProperties(Properties properties) {
		this.properties = properties;
	}
}
