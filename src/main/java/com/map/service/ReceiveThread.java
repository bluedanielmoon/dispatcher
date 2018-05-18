package com.map.service;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;

public class ReceiveThread extends Thread{
	

	Socket socket_receive;
	SocketUtil socketUtil = new SocketUtil();
	
	ReceiveThread(Socket socket_receive){
		this.socket_receive = socket_receive;
	}
	
	@Override
	public void run() {
		while (true) {
			InputStream inputStream;
			try {
				inputStream = socket_receive.getInputStream();
				BufferedInputStream bis = new BufferedInputStream(inputStream,10240);
				
//				FileOutputStream fileOutputStream = new FileOutputStream("base_acquire_info.txt");
//				BufferedOutputStream bos = new BufferedOutputStream(fileOutputStream,10240);
				
				byte input[] = new byte[14];
				
				int count = 0;
				long before = System.currentTimeMillis();
				
//				while (bis.read(input)!=-1) {
//					//bos.write(input);
//					String msg = new String(input, 0, input.length-1,"utf-8");
//					
//				    recive_data = socketUtil.receiveFrommotivate(input);
//					System.out.println(socket_receive.getInetAddress()+" "+socket_receive.getPort()+"向服务器说："+recive_data);
//					
//		
//					/*for(Socket socket : clients){
//						if(socket.equals(socket_receive))
//							continue;
//						OutputStream outputStream = socket.getOutputStream();
//						BufferedOutputStream bos_every = new BufferedOutputStream(outputStream,10240);
//						
//						bos_every.write((socket_receive.getInetAddress()+" "+socket_receive.getPort()+"说："+msg).getBytes());
//						bos_every.flush();
//						bos_every.close();
//						outputStream.close();
//						
//					}*/
//						if("end".equals(msg)){
//							clients.remove(socket_receive);
//							//socket_receive.close();
//							break;
//					}
//				}
				long after = System.currentTimeMillis();
				long time = after - before ;
				
				System.out.println("从移动端读取了"+count+"次，取发消耗时间 "+time+" ms");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
