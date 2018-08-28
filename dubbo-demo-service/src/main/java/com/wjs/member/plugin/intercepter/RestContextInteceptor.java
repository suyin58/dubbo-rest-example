package com.wjs.member.plugin.intercepter;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import javax.ws.rs.ext.WriterInterceptor;
import javax.ws.rs.ext.WriterInterceptorContext;

import org.apache.commons.lang.StringUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wjs.common.exception.BaseException;
import com.wjs.common.web.JsonResult;
@Provider
public class RestContextInteceptor implements ContainerRequestFilter, WriterInterceptor, ContainerResponseFilter, ExceptionMapper<Exception>  {

	
	private static final Logger LOGGER = LoggerFactory.getLogger(ServiceExecutionInterceptor.class);
	
	private static final String ENCODING_UTF_8 = "UTF-8";

	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		
//		System.err.println("进入请求拦截——filter");
		// 编码处理
		request.setCharacterEncoding(ENCODING_UTF_8);
		response.setCharacterEncoding(ENCODING_UTF_8);
		request.setAttribute(InputPart.DEFAULT_CHARSET_PROPERTY, ENCODING_UTF_8);
		requestContext.setProperty(InputPart.DEFAULT_CHARSET_PROPERTY, ENCODING_UTF_8);
		
		// 客户端head显示提醒不要对返回值进行封装
        requestContext.setProperty("Not-Wrap-Result", requestContext.getHeaderString("Not-Wrap-Result") == null ? "" : requestContext.getHeaderString("Not-Wrap-Result"));
        
        // 请求参数打印
        logRequest(request);
	}
	

	@Override
	public void aroundWriteTo(WriterInterceptorContext context) throws IOException, WebApplicationException {

//		System.err.println("进入结果处理——aroundWriteTo");
//		针对需要封装的请求对结构进行封装处理。这里需要注意的是对返回类型已经是封装类（比如：异常处理器的响应可能已经是封装类型）时要忽略掉。
        Object originalObj = context.getEntity();
        String wrapTag = context.getProperty("Not-Wrap-Result") == null ? "" : context.getProperty("Not-Wrap-Result").toString(); // 客户端显示提醒不要对返回值进行封装
        Boolean wraped = originalObj instanceof JsonResult; // 已经被封装过了的，不用再次封装
		if (StringUtils.isBlank(wrapTag) && !wraped){
        	JsonResult<Object> result = new JsonResult<>(true, "执行成功");
        	result.setData(context.getEntity());
        	context.setEntity(result);
//        	以下两处set避免出现Json序列化的时候，对象类型不符的错误
            context.setType(result.getClass());
            context.setGenericType(result.getClass().getGenericSuperclass());
        }
        context.proceed();
		
	}

	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {

//		System.err.println("进入结果处理——filter");
//		 它的目的是专门处理方法返回类型是 void,或者某个资源类型返回是 null 的情况，
//		这种情况下JAX-RS 框架一般会返回状态204，表示请求处理成功但没有响应内容。 我们对这种情况也重新处理改为操作成功
		String wrapTag = requestContext.getProperty("Not-Wrap-Result") == null ? "" : requestContext.getProperty("Not-Wrap-Result").toString(); // 客户端显示提醒不要对返回值进行封装
		
		if (StringUtils.isBlank(wrapTag) &&responseContext.getStatus() == 204 && !responseContext.hasEntity()){
            responseContext.setStatus(200);
            responseContext.setEntity(new JsonResult<>(true, "执行成功"));
            responseContext.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON);
        }
	}

	/**
	 * 异常拦截
	 */
	@Override
	public Response toResponse(Exception e) {

//		System.err.println("进入结果处理——toResponse");
		String errMsg = e.getMessage();
		JsonResult<Object> result = new JsonResult<>(false, StringUtils.isEmpty(errMsg)? "系统异常" : errMsg);
		if(javax.ws.rs.ClientErrorException.class.isAssignableFrom(e.getClass())){
			ClientErrorException ex = (ClientErrorException) e;
			LOGGER.error("请求错误:" + e.getMessage());
			return ex.getResponse();
		}
		
		if(e instanceof BaseException){
			BaseException  ex = (BaseException) e;
			result.setData(ex.getErrorParams());
		}
		
		LOGGER.error(errMsg, e);
		return Response.status(200).entity(result).build();
	}

	
	private void logRequest(HttpServletRequest request) {

		StringBuffer logBuffer = new StringBuffer(128);

//		// refer_url
//		logBuffer.append("referUrl:");
//
//		@SuppressWarnings("rawtypes")
//		Enumeration e = request.getHeaders("Referer");
//		String referUrl;
//		if (e.hasMoreElements()) {
//			referUrl = (String) e.nextElement();
//		} else {
//			referUrl = "直接访问";
//		}
//		logBuffer.append(referUrl);
		// 获取url
		logBuffer.append(";URL:");
		StringBuffer url = request.getRequestURL();
		if (url != null) {
			StringUtils.replaceOnce(url.toString(), "http://", "https://");
		}
		logBuffer.append(url.toString());
		// 判断用户请求方式是否为ajax
		logBuffer.append(";ISAJAX:");
		String requestType = request.getHeader("X-Requested-With");
		if (StringUtils.isNotBlank(requestType) && requestType.equals("XMLHttpRequest")) {
			logBuffer.append("true");
		} else {
			logBuffer.append("false");
		}
		//获取所有参数
		StringBuffer paramBuffer = new StringBuffer(64);
		Enumeration<?> enu = request.getParameterNames();
		while (enu.hasMoreElements()) {
			String paraName = (String) enu.nextElement();
			paramBuffer.append(paraName);
			paramBuffer.append(": ");
			paramBuffer.append(request.getParameter(paraName));
			paramBuffer.append(", ");
		}
		logBuffer.append(";Parameters:");
		logBuffer.append(paramBuffer.toString());

		// 记录本次请求耗时：
//		Long requestEndTime = System.currentTimeMillis();
//		Long requestStartTime = StringUtils.isEmpty(MDC.get(REQUEST_STARTTIME)) ? requestEndTime : Long.valueOf(MDC.get(REQUEST_STARTTIME));

//		logBuffer.append(";COST:");
//		logBuffer.append(requestEndTime - requestStartTime);
//		logBuffer.append(" ms");
		if (!"HEAD".equals(request.getMethod())) {
			LOGGER.info("requestLog:" + logBuffer.toString());
		}

	}

}
