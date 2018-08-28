package com.wjs.member.enums.deduct;


public enum DeductType {



	REGIEST_NEW("REGIEST_NEW", "新用户注册"),
	REGIEST_OLD("REGIEST_OLD", "老用户注册"),
	REGIEST_RECOMEND("REGIEST_RECOMEND", "被推荐新用户"),
	INVEST("INVEST", "投资产品赠送"),
	TO_WEAKUP("TO_WEAKUP", "待唤醒用户发放抵用券"),
	CUST_LEVELUP("CUST_LEVELUP", "用户等级上调抵用券"),
	CUST_LEVELDOWN("CUST_LEVELDOWN", "用户等级下调抵用券"),
	ACTIVITY("ACTIVITY", "活动抵用券"),
	POINT_SHOP("POINT_SHOP", "积分商城抵用券"),
	REDEEM("REDEEM", "回款复投"),
	BIND_CARD("BIND_CARD","绑定银行卡"),
	DING_TALK("DING_TALK","钉钉福利社"),
	ONE_WEEK_NOT_INV("ONE_WEEK_NOT_INV","新手一周未投资"),
	TWO_WEEK_NOT_INV("TWO_WEEK_NOT_INV","新手两周未投资"),
	THREE_WEEK_NOT_INV("THREE_WEEK_NOT_INV","新手三周未投资"),
	LIFE_CYCLE("LIFE_CYCLE","生命周期券"), // 用户生命周期内发放的优惠券类型
	CUST_BIRTHDAY("CUST_BIRTHDAY","生日礼包");
	
	/**
	 * 状态
	 */
	private final String status;

	/**
	 * 描述
	 */
	private final String description;
	
	
	/**
	 * 构造器默认也只能是private, 从而保证构造函数只能在内部使用
	 * 
	 * @param status
	 * @param description
	 */
	DeductType(String status, String description) {
		this.status = status;
		this.description = description;
	}
	
	/**
	 * 获取枚举值
	 */
	public String getStatus() {

		return status;
	}
	
	/**
	 * 枚举描述
	 */
	public String getDescription() {

		return description;
	}
	
	/**
	 * 枚举描述
	 */
	public static String getDescription(String status) {
		
		DeductType type = fromValue(status);
		if(type == null){
			return "";
		}
		return type.getDescription();

	}
	
	/**
	 * 
	 * 从值转换
	 * @param input
	 * @return
	 * @author wangzh 
	 * @date 2016年9月28日 上午8:16:52
	 */
	public static DeductType fromValue(String input) {

		for (DeductType item : DeductType.values()) {
			if (item.status.equals(input))
				return item;
		}
		return null;
	}


}
