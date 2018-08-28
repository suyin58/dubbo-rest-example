package com.wjs.member.service.deduct;

import java.util.List;

import com.wjs.common.dao.PageData;
import com.wjs.member.clientVo.deduct.DeductTplVo;
import com.wjs.member.qry.deduct.DeductTplQry;

/**
 * 抵用券模板管理接口
 * 
 * @author albert.su suzy@wjs.com
 * @date 2016年10月20日 上午9:14:08
 * 
 *
 */
public interface QueryParam_FromParamService {

	/**
	 * 分页查询模板
	 * 
	 * @param qry
	 * @return
	 * @author Silver
	 * @date 2016年10月26日 下午9:13:03
	 */

	PageData<DeductTplVo> pageListTemplate(DeductTplQry qry);

	
	DeductTplVo getDeductById(Long tplId, Long id);


}
