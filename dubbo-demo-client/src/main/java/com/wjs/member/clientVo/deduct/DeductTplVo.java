package com.wjs.member.clientVo.deduct;	
import java.io.Serializable;
import java.math.BigDecimal;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

public class DeductTplVo  implements Serializable{

	   /**
     * 标准ID -- deduct_template.id
     * 创建时间 : 2016-10-20 22:23:58
     */
    private Long id;

    /**
     * 抵用券类型 -- deduct_template.deduct_type
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String deductType;

    /**
     * 抵用券标题 -- deduct_template.deduct_title
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String deductTitle;

    /**
     * 抵用券说明 -- deduct_template.deduct_content
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String deductContent;

    /**
     * 抵用券产品类型 -- deduct_template.deduct_prod_type
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String deductProdType;

    /**
     * 抵用券能使用的产品系列编号 -- deduct_template.deduct_prod_sn
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String deductProdSn;

    /**
     * 抵用券产品期限限制 -- deduct_template.deduct_prod_tern_limt_min
     * 创建时间 : 2016-10-20 22:23:58
     */
    private Integer deductProdTernLimtMin;

    /**
     * 面值 -- deduct_template.face_value
     * 创建时间 : 2016-10-20 22:23:58
     */
    private BigDecimal faceValue;

    /**
     * 起投限制 -- deduct_template.min_invest_amount
     * 创建时间 : 2016-10-20 22:23:58
     */
    private BigDecimal minInvestAmount;

    /**
     * 起效时间类型 -- deduct_template.valid_time_type
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String validTimeType;

    /**
     * 有效开始时间 -- deduct_template.valid_start_datetime
     * 创建时间 : 2016-10-20 22:23:58
     */
    private Long validStartDatetime;
    
    private String validStartDatetimeDesc;

    /**
     * 有效结束时间 -- deduct_template.valid_end_datetime
     * 创建时间 : 2016-10-20 22:23:58
     */
    private Long validEndDatetime;
    

    private String validEndDateDesc;

    /**
     * 期限 -- deduct_template.term
     * 创建时间 : 2016-10-20 22:23:58
     */
    private Integer term;

    /**
     * 使用终端 -- deduct_template.usable_client
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String usableClient;

    /**
     * 获得渠道（来源） -- deduct_template.deduct_source
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String deductSource;

    /**
     * 备注 -- deduct_template.remark
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String remark;

    /**
     * 是否有效 -- deduct_template.validable
     * 创建时间 : 2016-10-20 22:23:58
     */
    private String validable;

    /**
     * 创建时间戳 -- deduct_template.create_datetime
     * 创建时间 : 2016-10-20 22:23:58
     */
    private Long createDatetime;

	
	public Long getId() {
	
		return id;
	}

	
	public void setId(Long id) {
	
		this.id = id;
	}

	
	public String getDeductType() {
	
		return deductType;
	}

	
	public void setDeductType(String deductType) {
	
		this.deductType = deductType;
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

	
	public BigDecimal getFaceValue() {
	
		return faceValue;
	}

	
	public void setFaceValue(BigDecimal faceValue) {
	
		this.faceValue = faceValue;
	}

	
	public BigDecimal getMinInvestAmount() {
	
		return minInvestAmount;
	}

	
	public void setMinInvestAmount(BigDecimal minInvestAmount) {
	
		this.minInvestAmount = minInvestAmount;
	}

	
	public String getValidTimeType() {
	
		return validTimeType;
	}

	
	public void setValidTimeType(String validTimeType) {
	
		this.validTimeType = validTimeType;
	}

	
	public Long getValidStartDatetime() {
	
		return validStartDatetime;
	}

	
	public void setValidStartDatetime(Long validStartDatetime) {
	
		this.validStartDatetime = validStartDatetime;
	}

	
	public String getValidStartDatetimeDesc() {
	
		return validStartDatetimeDesc;
	}

	
	public void setValidStartDatetimeDesc(String validStartDatetimeDesc) {
	
		this.validStartDatetimeDesc = validStartDatetimeDesc;
	}

	
	public Long getValidEndDatetime() {
	
		return validEndDatetime;
	}

	
	public void setValidEndDatetime(Long validEndDatetime) {
	
		this.validEndDatetime = validEndDatetime;
	}

	
	public String getValidEndDateDesc() {
	
		return validEndDateDesc;
	}

	
	public void setValidEndDateDesc(String validEndDateDesc) {
	
		this.validEndDateDesc = validEndDateDesc;
	}

	
	public Integer getTerm() {
	
		return term;
	}

	
	public void setTerm(Integer term) {
	
		this.term = term;
	}

	
	public String getUsableClient() {
	
		return usableClient;
	}

	
	public void setUsableClient(String usableClient) {
	
		this.usableClient = usableClient;
	}

	
	public String getDeductSource() {
	
		return deductSource;
	}

	
	public void setDeductSource(String deductSource) {
	
		this.deductSource = deductSource;
	}

	
	public String getRemark() {
	
		return remark;
	}

	
	public void setRemark(String remark) {
	
		this.remark = remark;
	}

	
	public String getValidable() {
	
		return validable;
	}

	
	public void setValidable(String validable) {
	
		this.validable = validable;
	}

	
	public Long getCreateDatetime() {
	
		return createDatetime;
	}

	
	public void setCreateDatetime(Long createDatetime) {
	
		this.createDatetime = createDatetime;
	}

    
    @Override
    public String toString() {
    
    	
    	return ReflectionToStringBuilder.toString(this);
    }
}

