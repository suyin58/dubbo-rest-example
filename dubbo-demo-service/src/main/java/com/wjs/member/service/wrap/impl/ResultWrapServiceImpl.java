package com.wjs.member.service.wrap.impl;	
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjs.common.exception.BaseException;
import com.wjs.common.web.JsonResult;
import com.wjs.member.clientVo.deduct.DeductCurVo;
import com.wjs.member.dao.deduct.DeductCurrentsMapper;
import com.wjs.member.service.wrap.ResultWrapService;

@Path("wrap")
@Service("resultWrapService")
public class ResultWrapServiceImpl implements ResultWrapService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ResultWrapServiceImpl.class);

	@Autowired
	DeductCurrentsMapper deductCurrentsMapper;
	
	@GET
    @Path("/void")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public void testVoid() {

		System.out.println("进入void业务方法");
	}

	
	@GET
    @Path("/exception")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public DeductCurVo testException() throws Exception {


		System.out.println("进入异常方法");
		throw new Exception("异常");
	}

	
	@GET
    @Path("/runtimeex")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public DeductCurVo testRuntimeException() {


		System.out.println("进入运行时异常方法");
		Map<String, String> errData = new HashMap<String, String>();
		errData.put("err1", "error data occur");
		errData.put("errcode", "100000");
		throw new BaseException("运行时异常", errData);
	}

	@GET
    @Path("/nullreturn")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public DeductCurVo nullReturn() {


		System.out.println("进入空值返回方法");
		return null;
	}

	@GET
    @Path("/intreturn")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public Integer IntReturn() {

//		org.codehaus.jackson.jaxrs.JacksonJaxbJsonProvider
		return 100;
	}

	@GET
    @Path("/objreturn")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public DeductCurVo objReturn() {

		
		return deductCurrentsMapper.selectByPrimaryKey(1L);
	}

	@GET
    @Path("/listreturn")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public List<DeductCurVo> listReturn() {

		
		return deductCurrentsMapper.selectByCustomerId("1");
	}

	@GET
    @Path("/mapreturn")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public Map<String, List<DeductCurVo>> mapReturn() {

		Map<String, List<DeductCurVo>> map = new HashMap<String, List<DeductCurVo>>();
		map.put("map_key1", deductCurrentsMapper.selectByCustomerId("1"));
		map.put("map_key2", deductCurrentsMapper.selectByCustomerId("1"));
		
		return map;
	}
	
	@GET
    @Path("/objmapreturn")
    @Produces("application/json; charset=UTF-8") 
	@Override
	public JsonResult<Object> objMapReturn() {

		JsonResult<Object> rtn = new JsonResult<>(true, "成功");
		Map<String, List<DeductCurVo>> map = new HashMap<String, List<DeductCurVo>>();
		map.put("map_key1", deductCurrentsMapper.selectByCustomerId("1"));
		map.put("map_key2", deductCurrentsMapper.selectByCustomerId("1"));
		rtn.setData(map);
		return rtn;
	}

}

