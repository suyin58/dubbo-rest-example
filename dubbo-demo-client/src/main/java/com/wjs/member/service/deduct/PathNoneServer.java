package com.wjs.member.service.deduct;

import java.util.List;

import com.wjs.common.dao.PageData;
import com.wjs.member.clientVo.deduct.DeductCurVo;
import com.wjs.member.qry.deduct.DeductCurQry;

/**
 * 抵用券操作和查询接口
 * @author albert.su suzy@wjs.com
 * @date 2016年10月20日 上午9:12:34 
 * 
 *
 */
public interface PathNoneServer {
	
	
	List<DeductCurVo> getUsableDeductCurrentsByCustId(String customerId);
	
	
	/**
	 * 分页查询
	 * @return
	 * @author albert.su suzy@wjs.com
	 * @date 2016年10月20日 上午9:16:08
	 */
	PageData<DeductCurVo> pageDeductCurrents(DeductCurQry qry);

	DeductCurVo getDeductById(Long deductId);
}
