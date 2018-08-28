package com.wjs.member.enums.deduct;

public enum DeductStatus {

	UNACTIVATED("UNACTIVATED", "未激活")
	, ACTIVATED("ACTIVATED", "已激活")
	, USED("USED", "已使用")
	, OVERDUE("OVERDUE", "已过期");

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
	DeductStatus(String status, String description) {
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

		return fromValue(status).getDescription();

	}

	/**
	 * 
	 * 从值转换
	 * 
	 * @param input
	 * @return
	 * @author wangzh
	 * @date 2016年9月28日 上午8:16:52
	 */
	public static DeductStatus fromValue(String input) {

		for (DeductStatus item : DeductStatus.values()) {
			if (item.status.equals(input))
				return item;
		}
		return null;
	}

}
