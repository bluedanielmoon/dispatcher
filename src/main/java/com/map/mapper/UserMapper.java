package com.map.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.map.po.User;

@Mapper
public interface UserMapper{

	public boolean insertUser(@Param("name")String name,@Param("password")String password);
	
	public String getUserName(int id);
	
	public User getUser(int id);
	
	public List<User> getAllUsers();
}

