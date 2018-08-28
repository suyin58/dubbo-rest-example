
/* 
* @author Silver
* @date 2016年6月6日 下午2:20:55 
* Copyright  ©2016 网金社
*/

package com.wjs.common.filter;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import com.alibaba.dubbo.rpc.Filter;
import com.alibaba.dubbo.rpc.Invocation;
import com.alibaba.dubbo.rpc.Invoker;
import com.alibaba.dubbo.rpc.Result;
import com.alibaba.dubbo.rpc.RpcContext;
import com.alibaba.dubbo.rpc.RpcException;
import com.wjs.common.log.LogMDCConstant;

/**
 * dubbo服务调用拦截
 * 
 * @author Silver
 * @date 2016年6月6日 下午2:20:55
 * 
 **/

public class DubboInvokeFilter implements Filter {

	private static final Logger LOGGER = LoggerFactory.getLogger(DubboInvokeFilter.class);

	public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {

		RpcContext context = RpcContext.getContext();
		// 获取消息调用过程中的唯一标识符，用于跟踪
		if(context.isProviderSide()){
			// 提供方
			String contextUUID = invocation.getAttachments().get(LogMDCConstant.CONTEXT_UUID);
			if(StringUtils.isNotEmpty(contextUUID)){
				MDC.put(LogMDCConstant.CONTEXT_UUID, contextUUID);
			}
			
			String userId = invocation.getAttachments().get(LogMDCConstant.USER_ID); 
			if(StringUtils.isNotEmpty(userId)){
				MDC.put(LogMDCConstant.USER_ID, userId);
			}
			
			String hostName = invocation.getAttachments().get(LogMDCConstant.HOST_NAME); 
			if(StringUtils.isNotEmpty(hostName)){
				MDC.put(LogMDCConstant.HOST_NAME, hostName);
			}
			
			String sessionId = invocation.getAttachments().get(LogMDCConstant.SESSION_ID); 
			if(StringUtils.isNotEmpty(sessionId)){
				MDC.put(LogMDCConstant.SESSION_ID, sessionId);
			}
			
		}else if(context.isConsumerSide()){
			// 消费方
			String contextUUID = MDC.get(LogMDCConstant.CONTEXT_UUID);
			if(StringUtils.isEmpty(contextUUID)){
				contextUUID = UUID.randomUUID().toString();
			}
			invocation.getAttachments().put(LogMDCConstant.CONTEXT_UUID, contextUUID);
			
			String userId = MDC.get(LogMDCConstant.USER_ID);
			if(StringUtils.isNotEmpty(userId)){
				invocation.getAttachments().put(LogMDCConstant.USER_ID, userId);
			}
			
			String hostName = MDC.get(LogMDCConstant.HOST_NAME);
			if(StringUtils.isNotEmpty(hostName)){
				invocation.getAttachments().put(LogMDCConstant.HOST_NAME, hostName);
			}
			
			String sessionId = MDC.get(LogMDCConstant.SESSION_ID);
			if(StringUtils.isNotEmpty(sessionId)){
				invocation.getAttachments().put(LogMDCConstant.SESSION_ID, sessionId);
			}
			
			
		}
		// before filter ...
		long startTime = System.currentTimeMillis();
		Result result = null;
		try {
			result = invoker.invoke(invocation);
		} finally {
			// after filter ...
			long endTime = System.currentTimeMillis();
			try {
				loggerDubbo(context, invoker.getInterface(), invocation.getMethodName(), invocation.getArguments(), result, endTime - startTime);
			} catch (Exception e) {
				LOGGER.error("Dubbo 日志记录失败", e);
			}
			if(context.isProviderSide()){
				MDC.clear();
			}

		}
		
		return result;
	}


	/**
	 * 成功日志记录
	 * 
	 * @param interface1
	 * @param methodName
	 * @param arguments
	 * @author Silver
	 * @param context 
	 * @param result
	 * @param costTime
	 * @date 2016年6月6日 下午5:09:15
	 */

	@SuppressWarnings("deprecation")
	private void loggerDubbo(RpcContext context, Class<?> interface1, String methodName, Object[] arguments, Result result , long costTime) {

		MDC.put(LogMDCConstant.REQUEST_TIME, String.valueOf(costTime));
		StringBuffer logStr = new StringBuffer(128);
		if(context.isProviderSide()){
			// 提供方
			logStr.append("Dubbo isProviderSide 服务被他方调用-->");
			logStr.append("Application:");
			logStr.append(context.getUrl().getParameter("application"));
		}else if(context.isConsumerSide()){
			// 消费方
			logStr.append("Dubbo isConsumerSide 调用他方服务-->");
		}
		
		logStr.append(",RemoteHost:").append(context.getRemoteAddressString());
		logStr.append(",");
		logStr.append(String.valueOf(interface1))
						.append(".")
						.append(methodName)
						.append(",arguments:");
		if (arguments != null) {
			for (int i = 0; i < arguments.length; i++) {
				logStr.append(arguments[i])
								.append("_");
			}
		}
		logStr.append(",Cost:")
						.append(costTime);
		if(result.getException() == null){
			// 调用系统未抛出异常
			logStr.append("-->成功:result:");
			Object objResult = result.getResult();
			String objLog = String.valueOf(objResult);
			if(objResult instanceof Map || objResult instanceof Set || objResult instanceof List){
				
				if(objLog.length() > 300){
					logStr.append(objLog.substring(0, 300));
				}
			}else{
				logStr.append(objLog);
			}
			
			LOGGER.info(logStr.toString());
		}else{
			// 调用系统抛出异常情况
			logStr.append("-->失败：exception:")
			.append(result.getException());
			LOGGER.info(logStr.toString(),result.getException());
		}

	}

}
