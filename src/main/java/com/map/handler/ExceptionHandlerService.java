package com.map.handler;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;


//声明这个是为了
@ControllerAdvice
public class ExceptionHandlerService {
	
	
	//添加错误控制，value代表拦截的条件
	@ExceptionHandler(value= Exception.class)
	public String exception(Exception e,WebRequest request){
		System.out.println(request);
		System.out.println(e.getMessage());
		return "error";
	}
	
	//给所有的model添加属性信息
	@ModelAttribute
	public void addAttribute(Model model){
		model.addAttribute("msg", "hi,daniel");
	}
}
