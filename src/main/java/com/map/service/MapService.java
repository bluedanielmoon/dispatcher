package com.map.service;

import java.util.Arrays;

import org.springframework.stereotype.Service;

import com.map.cache.Cache;
import com.map.mapbean.Block;
import com.map.mapbean.MapData;
import com.map.mapbean.Onegeometry;
import com.map.mapbean.Point;
import com.map.mapbean.Road;
import com.map.util.FileUtil;
import com.map.util.GeosonUtil;
import com.map.util.MapUtil;

@Service
public class MapService {

	public boolean changeSiteLocation(String siteId, String lat, String lng) {
		MapData mapdata=Cache.mapdata;
		Point oldPoint=MapUtil.getDataById(mapdata,siteId);
		
		Point newPoint=MapUtil.buildPoint(siteId,
				new double[]{Double.parseDouble(lng),Double.parseDouble(lat)},
				oldPoint.getProperties().getName(),
				oldPoint.getProperties().getPopupContent(),
				oldPoint.getProperties().getType());
		MapUtil.updateDataById(mapdata, siteId, newPoint);
		boolean flag=FileUtil.writeJson(MapUtil.createMap(mapdata));
		if(flag){
			Cache.mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
			return true;
		}
		return false;
	}

	public boolean addSite(String lat, String lng, String name, String descrip, String type) {
		MapData mapdata=Cache.mapdata;
		String siteID=MapUtil.getUniqueID(MapUtil.SITE,type);
		if(siteID==null){
			return false;
		}
		Point newPoint=MapUtil.buildPoint(siteID,
				new double[]{Double.parseDouble(lng),Double.parseDouble(lat)},
				name,descrip,type);
		MapUtil.addDataByType(mapdata, MapUtil.SITE, newPoint);
		boolean flag=FileUtil.writeJson(MapUtil.createMap(mapdata));
		if(flag){
			Cache.mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
			return true;
		}
		return false;
	}

	public boolean deleteSite(String siteId) {
		MapData mapdata=Cache.mapdata;
		MapUtil.deleteDataById(mapdata, siteId);
		
		String editedMap=MapUtil.createMap(mapdata);
		boolean flag=FileUtil.writeJson(editedMap);
		if(flag){
			Cache.mapdata=GeosonUtil.StringToObject(editedMap, MapData.class);
			return true;
		}
		return false;
	}

	public boolean updateRoad(String roadId, String[] pos) {
		MapData mapdata=Cache.mapdata;
		Road oldRoad=MapUtil.getDataById(mapdata,roadId);
		double[][][] ddd=new double[pos.length/4][][];
		int count=0;
		for(int i=0;i<pos.length/4;i++){
			double[][] dd= new double[2][2];
			dd[0][0]=Double.parseDouble(pos[count++]);
			
			dd[0][1]=Double.parseDouble(pos[count++]);
			dd[1][0]=Double.parseDouble(pos[count++]);
			dd[1][1]=Double.parseDouble(pos[count++]);
			ddd[i]=dd;
		}

		Road newRoad=MapUtil.buildLine(roadId,ddd,
				oldRoad.getProperties().getName(),
				oldRoad.getProperties().getPopupContent(),
				oldRoad.getProperties().getType());
		MapUtil.updateDataById(mapdata, roadId, newRoad);
		boolean flag=FileUtil.writeJson(MapUtil.createMap(mapdata));
		if(flag){
			Cache.mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
			return true;
		}
		return false;
	}

	public boolean addRoad(String roadName, String descrip, String[] pos) {
		MapData mapdata=Cache.mapdata;
		String roadID=MapUtil.getUniqueID(MapUtil.POLYLINE,"road");
		if(roadID==null){
			return false;
		}
		
		double[][][] ddd=new double[pos.length/2-1][][];
		int count=0;
		for(int i=0;i<pos.length/2-1;i++){
			double[][] dd= new double[2][2];
			dd[0][0]=Double.parseDouble(pos[count]);
			
			dd[0][1]=Double.parseDouble(pos[count+1]);
			dd[1][0]=Double.parseDouble(pos[count+2]);
			dd[1][1]=Double.parseDouble(pos[count+3]);
			count+=2;
			ddd[i]=dd;
		}

		Road newRoad=MapUtil.buildLine(roadID, ddd, roadName, descrip, "road");
		MapUtil.addDataByType(mapdata, MapUtil.POLYLINE, newRoad);
		boolean flag=FileUtil.writeJson(MapUtil.createMap(mapdata));
		if(flag){
			
			Cache.mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
			return true;
		}
		return false;
	}

	public boolean updateBlock(String blockID, String[][][] data) {
		MapData mapdata=Cache.mapdata;
		Block oldBlock=MapUtil.getDataById(mapdata,blockID);
		
		double[][][][] dddd=new double[1][data.length][][];//参照MapUtil.java里面的初始化
		double[][][] ddd= new double[data.length][][];
		for(int i=0;i<data.length;i++){
			double[][] dd= new double[data[i].length][2];
			for(int j=0;j<data[i].length;j++){	
				dd[j][0]=Double.parseDouble(data[i][j][0]);				
				dd[j][1]=Double.parseDouble(data[i][j][1]);
			}
			ddd[i]=dd;
		}
		dddd[0]=ddd;
		Block newBlock=MapUtil.buildBlock(dddd, blockID, 
				oldBlock.getProperties().getName(),
				oldBlock.getProperties().getPopupContent(), 
				oldBlock.getProperties().getType());
		MapUtil.updateDataById(mapdata, blockID, newBlock);
		boolean flag=FileUtil.writeJson(MapUtil.createMap(mapdata));
		if(flag){
			Cache.mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
			return true;
		}
		return false;
	}
	//目前只能用来添加中间没有掏空的block
	public boolean addBlock(String blockName, String[] pos) {
		MapData mapdata=Cache.mapdata;
		String blockID=MapUtil.getUniqueID(MapUtil.BLOCK,"area");
		if(blockID==null){
			return false;
		}
		double[][][][] dddd=new double[1][1][pos.length/2][2];
		double[][][] ddd= new double[1][pos.length/2][2];
		int count=0;
		for(int i=0;i<pos.length/2;i++){			
			ddd[0][i][0]=Double.parseDouble(pos[count++]);
			ddd[0][i][1]=Double.parseDouble(pos[count++]);			
		}
		dddd[0]=ddd;
		Block newBlock=MapUtil.buildBlock(dddd, blockID, blockName, blockName, "area");
		MapUtil.addDataByType(mapdata, MapUtil.BLOCK, newBlock);
		boolean flag=FileUtil.writeJson(MapUtil.createMap(mapdata));
		if(flag){
			
			Cache.mapdata=GeosonUtil.StringToObject(FileUtil.readSource(), MapData.class);
			return true;
		}
		return false;
	}
}
