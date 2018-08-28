/**
 * 
 */
package com.wjs.common.exception;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.wjs.common.config.ConfigUtil;


/**
 * 基本异常定义类
 * @author albert su suzy@wjs.com
 * @date 2015年9月15日 下午4:35:31 
 * 
 *
 */
public class BaseException extends RuntimeException {

	private static final long serialVersionUID = -6853310712844466349L;

	private static final Object[] EMPTY_PARAMS = new Object[0];

	private String exNo;
	private String exInfo;
	
	private JSONObject errData;

	private Object[] errorParams;

	private List<String> errorPropNames = new ArrayList<String>();

	private Map<String, Object> errorProperties = new HashMap<String, Object>();
	
	public BaseException(){
	    
	}

	public BaseException(String exNo) {
		if (StringUtils.isNotBlank(exNo)) {
			this.exNo = exNo;
			this.exInfo = ConfigUtil.get(exNo);
		}
	}
	
	public BaseException(String exNo, JSONObject errData){
		this.exNo = exNo;
		this.errData = errData;
	}

	public BaseException(String exNo, Object... errorParams) {
		this.exNo = exNo;
		this.exInfo = ConfigUtil.get(exNo);
		this.errorParams = errorParams;
		
		if(StringUtils.isNotBlank(exInfo)){
			if(exInfo.contains("{0}")){
				this.exInfo = MessageFormat.format(this.exInfo, this.errorParams);
			}else{
				if(errorParams != null && errorParams.length > 0){
					this.exInfo = errorParams[0].toString();
				}
			}
		}
	}
	
	public BaseException(Throwable e, String errorNo){
		super(e);
		this.exNo = errorNo;
	}


	public BaseException put(String name, Object prop) {

		if (name != null) {
			this.errorPropNames.add(name);
			this.errorProperties.put(name, prop);
		}
		return this;
	}

	public String getExNo() {

		return this.exNo;
	}

	@SuppressWarnings("unchecked")
	public Object[] getErrorParams() {

		Object[] errorParams = EMPTY_PARAMS;
		if (this.errorParams != null) {
			errorParams = this.errorParams;
		}
		if (this.errorPropNames.size() == 0) {
			return errorParams;
		}

		@SuppressWarnings("rawtypes")
		ArrayList params = new ArrayList(Arrays.asList(errorParams));

		for (String name : this.errorPropNames) {
			params.add(this.errorProperties.get(name));
		}
		return params.toArray();
	}

	public List<String> getErrorPropNames() {

		return this.errorPropNames;
	}

	public Map<String, Object> getErrorProperties() {

		return this.errorProperties;
	}

	public void setExNo(String exNo) {

		this.exNo = exNo;
	}

	public void setErrorParams(Object[] errorParams) {

		this.errorParams = errorParams;
		if (this.exInfo != null && this.errorParams != null && this.errorParams.length > 0) {
			this.exInfo = MessageFormat.format(this.exInfo, this.errorParams);
		}
	}

	public void setErrorPropNames(List<String> errorPropNames) {

		this.errorPropNames = errorPropNames;
	}

	public void setErrorProperties(Map<String, Object> errorProperties) {

		this.errorProperties = errorProperties;
	}
	
	public void setExInfo(String exInfo){
		this.exInfo = exInfo;
	}
	
	public String getExInfo(){
		return this.exInfo;
	}

	public String getMessage() {

		String message = super.getMessage();
		message = "[" + this.exNo + "]" + this.exInfo;
		if(StringUtils.isEmpty(this.exInfo)){
			StringBuilder sb = new StringBuilder();
			if (this.errorParams != null) {
				for (int i = 0; i < this.errorParams.length; ++i) {
					if (i == 0)
						sb.append(this.errorParams[i]);
					else {
						sb.append(", " + this.errorParams[i]);
					}
				}
				if ((this.errorParams.length > 0) && (this.errorPropNames.size() > 0)) {
					sb.append(", ");
				}
			}
			int errorPropSize = this.errorPropNames.size();
			for (int i = 0; i < errorPropSize; ++i) {
				String propName = (String) this.errorPropNames.get(i);
				Object propValue = this.errorProperties.get(propName);
				if (i == 0)
					sb.append(propName + "=" + propValue);
				else {
					sb.append(", " + propName + "=" + propValue);
				}
			}
			sb.append(" [" + this.exNo + "]");
			message = sb.toString();
		}
		return message;
	}

	public static void main(String[] args) {
		BaseException e = new BaseException("1", "2");
		System.out.println(e.getExInfo());
	}

	public JSONObject getErrData() {
		return errData;
	}

	public void setErrData(JSONObject errData) {
		this.errData = errData;
	}
}
