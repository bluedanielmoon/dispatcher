package com.map.util;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

public class ListUtil {
	
	public static <T> T getTargetById(List<T> list, String id) {

		if (list.size() == 0) {
			return null;
		}
		Method method;
		try {
			method = list.get(0).getClass().getMethod("getId");
			String singID = null;
			for (int i = 0; i < list.size(); i++) {
				singID = (String) method.invoke(list.get(i));
				if (singID.equals(id)) {
					return list.get(i);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static <T> boolean delTargetById(List<T> list, String id) {

		if (list.size() == 0) {
			return false;
		}
		Method method;
		try {
			method = list.get(0).getClass().getMethod("getId");
			String singID = null;
			for (int i = 0; i < list.size(); i++) {
				singID = (String) method.invoke(list.get(i));
				if (singID.equals(id)) {
					list.remove(list.get(i));
					return true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public static boolean checkNotNULL(String[] items) {

		for (int i = 0; i < items.length; i++) {
			if (items[i] == null || items[i].equals("")) {
				return false;
			}
		}
		return true;
	}
	
	public static boolean compareTwoMap(Map<String, String> last,
			Map<String, String> receive, String[] items) {
		for (String item : items) {
			if (!last.get(item).equals(receive.get(item))) {
				return false;
			}
		}
		return true;
	}
}
