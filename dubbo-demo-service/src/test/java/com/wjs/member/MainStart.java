package com.wjs.member;	
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


public class MainStart {

	private static final Logger LOGGER = LoggerFactory.getLogger(MainStart.class);

	public static void main(String[] args) {
		 ApplicationContext context = new 
			                ClassPathXmlApplicationContext(new String[] {"/spring/spring-service-applicationContext.xml"});
		
		 try {
			Thread.sleep(1000000L);
		} catch (InterruptedException e) {
		}
	
	}
	
}

