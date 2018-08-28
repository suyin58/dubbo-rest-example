package com.wjs.member.qry.system;

import com.wjs.member.qry.PageQry;

public class OperatorsQry extends PageQry {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long operId;

	private String belongType;
	private String orgName;
	private String operCode;
	private String operStatus;
	private String operType;

	public Long getOperId() {
		return operId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public void setOperId(Long operId) {
		this.operId = operId;
	}

	public String getOperCode() {
		return operCode;
	}

	public void setOperCode(String operCode) {
		this.operCode = operCode;
	}

	public String getOperStatus() {
		return operStatus;
	}

	public void setOperStatus(String operStatus) {
		this.operStatus = operStatus;
	}

	public String getOperType() {
		return operType;
	}

	public void setOperType(String operType) {
		this.operType = operType;
	}

	public String getBelongType() {
		return belongType;
	}

	public void setBelongType(String belongType) {
		this.belongType = belongType;
	}

}
