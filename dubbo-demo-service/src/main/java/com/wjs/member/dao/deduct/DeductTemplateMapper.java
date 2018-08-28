package com.wjs.member.dao.deduct;	
import java.util.List;

import com.wjs.common.dao.PageData;
import com.wjs.member.clientVo.deduct.DeductTplVo;
import com.wjs.member.qry.deduct.DeductTplQry;


public interface DeductTemplateMapper {

	DeductTplVo selectById(Long id);
	
	List<DeductTplVo> selectByExample(DeductTplQry qry);

	PageData<DeductTplVo> pageByExample(DeductTplQry qry);
	
	

}

