package com.map.util;

import java.util.HashMap;
import java.util.Map;

public class ByteUtil {
	
	
	public static Map<String, byte[]> StringToByte(String id, String state,
			String[] paths) {
		Map<String, byte[]> orderList = new HashMap<String, byte[]>();
		byte stateOrder[] = new byte[2];
		byte pathOrder[] = new byte[2 + paths.length];

		// id要小于127
		stateOrder[0] = (byte) Integer.parseInt(id);
		stateOrder[1] = (byte) Integer.parseInt(state);

		pathOrder[0] = (byte) Integer.parseInt(id);
		pathOrder[1] = (byte) (paths.length / 2);
		for (int i = 0; i < paths.length; i++) {
			pathOrder[i + 2] = (byte) Integer.parseInt(paths[i]);
		}
		orderList.put("orderTomotivate", stateOrder);
		orderList.put("coordinatesTomotivate", pathOrder);
		return orderList;
	}

}
