package com.wjs.member.common.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

/**
 * @author albert.su suzy@wjs.com
 * @date 2015年9月11日 下午2:15:14
 * 
 *
 */
public class MappingExceptionResolver extends SimpleMappingExceptionResolver {

	private static final Logger LOGGER = LoggerFactory.getLogger(MappingExceptionResolver.class);

	@Override
	protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {

//		if (handler instanceof HandlerMethod) {
//			ResponseBody body = ((HandlerMethod) handler).getMethodAnnotation(ResponseBody.class);
//			if (body != null) {
//				try {
//					LOGGER.info(ex.getMessage(), ex);
//					response.setContentType("application/json;charset=UTF-8");
//					Gson gson = new Gson();
//					if (ex instanceof BaseException) {
//						LOGGER.info("BaseController WARN message:{} , class {}, method {} ", ex.getMessage(), ((HandlerMethod) handler).getBean().getClass(),
//										((HandlerMethod) handler).getMethod().getName());
//
//						BaseException baseEx = (BaseException) ex;
//
//						JsonResult<Object> sr = new JsonResult<Object>(JsonResult.Status.WARN, baseEx.getMessage());
//						gson.toJson(sr, response.getWriter());
//					} else if(ex instanceof BindException){
//						LOGGER.error("BaseController WARN message:{} , class {}, method {} ", ex.getMessage(), ((HandlerMethod) handler).getBean().getClass(),
//										((HandlerMethod) handler).getMethod().getName());
//
//						JsonResult<Object> sr = new JsonResult<Object>(JsonResult.Status.REQUESTBINDERROR, "请求参数错误:"+ex.getMessage());
//						gson.toJson(sr, response.getWriter());
//					}else {
//						LOGGER.error("BaseController ERROR message:{} , class {}, method {} ", ex.getMessage(), ((HandlerMethod) handler).getBean().getClass(),
//										((HandlerMethod) handler).getMethod().getName());
//
//						JsonResult<Object> sr = new JsonResult<Object>(JsonResult.Status.ERROR, "服务异常", ex.getMessage());
//						gson.toJson(sr, response.getWriter());
//					}
//					//if has exception, no need to be closed
//					IOUtils.closeQuietly(response.getWriter());
//					return new ModelAndView();
//				} catch (IOException e) {
//					LOGGER.error(e.getMessage(), e);
//				}
//			}
//		}

		String viewName = determineViewName(ex, request);

		if (viewName != null) {
			Integer statusCode = determineStatusCode(request, viewName);
			if (statusCode != null) {
				applyStatusCodeIfPossible(request, response, statusCode);
			}
			return getModelAndView(viewName, ex, request);
		} else {
			return null;
		}
	}

	protected ModelAndView getModelAndView(String viewName, Exception ex) {
		LOGGER.warn(ex.getMessage(), ex);
		return super.getModelAndView(viewName, ex);
	}

	@Override
	public int getOrder() {
		return 0;
	}

}
