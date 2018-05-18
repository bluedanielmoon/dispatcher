package com.map.domain;

import java.util.Arrays;

import org.springframework.stereotype.Component;

@Component
public class Task {

	private String id;
	private String start;
	private String end;
	private String[] detailPath;
	private Car car;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String[] getDetailPath() {
		return detailPath;
	}
	public void setDetailPath(String[] detailPath) {
		this.detailPath = detailPath;
	}
	public Car getCar() {
		return car;
	}
	public void setCar(Car car) {
		this.car = car;
	}
	@Override
	public String toString() {
		return "Task [id=" + id + ", start=" + start + ", end=" + end
				+ ", detailPath=" + Arrays.toString(detailPath) + ", car="
				+ car + "]";
	}
	
}
