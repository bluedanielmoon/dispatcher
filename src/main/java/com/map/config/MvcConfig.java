package com.map.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.map.interceptor.TestInterceptor;

@Configuration
@EnableWebMvc
@ComponentScan("com.map.config")
public class MvcConfig extends WebMvcConfigurerAdapter {
	
//	@Bean
//	public InternalResourceViewResolver viewResolver(){
//		InternalResourceViewResolver resolver= new InternalResourceViewResolver();
//		resolver.setPrefix("/WEB-INF/classes/");
//		resolver.setSuffix(".jsp");
//		resolver.setViewClass(JstlView.class);
//		return resolver;
//		
//	}
	//开放资源接口，前面handler是访问的路径http://localhost:8081/map/static/js/index.js
	//后面的是实际的资源路径,这个路径直接对应于资源的根目录，即static之下
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/static/**").addResourceLocations("classPath:/static/");
		registry.addResourceHandler("/**").addResourceLocations("classPath:/static/");
	}
	
	
	//下面两个是配置拦截器
//	@Bean
//	public TestInterceptor testInterceptor(){
//		return new TestInterceptor();
//	}
//	
//	@Override
//	public void addInterceptors(InterceptorRegistry registry) {
//		registry.addInterceptor(testInterceptor());
//	}
//	
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/index").setViewName("index");
		registry.addViewController("/mapEdit").setViewName("mapEdit");
		registry.addViewController("/style").setViewName("style");
	}
}
