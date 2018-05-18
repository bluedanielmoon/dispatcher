package com.map.serv;

import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.util.List;
import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.map.cache.Cache;
import com.map.serv.Server;

/**
 * 等待移动端连接的类
 * @author Administrator
 *
 */
@Component
@Order(value = 1)
public class ServiceRunner implements ApplicationRunner{
	public static Server server;
	
	@Override
	public void run(ApplicationArguments args) throws Exception {
		System.out.println("启动接受和发送数据服务");
		new Thread(new StartServer()).start();
		
		System.out.println("从缓存中读数据启动");
		new Thread(new CarRegister()).start();
		
//		System.out.println("后端发送红绿灯检测结果启动");
//		new Thread(new LightCheckRecorder()).start();
//		
		
		// get name representing the running Java virtual machine.  
		String name = ManagementFactory.getRuntimeMXBean().getName();
		Cache.jvmID=name.split("@")[0];
		System.out.println("此java虚拟机的进程号是： "+Cache.jvmID);
	
	}
	
	class StartServer implements Runnable{

		@Override
		public void run() {
			try {
				server=new Server();
				server.start();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}	
		}
		
	}
}