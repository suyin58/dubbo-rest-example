package com.wjs.member.qry.deduct;	
import java.math.BigDecimal;

import javax.ws.rs.FormParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

import com.wjs.member.qry.PageQry;

public class DeductTplQry extends PageQry {
	
	
	/** 
	* @Fields serialVersionUID : 
	*/
	
	private static final long serialVersionUID = 1L;
	@QueryParam("id")
	private Long id;
	@FormParam("deductTemplateId")
	private Long deductTemplateId;
	@PathParam("deductType")
	private String deductType;
	
	private String validable;
	
	private BigDecimal faceValueStart;
	
	private BigDecimal faceValueEnd;
	
	private BigDecimal investAmountStart;
	
	private BigDecimal investAmountEnd;
	

	
	/**
	 * 红包券加息年化利率 -- deduct_template.redcoupon_year_rate
	 * 
	 */
	private BigDecimal redcouponYearRate;

	/**
	 * 优惠券类型 -- deduct_template.coupon_type
	 * 
	 */
	private String couponType;

	
	/**
	 * @return the deductType
	 */
	
	public String getDeductType() {
	
		return deductType;
	}

	
	/**
	 * @param deductType the deductType to set
	 */
	
	public void setDeductType(String deductType) {
	
		this.deductType = deductType;
	}

	
	/**
	 * @return the faceValueStart
	 */
	
	public BigDecimal getFaceValueStart() {
	
		return faceValueStart;
	}

	
	/**
	 * @param faceValueStart the faceValueStart to set
	 */
	
	public void setFaceValueStart(BigDecimal faceValueStart) {
	
		this.faceValueStart = faceValueStart;
	}

	
	/**
	 * @return the faceValueEnd
	 */
	
	public BigDecimal getFaceValueEnd() {
	
		return faceValueEnd;
	}

	
	/**
	 * @param faceValueEnd the faceValueEnd to set
	 */
	
	public void setFaceValueEnd(BigDecimal faceValueEnd) {
	
		this.faceValueEnd = faceValueEnd;
	}

	
	/**
	 * @return the investAmountStart
	 */
	
	public BigDecimal getInvestAmountStart() {
	
		return investAmountStart;
	}

	
	/**
	 * @param investAmountStart the investAmountStart to set
	 */
	
	public void setInvestAmountStart(BigDecimal investAmountStart) {
	
		this.investAmountStart = investAmountStart;
	}

	
	/**
	 * @return the investAmountEnd
	 */
	
	public BigDecimal getInvestAmountEnd() {
	
		return investAmountEnd;
	}

	
	/**
	 * @param investAmountEnd the investAmountEnd to set
	 */
	
	public void setInvestAmountEnd(BigDecimal investAmountEnd) {
	
		this.investAmountEnd = investAmountEnd;
	}
	
	
	
	/* 
	 * @see java.lang.Object#toString()
	 */
	
	public String getValidable() {
		return validable;
	}


	public void setValidable(String validable) {
		this.validable = validable;
	}


	@Override
	public String toString() {
	
		return ReflectionToStringBuilder.toString(this);
	}


	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}

	/**
	 * @return the deductTemplateId
	 */

	public Long getDeductTemplateId() {

		return deductTemplateId;
	}

	/**
	 * @param deductTemplateId the deductTemplateId to set
	 */

	public void setDeductTemplateId(Long deductTemplateId) {

		this.deductTemplateId = deductTemplateId;
	}

	public BigDecimal getRedcouponYearRate() {

		return redcouponYearRate;
	}

	public void setRedcouponYearRate(BigDecimal redcouponYearRate) {

		this.redcouponYearRate = redcouponYearRate;
	}

	public String getCouponType() {

		return couponType;
	}

	public void setCouponType(String couponType) {

		this.couponType = couponType;
	}

}

