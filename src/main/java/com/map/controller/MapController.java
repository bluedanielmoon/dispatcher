package com.map.controller;


import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.map.mapbean.MapData;
import com.map.cache.Cache;
import com.map.service.MapService;

@EnableScheduling
@Controller
@RequestMapping(path = "/map")
public class MapController {
	
	private static Logger logger=LoggerFactory.getLogger(MapController.class);
	
	private MapService mapServ;
	@Autowired
    public MapController(){
		mapServ=new MapService();
    }
	
	@RequestMapping(path = "/data", method = RequestMethod.GET)
	@ResponseBody
	public MapData getMap(HttpServletRequest request) {
		
		return Cache.mapdata;
	}
	
	@RequestMapping(path = "/changeSitePos", method = RequestMethod.POST)
	@ResponseBody
	public boolean updateSiteLocation(HttpServletRequest request) {
		String siteId = request.getParameter("siteId");
		String lat = request.getParameter("newPos[lat]");
		String lng = request.getParameter("newPos[lng]");
		return mapServ.changeSiteLocation(siteId,lat,lng);
	}
	
	@RequestMapping(path = "/addSite", method = RequestMethod.POST)
	@ResponseBody
	public boolean addSite(HttpServletRequest request) {
		String lat = request.getParameter("lat");
		String lng = request.getParameter("lng");
		String name = request.getParameter("name");
		String descrip = request.getParameter("descrip");
		String type = request.getParameter("type");
		return mapServ.addSite(lat,lng,name,descrip,type);
	}
	
	@RequestMapping(path = "/deleteSite", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteSiteById(HttpServletRequest request) {
		String siteId = request.getParameter("siteId");
		return mapServ.deleteSite(siteId);
	}
	
	@RequestMapping(path = "/changeRoad", method = RequestMethod.POST)
	@ResponseBody
	public boolean updateRoadById(HttpServletRequest request) {
		String roadId = request.getParameter("roadId");
		String[] pos = request.getParameterValues("newPos[]");
		return mapServ.updateRoad(roadId,pos);
	}
	
	@RequestMapping(path = "/addRoad", method = RequestMethod.POST)
	@ResponseBody
	public boolean addRoad(HttpServletRequest request) {
		String roadName = request.getParameter("roadName");
		String descrip = request.getParameter("descrip");
		String[] pos = request.getParameterValues("newPos[]");
		return mapServ.addRoad(roadName,descrip,pos);
	}
	
	@RequestMapping(path = "/changeBlock", method = RequestMethod.POST)
	@ResponseBody
	public boolean updateBlockById(HttpServletRequest request) {
		String blockID = request.getParameter("blockId");
		
		int outerCount=Integer.parseInt(request.getParameter("outerCount"));	
		String[] s_innerCount=request.getParameterValues("innerCount[]");
		if(s_innerCount.length==0){
			return false;
		}
		int[] innerCount=new int[outerCount];
		for(int i=0;i<outerCount;i++){
			innerCount[i]=Integer.parseInt(s_innerCount[i]);
		}
		String[][][] data=new String[outerCount][][];
		for(int i =0;i<outerCount;i++){
			String[][] item=new String[innerCount[i]][2];
			for(int j=0;j<innerCount[i];j++){
				item[j]=request.getParameterValues("newCoords["+i+"]["+j+"][]");
			}
			data[i]=item;
		}
		return mapServ.updateBlock(blockID,data);
	}
	
	@RequestMapping(path = "/addBlock", method = RequestMethod.POST)
	@ResponseBody
	public boolean addBlock(HttpServletRequest request) {
		String blockName = request.getParameter("blockName");
		String[] pos = request.getParameterValues("newPos[]");
		return mapServ.addBlock(blockName,pos);
	}
}
