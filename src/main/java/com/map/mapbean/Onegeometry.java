package com.map.mapbean;

import java.util.Arrays;

import org.springframework.stereotype.Component;

@Component
public class Onegeometry {
	
	private String type;
	private double[] coordinates;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public double[] getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(double[] coordinates) {
		this.coordinates = coordinates;
	}
	@Override
	public String toString() {
		return "Onegeometry [type=" + type + ", coordinates="
				+ Arrays.toString(coordinates) + "]";
	}
	
	
}
