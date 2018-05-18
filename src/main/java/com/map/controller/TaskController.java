package com.map.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.map.cache.Cache;
import com.map.domain.Task;
import com.map.service.TaskService;

@Controller
@RequestMapping(path = "/task")
public class TaskController {
	@Autowired
	private TaskService taskServ=new TaskService();
	
	@Autowired
    public TaskController(TaskService taskServ){
        this.taskServ = taskServ;
    }
	
	@RequestMapping(path = "/push", method = RequestMethod.POST)
	@ResponseBody
	public Task buildTask(HttpServletRequest request) throws IOException {
		String id = request.getParameter("id");
		String start = request.getParameter("start");
		String end = request.getParameter("end");
		String detailPath[] = request.getParameterValues("detailPath[]");

		return taskServ.regisTask(id,start,end,detailPath);
	}

	@RequestMapping(path = "/assginCar", method = RequestMethod.POST)
	@ResponseBody
	public Task assginCar(HttpServletRequest request) {
		String taskId = request.getParameter("taskId");
		String carId = request.getParameter("carId");
		
		return taskServ.assignCarToTask(taskId,carId);
	}
	
	@RequestMapping(path = "/begin", method = RequestMethod.POST)
	@ResponseBody
	public Task beginTask(HttpServletRequest request) {
		String taskId = request.getParameter("taskId");
		System.out.println("准备开始任务");
		return taskServ.startTask(taskId);
	}

	@RequestMapping(path = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public boolean deleteTaskById(HttpServletRequest request) {
		String taskId = request.getParameter("taskId");
		
		return taskServ.deleteTask(taskId);
	}


	@RequestMapping(path = "/get", method = RequestMethod.GET)
	@ResponseBody
	public Task getTaskById(HttpServletRequest request)
			throws JsonProcessingException, IOException {
		String taskID = request.getParameter("taskID");
		
		return taskServ.getTask(taskID);
	}


	@RequestMapping(path = "/all", method = RequestMethod.GET)
	@ResponseBody
	public List<Task> getTaskList(HttpServletRequest request) {
		return Cache.taskList;
	}
	
}
