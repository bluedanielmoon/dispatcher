package com.map.domain;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Car {
	private String id;
	private String state;
	//34+108，维度在前【0】，经度在后【1】
	private String[] pos;
	private List<String[]> path=new ArrayList<String[]>();
	private List<Long> time=new ArrayList<Long>();
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String[] getPos() {
		return pos;
	}
	public void setPos(String[] pos) {
		this.pos = pos;
	}
	public List<String[]> getPath() {
		return path;
	}
	public void setPath(List<String[]> path) {
		this.path = path;
	}
	public List<Long> getTime() {
		return time;
	}
	public void setTime(List<Long> time) {
		this.time = time;
	}
	
	
	public void addPath(String[] path) {
		this.path.add(path);
	}
	public void addTime(Long time) {
		this.time.add(time);
	}
	
	@Override
	public String toString() {
		return "Car [id=" + id + ", state=" + state + ", pos="
				+ Arrays.toString(pos) + ", path=" + path.size() + ", time=" + time.size()
				+ "]";
	}
}
