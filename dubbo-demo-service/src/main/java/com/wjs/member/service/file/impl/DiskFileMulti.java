package com.wjs.member.service.file.impl;

import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.jboss.resteasy.annotations.providers.multipart.PartType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DiskFileMulti {

	private static final Logger LOGGER = LoggerFactory.getLogger(DiskFileMulti.class);

	
	
	@FormParam("fileName1")
	//	@PartFilename("file")  but unfortunately this is currently only used for writing forms, not reading forms: RESTEASY-1069.:https://issues.jboss.org/browse/RESTEASY-1069
	private String fileName1;

	@FormParam("file1")
	@PartType(MediaType.APPLICATION_OCTET_STREAM)
	private byte[] fileDate1;

	@FormParam("fileName2")
	//	@PartFilename("file")  but unfortunately this is currently only used for writing forms, not reading forms: RESTEASY-1069.:https://issues.jboss.org/browse/RESTEASY-1069
	private String fileName2;

	@FormParam("file2")
	@PartType(MediaType.APPLICATION_OCTET_STREAM)
	private byte[] fileDate2;
	
	@FormParam("age")
	private Integer age;

	public DiskFileMulti() {
	}

	public Integer getAge() {

		return age;
	}

	public void setAge(Integer age) {

		this.age = age;
	}
	
	

	
	public String getFileName1() {
	
		return fileName1;
	}

	
	public void setFileName1(String fileName1) {
	
		this.fileName1 = fileName1;
	}

	
	public byte[] getFileDate1() {
	
		return fileDate1;
	}

	
	public void setFileDate1(byte[] fileDate1) {
	
		this.fileDate1 = fileDate1;
	}

	
	public String getFileName2() {
	
		return fileName2;
	}

	
	public void setFileName2(String fileName2) {
	
		this.fileName2 = fileName2;
	}

	
	public byte[] getFileDate2() {
	
		return fileDate2;
	}

	
	public void setFileDate2(byte[] fileDate2) {
	
		this.fileDate2 = fileDate2;
	}

	@Override
	public String toString() {

		return ReflectionToStringBuilder.toString(this);
	}

}
