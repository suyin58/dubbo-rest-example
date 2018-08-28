package com.wjs.member.dao.deduct.impl;	
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.wjs.common.dao.PageData;
import com.wjs.member.clientVo.deduct.DeductTplVo;
import com.wjs.member.dao.deduct.DeductTemplateMapper;
import com.wjs.member.qry.deduct.DeductTplQry;

@Service("deductTemplateMapper")
public class DeductTemplateMapperImpl implements DeductTemplateMapper {

	private static final Logger LOGGER = LoggerFactory.getLogger(DeductTemplateMapperImpl.class);

	@Override
	public DeductTplVo selectById(Long id) {

		DeductTplVo vo = new DeductTplVo();
		for (long i = 0; i <5; i++) {
			
			if(id.equals(i)){
				vo.setDeductContent("抵用券内容");
				vo.setDeductProdSn("sn" + i);
				vo.setDeductProdType("类型");
				vo.setDeductTitle("标--题");
				vo.setDeductType("类型");
				vo.setFaceValue(new BigDecimal(100*i));
				vo.setId(i);
			}
		}	
		return vo;
			
	}

	@Override
	public List<DeductTplVo> selectByExample(DeductTplQry qry) {

		List<DeductTplVo> list = new ArrayList<DeductTplVo>();
		list.add(selectById(4L));

		list.add(selectById(2L));

		list.add(selectById(1L));
		list.add(selectById(3L));

		list.add(selectById(0L));
		return list;
	}

	@Override
	public PageData<DeductTplVo> pageByExample(DeductTplQry qry) {

		PageData<DeductTplVo> page = new PageData<DeductTplVo>();
		page.setPage(1);
		page.setPageSize(10);
		page.setRows(selectByExample(new DeductTplQry()));
		page.setTotal(99);
		
		return page;
	}

}

