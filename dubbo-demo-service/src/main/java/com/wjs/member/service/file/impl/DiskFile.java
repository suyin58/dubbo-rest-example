package com.wjs.member.service.file.impl;

import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.jboss.resteasy.annotations.providers.multipart.PartType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DiskFile {

	private static final Logger LOGGER = LoggerFactory.getLogger(DiskFile.class);

	
	
	@FormParam("fileName")
	//	@PartFilename("file")  but unfortunately this is currently only used for writing forms, not reading forms: RESTEASY-1069.:https://issues.jboss.org/browse/RESTEASY-1069
	private String fileName;

	@FormParam("file")
	@PartType(MediaType.APPLICATION_OCTET_STREAM)
	private byte[] fileDate;

	
	@FormParam("age")
	private Integer age;

	public DiskFile() {
	}

	public Integer getAge() {

		return age;
	}

	public void setAge(Integer age) {

		this.age = age;
	}
	
	
	public String getFileName() {

		return fileName;
	}

	public void setFileName(String fileName) {

		this.fileName = fileName;
	}

	public byte[] getFileDate() {

		return fileDate;
	}

	public void setFileDate(byte[] fileDate) {

		this.fileDate = fileDate;
	}

	@Override
	public String toString() {

		return ReflectionToStringBuilder.toString(this);
	}

}
