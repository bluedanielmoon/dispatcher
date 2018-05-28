package com.map.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.map.mapper.UserMapper;
import com.map.po.User;

@Service  
public class UserService implements UserMapper{  
  
    @Autowired  
    private UserMapper userMapper;  
      
	@Override
	public boolean insertUser(String name, String password) {
		userMapper.insertUser(name, password);
		return false;
	}

	@Override
	public String getUserName(int id) {
		
		return userMapper.getUserName(id);
	}

	@Override
	public User getUser(int id) {
		
		return userMapper.getUser(id);
	}

	@Override
	public List<User> getAllUsers() {
		
		return userMapper.getAllUsers();
	}  
    
} 
 