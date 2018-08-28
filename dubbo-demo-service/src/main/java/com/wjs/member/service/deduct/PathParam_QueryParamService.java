package com.wjs.member.service.deduct;

import java.util.List;

import com.wjs.common.exception.BaseException;
import com.wjs.member.clientVo.deduct.DeductCurVo;

public interface PathParam_QueryParamService {

	DeductCurVo getDeductCurrentByCustId(String customerId) throws BaseException;
	
	DeductCurVo getDeductCurrentByTemplateId(Long deductTemplateId) throws BaseException;
	
	DeductCurVo getDeductCurrentByCustIdAndTemplateId(String customerId , Long deductTemplateId) throws BaseException;
	
}
