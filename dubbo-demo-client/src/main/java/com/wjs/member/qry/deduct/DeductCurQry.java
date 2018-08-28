package com.wjs.member.qry.deduct;	
import java.math.BigDecimal;

import com.wjs.member.enums.deduct.DeductStatus;
import com.wjs.member.qry.PageQry;

public class DeductCurQry extends PageQry {


	
	
	/** 
	* @Fields serialVersionUID : 
	*/
	
	private static final long serialVersionUID = 1L;

	/**
	 * 客户号
	 */
	private String customerId;
	
	/**
	 * 投资金额
	 */
	private BigDecimal investAmount;
	
	/**
	 * 产品序列号
	 */
	private String deductProdSn;

    /**
     * 抵用券产品期限
     */
    private Integer term;
    
    /**
     * 抵用券状态
     */
    private DeductStatus deductStatus;
    
    /**
     * 终端类型
     */
    private Integer userFrom;
    
    private String deductType;

    private boolean changeQryFlag;
    
    private String searchType;
    
    private Long startRequestDate; //开始时间
	
	private Long endRequestDate;   //结束时间
	
	private Long usedDatetime;//使用时间
	
	private Long validEndDatetime;//有效截止时间
	
	private Long nowTime = 0l; //当前时间
	
	private String productCode;
	
    private Long startUsedDate; //使用开始时间（查询用）
	
	private Long endUsedDate;   //使用结束时间（查询用）
	
	private String deductSn;
	
	private Long deductTemplateId;
	
	/**
	 * 红包券加息年化利率 -- deduct_currents.redcoupon_year_rate
	 * 
	 */
	private BigDecimal redcouponYearRate;

	/**
	 * 优惠券类型 -- deduct_currents.coupon_type
	 * 
	 */
	private String couponType;

	private String orderByClause;
	
	public Long getNowTime() {
		return nowTime;
	}

	public void setNowTime(Long nowTime) {
		this.nowTime = nowTime;
	}

	public boolean isChangeQryFlag() {
		return changeQryFlag;
	}

	public void setChangeQryFlag(boolean changeQryFlag) {
		this.changeQryFlag = changeQryFlag;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public BigDecimal getInvestAmount() {
		return investAmount;
	}

	public void setInvestAmount(BigDecimal investAmount) {
		this.investAmount = investAmount;
	}

	public String getDeductProdSn() {
		return deductProdSn;
	}

	public void setDeductProdSn(String deductProdSn) {
		this.deductProdSn = deductProdSn;
	}

	public Integer getTerm() {
		return term;
	}

	public void setTerm(Integer term) {
		this.term = term;
	}

	public DeductStatus getDeductStatus() {
		return deductStatus;
	}

	public void setDeductStatus(DeductStatus deductStatus) {
		this.deductStatus = deductStatus;
	}

	public Integer getUserFrom() {
	
		return userFrom;
	}

	public void setUserFrom(Integer userFrom) {
	
		this.userFrom = userFrom;
	}

	public Long getStartRequestDate() {
		return startRequestDate;
	}

	public void setStartRequestDate(Long startRequestDate) {
		this.startRequestDate = startRequestDate;
	}

	public Long getEndRequestDate() {
		return endRequestDate;
	}

	public void setEndRequestDate(Long endRequestDate) {
		this.endRequestDate = endRequestDate;
	}

	public String getDeductType() {
		return deductType;
	}

	public void setDeductType(String deductType) {
		this.deductType = deductType;
	}

	public Long getUsedDatetime() {

		return usedDatetime;
	}

	public void setUsedDatetime(Long usedDatetime) {

		this.usedDatetime = usedDatetime;
	}

	public Long getValidEndDatetime() {

		return validEndDatetime;
	}

	
	public String getSearchType() {
		return searchType;
	}

	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}

	public void setValidEndDatetime(Long validEndDatetime) {

		this.validEndDatetime = validEndDatetime;
	}

	
	public String getProductCode() {
	
		return productCode;
	}

	
	public void setProductCode(String productCode) {
	
		this.productCode = productCode;
	}

	
	public Long getStartUsedDate() {
	
		return startUsedDate;
	}

	
	public void setStartUsedDate(Long startUsedDate) {
	
		this.startUsedDate = startUsedDate;
	}

	
	public Long getEndUsedDate() {
	
		return endUsedDate;
	}

	
	public void setEndUsedDate(Long endUsedDate) {
	
		this.endUsedDate = endUsedDate;
	}

	public String getDeductSn() {

		return deductSn;
	}

	public void setDeductSn(String deductSn) {

		this.deductSn = deductSn;
	}

	public Long getDeductTemplateId() {

		return deductTemplateId;
	}

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

	public String getOrderByClause() {
		return orderByClause;
	}

	public void setOrderByClause(String orderByClause) {
		this.orderByClause = orderByClause;
	}
}

