package com.wjs.member.service.wrap;

import java.util.List;
import java.util.Map;

import com.wjs.common.web.JsonResult;
import com.wjs.member.clientVo.deduct.DeductCurVo;

public interface ResultWrapService {

	
	
	public void testVoid();
	
	public DeductCurVo testException()throws Exception;
	
	public DeductCurVo testRuntimeException();
	
	public DeductCurVo nullReturn();
	
	public Integer IntReturn();
	
	public DeductCurVo objReturn();
	
	public List<DeductCurVo> listReturn();
	
	public Map<String,List<DeductCurVo>> mapReturn();
	
	public JsonResult<Object> objMapReturn();
}

