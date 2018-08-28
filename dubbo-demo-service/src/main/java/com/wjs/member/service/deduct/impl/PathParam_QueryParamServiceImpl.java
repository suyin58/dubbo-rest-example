package com.wjs.member.service.deduct.impl;	
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjs.common.exception.BaseException;
import com.wjs.member.clientVo.deduct.DeductCurVo;
import com.wjs.member.dao.deduct.DeductCurrentsMapper;
import com.wjs.member.service.deduct.PathParam_QueryParamService;

@Path("") // 不对外暴露rest的话，也需要增加@Path注解，否则启动过程中由于源码的处理逻辑，或报错。
@Produces("application/json; charset=UTF-8")
@Service("pathParam_QueryParamService")
public class PathParam_QueryParamServiceImpl implements PathParam_QueryParamService {

	private static final Logger LOGGER = LoggerFactory.getLogger(PathParam_QueryParamServiceImpl.class);
	
	@Autowired 
	DeductCurrentsMapper deductCurrentsMapper;
	
	
	@GET
    @Path("/getbyid/{customerId}")
	@Override
	public DeductCurVo getDeductCurrentByCustId(@PathParam("customerId")String customerId) throws BaseException {
		
		System.err.println("PathParam_customerId:" + customerId);
		return deductCurrentsMapper.selectByPrimaryKey(1L);
	}

	@GET
    @Path("/getbytplid")
	@Override
	public DeductCurVo getDeductCurrentByTemplateId(@QueryParam("deductTemplateId")Long deductTemplateId) throws BaseException {


		System.err.println("QueryParam_deductTemplateId:" + deductTemplateId);
		return deductCurrentsMapper.selectByPrimaryKey(1L);
	}

	@GET
    @Path("/getbymix/{customerId}")
	@Override
	public DeductCurVo getDeductCurrentByCustIdAndTemplateId(@PathParam("customerId")String customerId, @QueryParam("deductTemplateId")Long deductTemplateId) throws BaseException {

		System.err.println("PathParam_customerId:" + customerId);
		System.err.println("QueryParam_deductTemplateId:" + deductTemplateId);
		
		return deductCurrentsMapper.selectByPrimaryKey(1L);
	}


}

