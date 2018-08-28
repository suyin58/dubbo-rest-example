package com.wjs.member.qry.system;

import com.wjs.member.qry.PageQry;

public class SysConfigQry extends PageQry{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String configNo;

	private String configName;

	private String configValue;
	
	private String configType;

	private String remark;

	public String getConfigNo() {
		return configNo;
	}

	public void setConfigNo(String configNo) {
		this.configNo = configNo;
	}

	public String getConfigName() {
		return configName;
	}

	public void setConfigName(String configName) {
		this.configName = configName;
	}

	public String getConfigValue() {
		return configValue;
	}

	public void setConfigValue(String configValue) {
		this.configValue = configValue;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getConfigType() {
		return configType;
	}

	public void setConfigType(String configType) {
		this.configType = configType;
	}

}