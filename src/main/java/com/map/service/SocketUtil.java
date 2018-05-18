package com.map.service;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import com.map.cache.Cache;

public class SocketUtil {

	/**
	 * 发送状态报文
	 * 
	 * */
	public byte[] orderTomotivate(byte identity,byte status){
		
		byte [] bytes = new byte[6];
		bytes[0] = 0x11; //包头
		bytes[1] = 0x04; //包长
		bytes[2] = 0x03; //指令编号
		bytes[3] = identity; //车辆代码
		bytes[4] = status; //车辆状态
		
		//计算校验
		int XORLength = bytes[1];
		byte XORResult = 0;
		
		for (int i = 0; i < XORLength; i++) {
			XORResult ^= bytes[1+i];
		}
		bytes[5] = XORResult; //校验位值
		
		return bytes;
	}
	
	/**
	 * 发送坐标报文
	 * 
	 * */
	public byte[] coordinatesTomotivate(byte identity,byte[] section){
			System.out.println("-----coordinatesTomotivate--- section.length--"+section.length);
			byte [] bytes = new byte[5+section.length-1];
			bytes[0] = 0x11; //包头
			bytes[1] = (byte)(2+section.length); //包长
			bytes[2] = 0x02; //指令编号
			bytes[3] = identity; //车辆代码
			bytes[4] = section[1];   //(byte)((section.length-1)/2); //路段个数
			
			int j = 2;
			for (int i = 5; i < (3+section.length); i++) {
					bytes[i]=section[j];
					j++;
			}
			
			//计算校验
			int XORLength = bytes[1];
			byte XORResult = 0;
			
			for (int i = 0; i < XORLength; i++) {
				XORResult ^= bytes[1+i];
			}
			
			bytes[XORLength+1] = XORResult; //校验位值
			
			return bytes;
		}
	
	
	/**
	 * 接受坐标报文
	 * identity:车辆代码
	 * 
	 * */
	public byte[] receiveFrommotivate(byte identity,byte lgtitute,byte latitute,byte status){
		
		byte [] bytes = new byte[8];
		bytes[0] = 0x11; //包头
		bytes[1] = 0x06; //包长
		bytes[2] = 0x01; //指令编号
		bytes[3] = identity; //车辆代码
		bytes[4] = lgtitute; //实时经度
		bytes[5] = latitute; //实时纬度
		bytes[6] = status; //实时车况
		
		//计算校验
		int XORLength = bytes[1];
		byte XORResult = 0;
		
		for (int i = 0; i < XORLength; i++) {
			XORResult ^= bytes[1+i];
		}
		bytes[7] = XORResult; //校验位值
		
		return bytes;
	}
	
	
	/**
	 * 接受坐标报文
	 * identity:车辆代码
	 * 
	 * */
	public Map<String, String> receiveFrommotivate(byte[] input){
		String lng = "";//经度
		String lat = "";//纬度
		String status = "";//车况
		String identity="";//车辆代码
		Map<String, String> recive_data = new HashMap<>() ;
		
		
		lat = Byte.toString(input[4])
				+'.'+Byte.toString(input[5])
				+Byte.toString(input[6])
				+Byte.toString(input[7]);
		
		lng = Byte.toString(input[8])
				+'.'+Byte.toString(input[9])
				+Byte.toString(input[10])
				+Byte.toString(input[11]);
		
		status = Byte.toString(input[12]);

		identity = Byte.toString(input[3]);
		
		recive_data.put("id",identity);
		recive_data.put("lng", lng);
		recive_data.put("lat", lat);
		recive_data.put("status", status);
		recive_data.put("time", String.valueOf(System.currentTimeMillis()));
		if (input[0]==17&&input[1]==12&&input[2]==1) {
			
			//计算校验
			byte XORResult = 0;
			for (int i = 0; i < input[1]; i++) {
				XORResult ^= input[1+i];
				
			}
			//校验位值

			if (XORResult==input[13]) {

			} 
		}
		
		return recive_data;
	}
	
	//1--绿色，2--红色
	public Map<String, Object> receiveLightData(byte[] input){
		Map<String, Object> recive_data = new HashMap<>() ;

		String data=Byte.toString(input[0]);
		boolean flag=false;
		if(data.equals("1")){
			flag=true;
		}else{
			flag=false;
		}
		System.out.println(data);
		recive_data.put("time", String.valueOf(System.currentTimeMillis()));
		recive_data.put("result", flag);
		
		return recive_data;
	}
}
