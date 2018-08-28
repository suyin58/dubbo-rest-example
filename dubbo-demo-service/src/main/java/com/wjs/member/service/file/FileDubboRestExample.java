package com.wjs.member.service.file;	
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import com.wjs.member.clientVo.deduct.DeductTplVo;
import com.wjs.member.service.file.impl.DiskFile;
import com.wjs.member.service.file.impl.DiskFileMulti;


public interface FileDubboRestExample {

	Object uploadfile(MultipartFormDataInput input,String name, Integer age, HttpServletRequest request, HttpServletResponse response);
	
	Response upload(DiskFile diskFile, HttpServletRequest request,String name,Integer age);

	// 普通
	DeductTplVo getDeductById(Long tplId, Long id, HttpServletRequest request);
	// 下载
	void download(String fileName, HttpServletRequest request, HttpServletResponse response);

	Object uploadmulti(MultipartFormDataInput input);

	Response upload(DiskFileMulti diskFile);

}

