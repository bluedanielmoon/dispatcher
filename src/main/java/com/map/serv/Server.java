package com.map.serv;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

import com.map.cache.Cache;
import com.map.service.SocketUtil;

import javafx.util.converter.ByteStringConverter;

public class Server{

	public static Map<Integer, Socket> clients = new HashMap<Integer, Socket>();
	public static Map<String, byte[]> send_data = new HashMap<String, byte[]>();
	
	private ServerSocket serverSocket;
	private int port=8234;

	public Server() throws IOException {
		serverSocket = new ServerSocket(port);
	}
	
	public void start() throws IOException {
		System.out.println("交互Server启动...");
		
		while (true) {
			for(Integer i:clients.keySet()){
				System.out.println("车辆的id   "+i);
			}
			System.out.println("等待客户端连接……………………………………");
			Socket socket=null;
			
			socket = serverSocket.accept();
			System.out.println(socket.getInetAddress() + " " + socket.getPort()
					+ "移动端上线了。。。。。。。。");

			if (clients != null && clients.get(3) != socket) {
				clients.put(3, socket);
			} else {
				clients.put(3, socket);
			}
			System.out.println("当前的移动端有：" + clients);
			new ReceiveThread(socket).start();
			System.err.println(System.currentTimeMillis());
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public void SendData(int car_identity, Map<String, byte[]> send_data) {
		System.out.println("--------------------------------");
		
		System.out.println("输入的id         "+car_identity);
		for(Integer i:clients.keySet()){
			System.out.println("车辆的id   "+i);
		}
		new Send2Status(clients.get(car_identity), send_data).start();
	}

	class ReceiveThread extends Thread {

		Socket socket_receive;
		SocketUtil socketUtil = new SocketUtil();

		ReceiveThread(Socket socket_receive) {
			this.socket_receive = socket_receive;
		}

		@Override
		public void run() {
			while (true) {
				InputStream inputStream;
				try {
					inputStream = socket_receive.getInputStream();
					BufferedInputStream bis = new BufferedInputStream(
							inputStream, 32);
					byte input[] = new byte[14];
					while (bis.read(input) != -1) {
						Cache.recive_data = socketUtil.receiveFrommotivate(input);
						
						System.out.println("客户端:"+socket_receive.getPort()+"  时间:"+
								new SimpleDateFormat("HH:mm:ss").format(new Date().getTime()));
						System.out.println("发送的消息为"+Cache.recive_data+"\n\n");
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
//				try {
//					inputStream = socket_receive.getInputStream();
//					byte input[] = new byte[2];
//					BufferedInputStream bis = new BufferedInputStream(inputStream, input.length);
//					System.out.println("111111111");
//					while (bis.read(input) != -1) {
//						
//						//Cache.recive_data = socketUtil.receiveFrommotivate(input);
//						
//						Cache.lightCheck.add(socketUtil.receiveLightData(input));
//						
//						System.out.println("客户端:"+socket_receive.getPort()+"  时间:"+
//								new SimpleDateFormat("HH:mm:ss").format(new Date().getTime()));
//						System.out.println("发送的消息为"+Cache.recive_data+"\n\n");
//					}
//				} catch (IOException e) {
//					e.printStackTrace();
//				}
			}
		}
	}

	class Send2Status extends Thread {

		Socket socket_send2Status;
		Map<String, byte[]> send_data;
		// olatile boolean exit = false;
		SocketUtil socketUtil = new SocketUtil();

		public Send2Status(Socket socket_send2Status,
				Map<String, byte[]> send_data) {
			super();
			this.socket_send2Status = socket_send2Status;
			this.send_data = send_data;
		}

		@Override
		public void run() {

			try {
				OutputStream os = socket_send2Status.getOutputStream();

				if (send_data.get("coordinatesTomotivate") != null) {
					
					byte[] send2moto1 = socketUtil.coordinatesTomotivate(
							send_data.get("coordinatesTomotivate")[0],
							send_data.get("coordinatesTomotivate"));
					os.write(send2moto1);
					os.flush();
					Thread.sleep(2000);
					if (send_data.get("orderTomotivate") != null) {

						byte[] send2moto2 = socketUtil.orderTomotivate(
								send_data.get("orderTomotivate")[0],
								send_data.get("orderTomotivate")[1]);
						os.write(send2moto2);
						os.flush();

					}

				}
			} catch (IOException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public static void main(String[] args) throws IOException {
		new Server();

	}
}
