package com.map.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * 用来处理json数据的修改
 * @author daniel
 * @since 2018.01.26
 */
public class GeosonUtil {
	public static String ID="id";
	

	public static JsonNode container;
	
	static{
		container=readJson(FileUtil.readSource());
	}
	
	/**
	 * 解析代表json数据的字符串
	 * @param source json数据
	 * @return jackSon包下的jsonNode
	 */
	public static JsonNode readJson(String source){	
		ObjectMapper mapper= new ObjectMapper();
		try {
			JsonNode container=mapper.readTree(source);
			return container;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	/**
	 * 将某一jsonNode中的键的值替换为参数中新值
	 * @param node 想要替换的属性的祖父
	 * @param key 想要替换的键值
	 * @param value	想要替换的值
	 */
	public static void replaceKey(JsonNode node,String key,String value){
		ObjectNode obNode=(ObjectNode) node.findParent(key);
		obNode.replace(key, new TextNode(value));
		//obNode.remove(key);
		
		//obNode.put(key, value);
	}
	
	/**
	 * 从已经读取的JsonNode容器里读取id为参数值的节点
	 * @param id 唯一的那个id
	 * @return id的上层节点
	 */
	public static JsonNode getNodeByID(String id){
		List<JsonNode> idList=container.findParents(ID);
		for(JsonNode node:idList){
			if(node.get(ID).asText().equals(id)){
				return node;	
			}
		}		
		return null;
		
	}
	/**
	 * 给出可以定位某一值的id和想要修改的键值对替换掉，还未替换源文件
	 * 如果要替换源文件，用<code>writeJson()</code>
	 * @param id 唯一的id
	 * @param prop 想要替换其值的键
	 * @param value	想要替换的键的新值
	 * @return
	 */
	public static void editKey(String id,String prop,String value){
		replaceKey(getNodeByID(id),prop,value);
	}
	
	public static <T> String witeObejctToJson(T target){	
		ObjectMapper mapper= new ObjectMapper();
		try {
			String result=mapper.writeValueAsString(target);
			return result;
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
		
	}
	
	public static <T> T StringToObject(String source,Class<T> type){
		ObjectMapper mapper= new ObjectMapper();
		try {
			T result=(T) mapper.readValue(source, type);
			return result;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String[] args) throws FileNotFoundException, JsonProcessingException {
//		GeosonUtil.editKey("0", "type", "杜兰若");
//		GeosonUtil.writeJson();
		
		
//		Car car =new Car();
//		car.setId("2");
//		car.setPath(new String[]{"108","34"});
//		car.setPos(new String[]{"100","30"});
//		car.setState("1");
//		car.setTime(System.currentTimeMillis());
//		GeosonUtil.witeObejctToJson(car);
	}
}

