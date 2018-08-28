package com.wjs.common.web;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

/**
 * 服务返回给客户端的json对象包装
 */
public class JsonResult<T> {

	private boolean success = false;

	private String resultMsg = "";

	private T data = null;

	public JsonResult(boolean status, String resultMsg) {
		this.success = status;
		this.resultMsg = resultMsg;
	}

	public JsonResult(boolean status, String resultMsg, T data) {
		this.success = status;
		this.resultMsg = resultMsg;
		this.data = data;
	}

	
	
	public boolean isSuccess() {
	
		return success;
	}

	
	public void setSuccess(boolean success) {
	
		this.success = success;
	}

	
	public String getResultMsg() {
	
		return resultMsg;
	}

	
	public void setResultMsg(String resultMsg) {
	
		this.resultMsg = resultMsg;
	}

	
	public T getData() {
	
		return data;
	}

	
	public void setData(T data) {
	
		this.data = data;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this);
	}
}
