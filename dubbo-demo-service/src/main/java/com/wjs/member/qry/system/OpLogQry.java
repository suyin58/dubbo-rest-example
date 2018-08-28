package com.wjs.member.qry.system;

import com.wjs.member.qry.PageQry;

public class OpLogQry extends PageQry {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long startOpDate;
	private long endOpDate;
	private Integer operId;

	public long getStartOpDate() {
		return startOpDate;
	}

	public void setStartOpDate(long startOpDate) {
		this.startOpDate = startOpDate;
	}

	public long getEndOpDate() {
		return endOpDate;
	}

	public void setEndOpDate(long endOpDate) {
		this.endOpDate = endOpDate;
	}

	public Integer getOperId() {
		return operId;
	}

	public void setOperId(Integer operId) {
		this.operId = operId;
	}

}
