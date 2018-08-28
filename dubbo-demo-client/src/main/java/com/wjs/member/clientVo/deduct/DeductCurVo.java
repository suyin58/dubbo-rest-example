package com.wjs.member.clientVo.deduct;

import java.io.Serializable;
import java.math.BigDecimal;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

public class DeductCurVo implements Serializable {

	
	/** 
	* @Fields serialVersionUID : 
	*/
	
	private static final long serialVersionUID = 7570997681265090459L;

	/**
	 * ID
	 */
	private Long id;

	/**
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String customerId;

	/**
	 * 抵用券产品类型
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String deductProdType;

	/**
	 * 抵用券能使用的产品系列编号
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String deductProdSn;

	/**
	 * 抵用券产品期限限制
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private Integer deductProdTernLimtMin;

	/**
	 * 抵用券类型
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String deductType;

	/**
	 * 抵用券模板ID
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private Long deductTemplateId;

	/**
	 * 抵用券标题
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String deductTitle;

	/**
	 * 抵用券说明
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String deductContent;

	/**
	 * 抵用券编号（用于显示）
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private String deductSn;

	/**
	 * 面值
	 * 创建时间 : 2016-10-20 22:23:58
	 */
	private BigDecimal faceValue;
	
	

	
	public Long getId() {
	
		return id;
	}



	
	public void setId(Long id) {
	
		this.id = id;
	}



	
	public String getCustomerId() {
	
		return customerId;
	}



	
	public void setCustomerId(String customerId) {
	
		this.customerId = customerId;
	}



	
	public String getDeductProdType() {
	
		return deductProdType;
	}



	
	public void setDeductProdType(String deductProdType) {
	
		this.deductProdType = deductProdType;
	}



	
	public String getDeductProdSn() {
	
		return deductProdSn;
	}



	
	public void setDeductProdSn(String deductProdSn) {
	
		this.deductProdSn = deductProdSn;
	}



	
	public Integer getDeductProdTernLimtMin() {
	
		return deductProdTernLimtMin;
	}



	
	public void setDeductProdTernLimtMin(Integer deductProdTernLimtMin) {
	
		this.deductProdTernLimtMin = deductProdTernLimtMin;
	}



	
	public String getDeductType() {
	
		return deductType;
	}



	
	public void setDeductType(String deductType) {
	
		this.deductType = deductType;
	}



	
	public Long getDeductTemplateId() {
	
		return deductTemplateId;
	}



	
	public void setDeductTemplateId(Long deductTemplateId) {
	
		this.deductTemplateId = deductTemplateId;
	}



	
	public String getDeductTitle() {
	
		return deductTitle;
	}



	
	public void setDeductTitle(String deductTitle) {
	
		this.deductTitle = deductTitle;
	}



	
	public String getDeductContent() {
	
		return deductContent;
	}



	
	public void setDeductContent(String deductContent) {
	
		this.deductContent = deductContent;
	}



	
	public String getDeductSn() {
	
		return deductSn;
	}



	
	public void setDeductSn(String deductSn) {
	
		this.deductSn = deductSn;
	}



	
	public BigDecimal getFaceValue() {
	
		return faceValue;
	}



	
	public void setFaceValue(BigDecimal faceValue) {
	
		this.faceValue = faceValue;
	}



	public String toString() {

		return ReflectionToStringBuilder.toString(this);
	}


}
