
/* 
* @author Silver
* @date 2016年5月4日 下午6:42:40 
* Copyright  ©2016 网金社
*/

package com.wjs.member.qry;

import java.io.Serializable;

import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;

/**
 * 分页查询专用
 * 默认查询 0~10条
 * @author Silver
 * @date 2016年5月4日 下午6:42:40 
 * 
 **/

public class PageQry implements Serializable{
	
	/** 
	* @Fields serialVersionUID : 
	*/
	
	private static final long serialVersionUID = 1L;
	/**
	 * 起始行
	 */
	private Long start;
	/**
	 * 每页行数
	 */
	private Integer limit;

	
	public Long getStart() {
	
		return start;
	}

	
	public void setStart(Long start) {
	
		this.start = start;
	}

	
	public Integer getLimit() {
	
		return limit;
	}

	
	public void setLimit(Integer limit) {
	
		this.limit = limit;
	}
	
	
}

