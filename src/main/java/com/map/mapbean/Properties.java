package com.map.mapbean;

import org.springframework.stereotype.Component;

@Component
public class Properties {
	
	private String name;
	private String popupContent;
	private String type;
	private boolean underConstruction;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPopupContent() {
		return popupContent;
	}
	public void setPopupContent(String popupContent) {
		this.popupContent = popupContent;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public boolean isUnderConstruction() {
		return underConstruction;
	}
	public void setUnderConstruction(boolean underConstruction) {
		this.underConstruction = underConstruction;
	}
	
	
}
