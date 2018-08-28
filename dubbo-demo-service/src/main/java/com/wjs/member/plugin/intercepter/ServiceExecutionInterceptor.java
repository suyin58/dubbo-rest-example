
/* 
* @author Silver
* @date 2016年5月13日 上午9:53:02 
* Copyright  ©2016 网金社
*/

package com.wjs.member.plugin.intercepter;	
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.ThrowsAdvice;

import com.wjs.common.exception.BaseException;



/**
 * @author Silver
 * @date 2016年5月13日 上午9:53:02 
 * 
 **/

public class ServiceExecutionInterceptor  implements ThrowsAdvice  {

	private static final Logger LOGGER = LoggerFactory.getLogger(ServiceExecutionInterceptor.class);
	private static Map<String, String> errMsgMap = new ConcurrentHashMap<String, String>();
	
	public void afterThrowing(Exception e) throws Throwable {
		if(e instanceof BaseException){
			BaseException ex = (BaseException)e;
			if(StringUtils.isEmpty(ex.getMessage())){
				String errorMessage = "";
				
				if(errMsgMap.containsKey(ex.getExNo())){
					errorMessage = errMsgMap.get(ex.getExNo());
				}else{
					errorMessage = "出错啦";
					errMsgMap.put(ex.getExNo(), errorMessage);
				}
				
				if(null != ex.getExInfo() ){
					ex.setExInfo(String.valueOf(ex.getExNo()));
				}
				
				LOGGER.error("业务异常", ex);
			}
		}else{
			LOGGER.error("未知异常", e);
		}
	}
	
}

