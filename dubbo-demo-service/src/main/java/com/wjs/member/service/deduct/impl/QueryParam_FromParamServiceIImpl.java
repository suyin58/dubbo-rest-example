
/* 
* @author Silver
* @date 2016年10月26日 下午9:16:33 
* Copyright  ©2016 网金社
*/

package com.wjs.member.service.deduct.impl;

import java.util.List;

import javax.ws.rs.BeanParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjs.common.dao.PageData;
import com.wjs.member.clientVo.deduct.DeductTplVo;
import com.wjs.member.dao.deduct.DeductTemplateMapper;
import com.wjs.member.qry.deduct.DeductTplQry;
import com.wjs.member.service.deduct.QueryParam_FromParamService;

/**
 * 抵用券模板实现类
 *
 * @author Silver
 * @date 2016年10月26日 下午9:16:33
 **/
@Path("deductTpl")
@Service("queryParam_FromParamService")
public class QueryParam_FromParamServiceIImpl implements QueryParam_FromParamService {

	private static final Logger LOGGER = LoggerFactory.getLogger(QueryParam_FromParamServiceIImpl.class);

	@Autowired
	private DeductTemplateMapper deductTemplateMapper;


	
	

	@POST
    @Path("/listform/{deductType}")
    @Produces("application/json; charset=UTF-8")
	@Override
//	@ResultWrapper
	public PageData<DeductTplVo> pageListTemplate(@BeanParam DeductTplQry qry) {
		System.out.println("进入业务处理方法");
//		@QueryParam("id")
//		private Long id;
//		@FormParam("deductTemplateId")
//		private Long deductTemplateId;
//		@PathParam("deductType")
//		private String deductType;
		System.err.println("BeanParam_QueryParam_id:" + qry.getId());
		System.err.println("BeanParam_FormParam_tplId:" + qry.getDeductTemplateId());
		System.err.println("BeanParam_PathParam_type:" + qry.getDeductType());

		return deductTemplateMapper.pageByExample(qry);
	}
	

	@POST
    @Path("/list")
    @Produces("application/json; charset=UTF-8") // {MediaType.APPLICATION_JSON,}
	@Override
	public DeductTplVo getDeductById(@FormParam("tplId")Long tplId,@FormParam("id") Long id){
		
		System.err.println("FormParam_tplId:" + tplId);
		System.err.println("FormParam_id:" + id);
		DeductTplQry qry = new DeductTplQry();
		qry.setId(tplId);
		qry.setDeductTemplateId(id);
		
		List<DeductTplVo> list = deductTemplateMapper.selectByExample(qry);
		if(CollectionUtils.isNotEmpty(list)){
			return  list.get(0);		
		}
		return null;
		
	}


}
