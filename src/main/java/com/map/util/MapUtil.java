package com.map.util;


import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.map.cache.Cache;
import com.map.mapbean.*;

/**
 * 用来处理map数据的修改
 * @author daniel
 * @since 2018.02.07
 */  
public class MapUtil {
	public static String FEATURE="Feature";
	public static String FEATURECOLLECTION="FeatureCollection";
	public static String FEATURES="features";
	
	public static String MULTILINESTRING="MultiLineString";
	public static String POINT="Point";
	public static String MULTIPOLYGON="MultiPolygon";
	
	public static String BASEPATH="src/main/resources/static/mapData/";
	public static String ID="id";
	public static String fileName="jsonNew.json";
	
	public static int BLOCK=1;
	public static int POLYLINE=2;
	public static int SITE=3;
	
	public static String HOUSE="house";
	public static String MINE="mine";
	public static String COMMUTE="commute";
	public static String TRANSFER="transfer";
	
	/**
	 * 给定一个map对象，返回转换的json数据
	 * @param map
	 * @return
	 */
	public static String createMap(MapData map){
		ObjectMapper mp= new ObjectMapper();
		
		String result=null;
		try {
			result=mp.writeValueAsString(map);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return result;
	}
	/**
	 * 把两个普通pojo类每个属性，由source复制给target
	 * @param source
	 * @param target
	 */
	public static <T> void deepCopy(T source,T target) {
		Method[] methods=source.getClass().getMethods();
		
		for(Method setMethod:methods){
			if(setMethod.getName().startsWith("set")){
				String setitem=setMethod.getName().substring(3,setMethod.getName().length());
				for(Method getMethod:methods){
					if(getMethod.getName().startsWith("get")&&
							getMethod.getName().substring(3,getMethod.getName().length()).equals(setitem)){
						try {
							Object item=getMethod.invoke(source);
							setMethod.invoke(target, item);
						} catch (IllegalAccessException
								| IllegalArgumentException
								| InvocationTargetException e) {
							e.printStackTrace();
						}
					}
				}	
			}
		}
	}
	/**
	 * 根据id更新某一对象
	 * @param map
	 * @param id
	 * @param target
	 * @return
	 */
	public static <T> MapData updateDataById(MapData map,String id,T target){
		Object obj=getDataById(map,id);
		deepCopy(target,obj);
		return map;
	}
	
	/**
	 * 给定一个Point的点，通过将其与缓存中mapdata数据进行比较
	 * 返回点和mapdata中的路线的端点有交集的路线的集合
	 * @param point
	 * @return
	 */
	public static List<Road> getPointLinkedLines(Point point){
		
		MapData map=Cache.mapdata;
		double[] pointCoords=point.getGeometry().getCoordinates();		
		List<Road> result=new ArrayList<>();
		
		for(Road road:map.getLines().getFeatures()){
			double[][][] multi=road.getGeometry().getCoordinates();
			for(int i=0;i<multi.length;i++){			
				for(int j=0;j<multi[i].length;j++){
					if(compareCoords(pointCoords,multi[i][j],1)){
						result.add(road);
					}					
				}
			}			
		}
		return result;
	}
	
	/**
	 *  给定一个Road的线，通过将其与缓存中mapdata数据进行比较
	 * 返回点和mapdata中的点有交集的点的集合
	 * @param road
	 * @return
	 */
	public static List<Point> getLineLinkedPoints(Road road){
		
		MapData map=Cache.mapdata;
		double[][][] pointCoords=road.getGeometry().getCoordinates();		
		List<Point> result=new ArrayList<>();
		for(Point point:map.getSites().getFeatures()){
			for(int i=0;i<pointCoords.length;i++){			
				for(int j=0;j<pointCoords[i].length;j++){
					if(compareCoords(point.getGeometry().getCoordinates(),pointCoords[i][j],1)){
						result.add(point);
					}					
				}
			}
		}
		return result;
	}
	
	/**
	 * 返回map中id为某值得对象，如果没找到返回null
	 * @param map
	 * @param id
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getDataById(MapData map,String id){
		Blocks blocks=map.getBlocks();
		for(Block b:blocks.getFeatures()){
			if(b.getId().equals(id)){
				return (T)b;
			}
		}
		Lines lines=map.getLines();
		for(Road l:lines.getFeatures()){
			if(l.getId().equals(id)){
				return (T) l;
			}
		}
		Sites sites=map.getSites();
		for(Point p:sites.getFeatures()){
			if(p.getId().equals(id)){
				return (T) p;
			}
		}	
		return null;
	}
	/**
	 * 给定id和map，返回那种data的类型
	 * 1-block,2-polyline,3-site
	 * @param map
	 * @param id
	 * @return
	 */
	public static int getDataTypeById(MapData map,String id){
		
		Blocks blocks=map.getBlocks();
		for(Block b:blocks.getFeatures()){
			if(b.getId().equals(id)){
				return BLOCK;
			}
		}
		
		Lines lines=map.getLines();
		for(Road l:lines.getFeatures()){
			if(l.getId().equals(id)){
				return POLYLINE;
			}
		}
		Sites sites=map.getSites();
		for(Point l:sites.getFeatures()){
			if(l.getId().equals(id)){
				return SITE;
			}
		}
		return 0;
	}
	
	public static <T> MapData deleteDataById(MapData map,String id){
		int type=getDataTypeById(map, id);

		if(type==BLOCK){
			Blocks blocks=map.getBlocks();
			Blocks newblocks=new Blocks();
			
			Block[] areas=blocks.getFeatures();
			Block[] newareas=new Block[areas.length-1];
			
			int count=0;
			for(int i=0;i<areas.length;i++){
				if(!areas[i].getId().equals(id)){
					newareas[count]=new Block();
					deepCopy(areas[i], newareas[count]);
					count++;
				}
			}
			newblocks.setType(blocks.getType());
			newblocks.setFeatures(newareas);
			
			map.setBlocks(newblocks);
		}else if(type==POLYLINE){
			Lines lines=map.getLines();
			Lines newlines=new Lines();
			Road[] roads=lines.getFeatures();
			Road[] newroads=new Road[roads.length-1];
			int count=0;
			for(int i=0;i<roads.length;i++){
				if(!roads[i].getId().equals(id)){
					newroads[count]=new Road();
					deepCopy(roads[i], newroads[count]);
					count++;
				}
			}
			newlines.setType(lines.getType());
			newlines.setFeatures(newroads);
			
			map.setLines(newlines);
		}else if(type==SITE){	
			Sites sites=map.getSites();
			Sites newSites=new Sites();
			Point[] sitelist=sites.getFeatures();
			Point[] newlist=new Point[sitelist.length-1];
			int count=0;
			for(int i=0;i<sitelist.length;i++){
				if(!sitelist[i].getId().equals(id)){
					newlist[count]=new Point();
					deepCopy(sitelist[i], newlist[count]);
					count++;
				}
			}
			newSites.setType(sites.getType());
			newSites.setFeatures(newlist);
			map.setSites(newSites);
		}
		return null;
	}
	/**
	 * 向map添加各种类型的数据
	 * degree:1-block,2-polyline,3-site
	 * @param map 基础的向其中添加的Map数据
	 * @param degree 添加的类型
	 * @param target 将要添加的目标
	 * @return 已经添加数据的map
	 */
	public static <T> MapData addDataByType(MapData map,int degree,T target){
		int DoubleType=0;
		Class<?> geoType=null;
		String getTypes=null;
		String setTypes=null;
		if(degree==BLOCK){
			getTypes="getBlocks";
			setTypes="setBlocks";
			geoType=Fourgeometry.class;
			DoubleType=4;
		}else if(degree==POLYLINE){
			getTypes="getLines";
			setTypes="setLines";
			geoType=Threegeometry.class;
			DoubleType=3;
		}else if(degree==SITE){
			getTypes="getSites";
			setTypes="setSites";
			geoType=Onegeometry.class;
			DoubleType=1;
		}
		return addData(map,getTypes,setTypes,geoType,DoubleType,target);
	}
	
	@SuppressWarnings("unchecked")
	private static <T, I> MapData addData(MapData map,String getTypes,String setTypes,Class<I> geoType,int DoubleType,T target){
		
		Method method = null;
		try {		
			method=map.getClass().getMethod(getTypes);
			Object objects=method.invoke(map);

			method=objects.getClass().getMethod("getFeatures");
			T[] arrs=(T[]) method.invoke(objects);
			
			Method idMethod=target.getClass().getMethod("getId");
			Method geoMethod=target.getClass().getMethod("getGeometry");
			Method coordMethod=geoType.getMethod("getCoordinates");
			
			for(int i=0;i<arrs.length;i++){
				//如果要插入的线的id或者坐标与某一id全相等,不要添加
				if(idMethod.invoke(arrs[i]).equals(idMethod.invoke(target))||
						compareCoords(coordMethod.invoke(geoMethod.invoke(arrs[i])),
								coordMethod.invoke(geoMethod.invoke(target)),DoubleType)){
					return map;
				}
			}
			T[] addArrs= Arrays.copyOf(arrs, arrs.length+1);
			addArrs[addArrs.length-1]=target;
			
			
			method=objects.getClass().getMethod("setFeatures",addArrs.getClass());
			method.invoke(objects,(Object)addArrs);
			
			method=map.getClass().getMethod(setTypes,objects.getClass());
			method.invoke(map,objects);
			
			return map;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 给一个代表区域，线或点的类型，和一个其之下的小的类型，返回一个唯一的id
	 * 例如：给定（3，MINE）,即要求返回一个mine类型的点的唯一id
	 * @param bidtype 代表区域，线或点的类型
	 * @param smalltype bidtype之下的小的类型,properties里面的type
	 * @return
	 */
	public static String getUniqueID(int bidtype,String smalltype){
		MapData map=Cache.mapdata;
		Sites sites=map.getSites();
		int tryNumber=0;
		int singleID=0;
		String result="";
		Set<Integer> idList=new TreeSet<Integer>();
		if(bidtype==BLOCK){
			Blocks blocks=map.getBlocks();
			for(Block b:blocks.getFeatures()){
				if(smalltype.equals(b.getProperties().getType())){
					result=b.getId().substring(0, 1);
					singleID=Integer.parseInt(b.getId().substring(1));
					idList.add(singleID);					
				}			
			}
		}else if(bidtype==POLYLINE){
			Lines lines=map.getLines();
			for(Road r:lines.getFeatures()){
				if(smalltype.equals(r.getProperties().getType())){
					result=r.getId().substring(0, 1);
					singleID=Integer.parseInt(r.getId().substring(1));
					idList.add(singleID);					
				}			
			}
		}else{
			for(Point p:sites.getFeatures()){
				if(smalltype.equals(p.getProperties().getType())){
					result=p.getId().substring(0, 1);
					singleID=Integer.parseInt(p.getId().substring(1));
					idList.add(singleID);					
				}			
			}			
		}
		for(Integer i:idList){
			if(tryNumber!=i){
				break;
			}
			tryNumber++;
		}
		result=result+Integer.toString(tryNumber);
		return result;	
	}
	
	/**
	 * 比较两个Double多维数组，支持到4维
	 * @param ob1
	 * @param ob2 
	 * @param degree 维度
	 * @return 如果所有数字相等，返回true
	 */
	private static boolean compareCoords(Object ob1,Object ob2,int degree){
		if(degree==1){
			double[] f1=(double[]) ob1;
			double[] f2=(double[]) ob2;
			int count=0;
			for(int i=0;i<f1.length;i++){
				if(f1.length!=f2.length){
					return false;//若比较
				}
				if(Double.compare(f1[i],f2[i])==0){
					count++;
				}
			}
			if(count==f1.length){
				return true;
			}
			return false;
		}
		if(degree==2){
			double[][] f1=(double[][]) ob1;
			double[][] f2=(double[][]) ob2;
			int count=0;
			for(int i=0;i<f1.length;i++){
				if(f1.length!=f2.length){
					return false;//若比较
				}
				for(int j=0;j<f1[i].length;j++){
					if(f1[i].length!=f2[i].length){
						return false;//若比较
					}
					if(Double.compare(f1[i][j],f2[i][j])==0){
						count++;
					}
				}
			}
			if(count==(f1.length*f1[0].length)){
				return true;
			}
			return false;
		}
		if(degree==3){
			double[][][] f1=(double[][][]) ob1;
			double[][][] f2=(double[][][]) ob2;
			int count=0;
			for(int i=0;i<f1.length;i++){
				if(f1.length!=f2.length){
					return false;//若比较
				}
				for(int j=0;j<f1[i].length;j++){
					if(f1[i].length!=f2[i].length){
						return false;//若比较
					}
					for(int k=0;k<f1[i][j].length;k++){
						if(f1[i][j].length!=f2[i][j].length){
							return false;//若比较
						}
						if(Double.compare(f1[i][j][k],f2[i][j][k])==0){
							count++;
						}
					}
				}
			}
			if(count==(f1.length*f1[0].length*f1[0][0].length)){
				return true;
			}
			return false;
		}
		if(degree==4){
			double[][][][] f1=(double[][][][]) ob1;
			double[][][][] f2=(double[][][][]) ob2;
			int count=0;
			for(int i=0;i<f1.length;i++){
				if(f1.length!=f2.length){
					return false;//若比较
				}
				for(int j=0;j<f1[i].length;j++){
					if(f1[i].length!=f2[i].length){
						return false;//若比较
					}
					for(int k=0;k<f1[i][j].length;k++){
						if(f1[i][j].length!=f2[i][j].length){
							return false;//若比较
						}
						for(int l=0;l<f1[i][j][k].length;l++){
							if(f1[i][j][k].length!=f2[i][j][k].length){
								return false;//若比较
							}
							if(Double.compare(f1[i][j][k][l],f2[i][j][k][l])==0){
								count++;
							}
						}
					}
				}
			}
			if(count==(f1.length*f1[0].length*f1[0][0].length*f1[0][0][0].length)){
				return true;
			}
			return false;
		}
		return false;
	}
	
	public static MapData buildMapBean(Block[] blocks,Road[] roads,Point[] sites){
		
		MapData map= new MapData();
		map.setBlocks(buildBlocks(blocks));
		map.setLines(buildRoads(roads));
		map.setSites(buildSites(sites));
		return map;
	}
	
	public static Block buildBlock(double[][][][] ffff,String id,String name,String pop,String type){
		Block block= new Block();
		block.setId(id);
		
		Fourgeometry four= new Fourgeometry();
		four.setType(MULTIPOLYGON);
		four.setCoordinates(ffff);
		block.setGeometry(four);
		
		Properties prop= new Properties();
		prop.setName(name);
		prop.setPopupContent(pop);
		prop.setType(type);
		block.setProperties(prop);
		
		block.setType(FEATURE);
		return block;
	}
	
	public static Blocks buildBlocks(Block[] blocklist){
		Blocks blocks= new Blocks();
		blocks.setType(FEATURECOLLECTION);
		blocks.setFeatures(blocklist);
		return blocks;
	}
	
	public static Lines buildRoads(Road[] roadlist){
		Lines roads= new Lines();
		roads.setType(FEATURECOLLECTION);
		roads.setFeatures(roadlist);
		return roads;
	}
	
	public static Sites buildSites(Point[] pointList){
		Sites sites= new Sites();
		sites.setType(FEATURECOLLECTION);
		sites.setFeatures(pointList);	
		return sites;
	}
	
	public static Point buildPoint(String roadId,double[] f,String name,String pop,String type){
		Point point= new Point();
		point.setId(roadId);
		
		Onegeometry one= new Onegeometry();
		one.setType(POINT);
		one.setCoordinates(f);
		point.setGeometry(one);
		
		Properties prop= new Properties();
		prop.setName(name);
		prop.setPopupContent(pop);
		prop.setType(type);
		point.setProperties(prop);
		
		point.setType(FEATURE);
		return point;
	}
	public static Road buildLine(String roadId,double[][][] ff,String name,String pop,String type){
		Road road= new Road();
		road.setId(roadId);
		
		Threegeometry three= new Threegeometry();
		three.setType(MULTILINESTRING);
		three.setCoordinates(ff);
		road.setGeometry(three);
		
		Properties prop= new Properties();
		prop.setName(name);
		prop.setPopupContent(pop);
		prop.setType(type);
		prop.setUnderConstruction(false);
		road.setProperties(prop);
		
		road.setType(FEATURE);
		return road;
		
	} 
	public static MapData initMap2(){
		Block block1=buildBlock(new double[][][][]{
				{
					{
						{108.99467,34.22715},{108.99567,34.22715},
						{108.99567,34.22633},{108.99467,34.22633}
					}
				}
		},"01","候车1厅","","area");
		Block block2=buildBlock(new double[][][][]{
				{
					{
						{108.99667,34.22715},{108.99767,34.22715},
						{108.99767,34.22633},{108.99667,34.22633}
					}
				}
		},"02","候车2厅","","area");
		Block block3=buildBlock(new double[][][][]{
				{
					{
						{108.99867,34.22715},{108.99967,34.22715},
						{108.99967,34.22633},{108.99867,34.22633}
					}
				}
		},"03","候车3厅","","area");
		Block block4=buildBlock(new double[][][][]{
				{
					{
						{108.99467,34.22614},{108.99967,34.22614},
						{108.99967,34.22552},{108.99467,34.22552}
					}
				}
		},"04","长廊","","area");
		Block[] blocks=new Block[]{block1,block2,block3,block4};
		Road[] roads=new Road[]{};
		Point[] sites=new Point[]{};
		
		return buildMapBean(blocks,roads,sites);
	}
	public static MapData initMap(){
		Block block1=buildBlock(new double[][][][]{
				{
					{
						{108.99504,34.22576},{108.99468,34.22566},
						{108.99443,34.22547},{108.99433,34.22533},
						{108.99449,34.22522},{108.99478,34.22521},
						{108.99502,34.22530},{108.99517,34.22554},
						{108.99518,34.22568}
					},
					{
						{108.99449,34.22534},{108.99450,34.22530},
						{108.99459,34.22528},{108.99459,34.22535}
					}
				}
		},"01","生活区","","area");
		 
		Block block2=buildBlock(new double[][][][]{
				{					
					{
						{108.99572,34.22711},{108.99554,34.22696},
						{108.99539,34.22680},{108.99532,34.22653},
						{108.99561,34.22645},{108.99550,34.22621},
						{108.99558,34.22590},{108.99584,34.22565},	
						{108.99648,34.22548},{108.99740,34.22541},
						{108.99763,34.22541},{108.99796,34.22538},						
						{108.99818,34.22572},{108.99850,34.22590},
						{108.99839,34.22616},{108.99836,34.22640},
						{108.99820,34.22673},{108.99810,34.22705},
						{108.99764,34.22726},{108.99695,34.22733}
					}
				}
		},"02","矿区1","","area");
		
		Block block3=buildBlock(new double[][][][]{
				{				
					
					{
						{108.99859,34.22565},{108.99859,34.22532},
						{108.99899,34.22532},{108.99899,34.22565},
					}
				}
		},"03","堆放区1","","area");
		
		Block block4=buildBlock(new double[][][][]{
				{				
					
					{
						{108.99918,34.22565},{108.99916,34.22533},
						{108.99949,34.22532},{108.99949,34.22565},
					}
				}
		},"04","堆放区2","","area");
		
		Block block5=buildBlock(new double[][][][]{
				{				
					
					{
						{108.99905,34.22719},{108.99866,34.22705},
						{108.99862,34.22679},{108.99887,34.22660},
						{108.99917,34.22642},{108.99974,34.22634},
						{108.99993,34.22690},{108.99964,34.22733}
					}
				}
		},"05","矿区2","","area");

		Block[] blocks=new Block[]{block1,block2,block3,block4,block5};
		
		Road road1=buildLine("10",new double[][][]{{{ 108.99460,34.22547},
				{108.99500,34.22541}}},"衡山路","这是路 1","road");
		
		Road road2=buildLine("11",new double[][][]{{{ 108.99500,34.22541},
				{108.99538,34.22548}},{{108.99538,34.22548},
				{108.99593,34.22580}}},"泰山路","这是路 2","road");
		
		
		
		Road road3=buildLine("12",new double[][][]{{{ 108.99460,34.22547},
				{108.99593,34.22580}}},"萧山路","这是路 3","road");
		Road road4=buildLine("13",new double[][][]{{{ 108.99593,34.22580},
				{108.99706,34.22520}}},"云梦路","这是路 4","road");
		
		Road road5=buildLine("14",new double[][][]{{{ 108.99593,34.22580},
				{108.99704,34.22575}}},"萧何路","这是路 5","road");
		Road road6=buildLine("15",new double[][][]{{{ 108.99593,34.22580},
				{108.99691,34.22608}}},"落雨路","这是路 6","road");
		Road road7=buildLine("16",new double[][][]{{{ 108.99593,34.22580},
				{ 108.99632,34.22628}}},"繁华路","这是路 7","road");
		Road road8=buildLine("17",new double[][][]{{{ 108.99815,34.22589},
				{108.99706,34.22520}}},"衡山路","这是路 8","road");
		Road road9=buildLine("18",new double[][][]{{{ 108.99815,34.22589},
				{108.99871,34.22570}}},"泰山路","这是路 9","road");
		Road road10=buildLine("19",new double[][][]{{{108.99815,34.22589},
				{108.99895,34.22670}}},"萧山路","这是路 10","road");
		Road road11=buildLine("110",new double[][][]{{{108.99704,34.22575},
				{108.99815,34.22589}}},"云梦路","这是路 11","road");
		Road road12=buildLine("111",new double[][][]{{{108.99691,34.22608},
				{108.99704,34.22575}}},"萧何路","这是路 12","road");
		Road road13=buildLine("112",new double[][][]{{{108.99691,34.22608},
				{108.99632,34.22628}}},"落雨路","这是路13","road");
		Road road14=buildLine("113",new double[][][]{{{108.99699,34.22652},
				{108.99632,34.22628}}},"繁华路","这是路 14","road");
		Road road15=buildLine("114",new double[][][]{{{108.99699,34.22652},
				{108.99815,34.22589}}},"泰山路","这是路 15","road");
		
		
		Road road16=buildLine("115",new double[][][]{{{108.99871,34.22570},
				{108.99928,34.22568}}},"萧山路","这是路16","road");
		
		
		Road road17=buildLine("116",new double[][][]{{{108.99895,34.22670},
				{108.99927,34.22613}}},"云梦路","这是路 17","road");
		
		Road road18=buildLine("117",new double[][][]{{{108.99895,34.22670},
				{108.99893,34.22702}}},"萧何路","这是路 18","road");	 
		Road road19=buildLine("118",new double[][][]{{{108.99893,34.22702},
				{108.99942,34.22687}}},"落雨路","这是路 19","road");
		Road road20=buildLine("119",new double[][][]{{{108.99744,34.22710},
				{108.99699,34.22652}}},"繁华路","这是路 20","road");
		Road road21=buildLine("120",new double[][][]{{{108.99744,34.22710},
				{108.99893,34.22702}}},"衡山路","这是路 21","road");
		Road road22=buildLine("121",new double[][][]{{{108.99744,34.22710},
				{108.99583,34.22701}}},"泰山路","这是路 22","road"); 
		Road road23=buildLine("122",new double[][][]{{{108.99699,34.22652},
				{108.99571,34.22671}}},"萧山路","这是路 23","road");
		Road road24=buildLine("123",new double[][][]{{{108.99483,34.22654},
				{108.99583,34.22701}}},"云梦路","这是路 24","road");
		Road road25=buildLine("124",new double[][][]{{{108.99571,34.22671},
				{108.99483,34.22654}}},"萧何路","这是路 25","road");
		Road road26=buildLine("125",new double[][][]{{{108.99460,34.22547},
				{108.99483,34.22654}}},"落雨路","这是路 26","road");	
		
		Road road27=buildLine("126",new double[][][]{{{108.99871,34.22570},
				{108.99865,34.22557}}},"繁华路","这是路 27","road");
		 
		Road road28=buildLine("127",new double[][][]{{{108.99928,34.22568},
				{108.99924,34.22557}}},"繁华路","这是路 28","road");
		
		Road[] roads=new Road[]{road1,road2,road3,road4,road5,road6,road7,
				road8,road9,road10,road11,road12,road13,road14,
				road15,road16,road17,road18,road19,road20,road21,
				road22,road23,road24,road25,road26,road27,road28};
		

		Point site1=buildPoint("20",new double[]{108.99460,34.22547},"控制站","",HOUSE);
		Point site2=buildPoint("21",new double[]{108.99500,34.22541},"勤务站","",HOUSE);
		
		Point site3=buildPoint("32",new double[]{108.99593,34.22580},"矿点A","",MINE);
		Point site4=buildPoint("33",new double[]{108.99704,34.22575},"矿点B","",MINE);
		Point site5=buildPoint("34",new double[]{108.99632,34.22628},"矿点C","",MINE);
		Point site6=buildPoint("35",new double[]{108.99699,34.22652},"矿点D","",MINE);	
		Point site7=buildPoint("36",new double[]{108.99583,34.22701},"矿点E","",MINE);		
		Point site8=buildPoint("37",new double[]{108.99942,34.22687},"矿点F","",MINE);

		Point commute1=buildPoint("40",new double[]{108.99815,34.22589},"交通站A","",COMMUTE);
		Point commute2=buildPoint("41",new double[]{108.99691,34.22608},"交通站B","",COMMUTE);
		Point commute3=buildPoint("42",new double[]{108.99571,34.22671},"交通站C","",COMMUTE);
		Point commute4=buildPoint("43",new double[]{108.99744,34.22710},"交通站D","",COMMUTE);
		
		Point commute5=buildPoint("44",new double[]{108.99893,34.22702},"交通站E","",COMMUTE);
		Point commute6=buildPoint("45",new double[]{108.99895,34.22670},"交通站F","",COMMUTE);
		Point commute7=buildPoint("46",new double[]{108.99871,34.22570},"交通站G","",COMMUTE);
		Point commute8=buildPoint("47",new double[]{108.99865,34.22557},"交通站H","",COMMUTE);
		Point commute9=buildPoint("48",new double[]{108.99928,34.22568},"交通站I","",COMMUTE);
		Point commute10=buildPoint("49",new double[]{108.99924,34.22557},"交通站J","",COMMUTE);
		
		Point transfer1=buildPoint("50",new double[]{108.99706,34.22520},"通信A","",TRANSFER);
		Point transfer2=buildPoint("51",new double[]{108.99483,34.22654},"通信B","",TRANSFER);	
		Point transfer3=buildPoint("52",new double[]{108.99927,34.22613},"通信C","",TRANSFER);
		
		Point[] sites=new Point[]{site1,site2,site3,site4,site5,site6,site7,site8,
				commute1,commute2,commute3,commute4,commute5,commute6,commute7,commute8,
				commute9,commute10,transfer1,transfer2,transfer3};
		
		return buildMapBean(blocks,roads,sites);
	}
	

	public static void main(String[] args) throws InvocationTargetException {
		
//		Block block=buildBlock(new double[][][][]{{{{108.998,34.22673}}}},"浪崖","勿归来");
//		Road road1=buildLine("36",new double[][][]{{{ 108.123,34.0},
//				{108.1231,34.012}}},"长亭路","十年生死两茫茫，不思量，自难忘");
//		Road road2=buildLine("66",new double[][][]{{{ 105.123,31.0},
//				{109.1231,33.012}}},"柳萍路","人道山长山又断，萧萧微雨闻孤馆");
//		Road[] roads=new Road[]{road1,road2};
//		
//		Point site1=buildPoint("20",new double[]{108.99629, 34.22601},"兰亭","站点A",MINE);
//		Point site2=buildPoint("21",new double[]{108.99581, 34.22581},"玉露","站点B",MINE);
//		
//		Point[] sites=new Point[]{site1,site2};
//		
//		MapData map=buildMapBean(block,roads,sites);
//		
//		
//		Road road3=buildLine("45",new double[][][]{{{ 108.123F,34.0F},
//				{108.1231F,34.012F}}},"长亭路","相思红豆少，穿针引线作春雨");
//		Point site3=buildPoint("69",new double[]{105.123F,31.0F},"飞蓬","袅袅青烟绕孤城");
		//addDataByType(map,3,road3);
		//addDataByType(map,1,site3);
		//System.out.println(createMap(map));
		
//		Road r= (Road)getDataById(map, "36");
//		System.out.println(r.getProperties().getName());
//		
//		Road road4=buildLine("336",new double[][][]{{{ 108.123,34.0},
//			{108.1231,34.012}}},"云非雨","不思量，自难忘");
//		updateDataById(map, "36", road4);
//		System.out.println(createMap(map));
//		
//		GeosonUtil.writeJson(createMap(map));
//		
//		deleteDataById(map,"336");
//		System.out.println(createMap(map));
		
		FileUtil.writeJson(createMap(initMap()));
//		System.out.println(FEATURE);
//		System.out.println(getUniqueID(2,HOUSE));
//		System.out.println(getUniqueID(2,MINE));
//		System.out.println(getUniqueID(2,COMMUTE));
//		System.out.println(getUniqueID(2,TRANSFER));

//		Point site1=buildPoint("20",new double[]{108.99460,34.22547},"控制站","",HOUSE);
//	
//		List<Road> list=getPointLinkedLines(site1);
//		for(Road r:list){
//			System.out.println(r.getId());
//		}
//		Road road1=buildLine("1",new double[][][]{{{ 108.99460,34.22547},
//			{108.99500,34.22541}}},"衡山路","这是路 1");
//		
//		List<Point> list2=getLineLinkedPoints(road1);
//		for(Point r:list2){
//			System.out.println(r.getId());
//		}
		
		
	}
}

