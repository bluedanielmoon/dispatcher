package com.map.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * 用来处理文件的读入和输出
 * 
 * @author daniel
 * @since 2018.02.06
 */
public class FileUtil {
	
	public static String BASEPATH="src/main/resources/static/mapData/";
	public static String fileName="jsonNew.json";
	
	private static final String dateFormat = "MMdd";
	private static final String timeFormat = "HHmmss";
	private static final String carFile = "carPath";

	public static void main(String[] args) throws NoSuchMethodException,
			SecurityException, IllegalAccessException,
			IllegalArgumentException, InvocationTargetException, IOException {
		// FileUtil.buildFile("1");
//
//		Car car = new Car();
//		car.setId("2");
//		car.setPath(new String[] { "108", "34" });
//		car.setPos(new String[] { "100", "30" });
//		car.setState("1");
//		car.setTime(System.currentTimeMillis());
//
//		FileUtil.writeOdbjectToFile(car);
		String source=FileUtil.readOdbjectFromFile("1","1517882715737","1517882719798");
		//System.out.println(GeosonUtil.StringToObject(source, Car.class));
	}
	
	/**
	 * 读取文件
	 * @return 文件字符串
	 */
	public static String readSource(){
		BufferedReader bfreader = null;
		try {
			bfreader = new BufferedReader(new FileReader(BASEPATH+fileName));
			String buf=null;
			StringBuffer sbuffer= new StringBuffer();
			while((buf=bfreader.readLine())!=null){
				sbuffer.append(buf);
			}
			return sbuffer.toString();
			
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				bfreader.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return null;
	}
	
	/**
	 * 用来把节点数据写入默认的文件
	 * @param content
	 */
	public static boolean writeJson(String text){
		
		BufferedWriter writer = null;
		try {
			writer= new BufferedWriter(new FileWriter(BASEPATH+fileName));
			writer.write(text);
			return true;
		} catch (Exception e) {
			// TODO: handle exception
		}finally{
			try {
				writer.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return false;
	}
	
	public static File buildFile(String name) {
		File file = new File(name);
		if (file.mkdirs()) {
			System.out.println("为 " + name + "创建了一个文件夹");
		}
		return file;
	}

	public static <T> String getTargetValue(T target, String need) {

		Method method = null;
		try {
			method = target.getClass().getMethod(need);
			return (String) method.invoke(target);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	public static <T> List<Long> getListValue(T target, String need) {

		Method method = null;
		try {
			method = target.getClass().getMethod(need);
			return (List<Long>) method.invoke(target);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	// 创建属于这辆车的今天的文件夹
	public static <T> File buildObjectFile(T target) {

		String fileName = null;
		DateFormat fileBoxmat = new SimpleDateFormat(dateFormat);
		try {
			fileName = carFile + "/" + getTargetValue(target, "getId") + "/"
					+ fileBoxmat.format(new Date());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return buildFile(fileName);
	}

	// 返回某一辆车的所有轨迹文件
	public static List<String[]> listFiles(String carId) {
		List<String[]> pathNames = new ArrayList<String[]>();
		File file = new File(carFile);
		File[] ids = file.listFiles();
		for (File id : ids) {
			if (id.getName().equals(carId)) {
				File[] dates = id.listFiles();
				for (File date : dates) {
					File[] paths = date.listFiles();
					for (File path : paths) {
						if(path.getName().length()>=30){
							String[] x = new String[] {
									path.getName().substring(0, 13),
									path.getName().substring(13, 26) };
							pathNames.add(x);
						}	
					}
				}
				return pathNames;
			}
		}
		return null;
	}

	// 根据车辆id和起始终止时间拿到轨迹文件
	public static File getFileById(String carId, String start, String end) {
		File file = new File(carFile);
		File[] ids = file.listFiles();
		for (File id : ids) {			
			if (id.getName().equals(carId)) {
				File[] dates = id.listFiles();
				for (File date : dates) {
					File[] paths = date.listFiles();
					for (File path : paths) {
						
						if (path.getName().substring(0, 13).equals(start)
								&& path.getName().substring(13, 26).equals(end)) {
							return path;
						}
					}
				}
				break;
			}
		}
		return null;
	}

	public static <T> void writeOdbjectToFile(T target) {
		String data = GeosonUtil.witeObejctToJson(target);
		//DateFormat filemat = new SimpleDateFormat(timeFormat);

		List<Long> times = getListValue(target, "getTime");
		File parent = buildObjectFile(target);
		// 在文件夹中创建这个路径文件carpath/车辆编号/日期(0206)/记录起始终止时间.txt
		// filemat.format(
		String pathFile = parent.getParent() + "/" + parent.getName() + "/"
				+ times.get(0) + times.get(times.size() - 1) + ".txt";

		File onePath = new File(pathFile);
		BufferedWriter writer = null;
		try {
			if (onePath.createNewFile()) {
				writer = new BufferedWriter(new FileWriter(pathFile));
				writer.write(data.toString());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				writer.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public static <T> String readOdbjectFromFile(String carId, String start, String end) {

		String searchFile = getFileById(carId, start, end).getPath();
		BufferedReader reader = null;
		try {

			reader = new BufferedReader(new FileReader(searchFile));
			String buf = null;
			StringBuffer sbuffer = new StringBuffer();
			while ((buf = reader.readLine()) != null) {
				sbuffer.append(buf);
			}
			return sbuffer.toString();

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	public static boolean deleteFile(String carId, String startTime,
			String endTime) {
		File searchFile = getFileById(carId, startTime, endTime);
		
		return searchFile.delete();
	}
}
