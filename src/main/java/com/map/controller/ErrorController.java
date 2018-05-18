package com.map.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class ErrorController {
	
    //msg是ExceptionHandlerAdvice定义的modelAttribute
    @RequestMapping("/sorry")
   	public String doError(@ModelAttribute("msg") String msg) {
   		throw new IllegalArgumentException("非常抱歉，错误信息是： "+msg);
   	}
    
    @RequestMapping("/getError")
    @ResponseBody
   	public String showError() {
   		return "404";
   	}
}