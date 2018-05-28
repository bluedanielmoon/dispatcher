
package com.map.service;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.map.po.User;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UserServiceTest {

	@Autowired
	UserService UserService;

//	@Test
//	public void testInsertUser() {
//		UserService.insertUser("ddddd", "3333333");
//		UserService.insertUser("daniel", "3333333");
//		UserService.insertUser("jen", "3333333");
//		UserService.insertUser("bily", "3333333");
//	}

	@Test
	public void testGetUserName() {
		
		System.out.println(UserService.getUserName(8));
	}

	@Test
	public void testGetUser() {
		
		System.out.println(UserService.getUser(7).toString());
	}

	@Test
	public void testGetAllUsers() {
		List<User> users =UserService.getAllUsers();
		
		for(User u:users){
			System.out.println(u.toString());
		}
	}

}
