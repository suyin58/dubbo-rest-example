package com.wjs.member.qry.system;

import com.wjs.member.qry.PageQry;

public class SysDictQry extends PageQry {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private Integer dictId;

	private String dictEntry;

	private String dictName;

	private String dictValue;

	private String dictStatus;

	private String remark;

	public Integer getDictId() {
		return dictId;
	}

	public void setDictId(Integer dictId) {
		this.dictId = dictId;
	}

	public String getDictEntry() {
		return dictEntry;
	}

	public void setDictEntry(String dictEntry) {
		this.dictEntry = dictEntry == null ? null : dictEntry.trim();
	}

	public String getDictName() {
		return dictName;
	}

	public void setDictName(String dictName) {
		this.dictName = dictName == null ? null : dictName.trim();
	}

	public String getDictValue() {
		return dictValue;
	}

	public void setDictValue(String dictValue) {
		this.dictValue = dictValue == null ? null : dictValue.trim();
	}

	public String getDictStatus() {
		return dictStatus;
	}

	public void setDictStatus(String dictStatus) {
		this.dictStatus = dictStatus == null ? null : dictStatus.trim();
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark == null ? null : remark.trim();
	}
}