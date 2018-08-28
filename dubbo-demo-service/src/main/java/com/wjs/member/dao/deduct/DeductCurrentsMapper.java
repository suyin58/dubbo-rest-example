package com.wjs.member.dao.deduct;

import java.util.List;

import com.wjs.common.dao.PageData;
import com.wjs.member.clientVo.deduct.DeductCurVo;
import com.wjs.member.qry.deduct.DeductCurQry;

public interface DeductCurrentsMapper {

	DeductCurVo selectByPrimaryKey(Long deductId);

	PageData<DeductCurVo> pageByExample(DeductCurQry qry);

	List<DeductCurVo> selectByCustomerId(String customerId);


}

