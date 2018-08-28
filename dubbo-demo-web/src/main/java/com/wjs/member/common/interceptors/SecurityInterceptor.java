package com.wjs.member.common.interceptors;

import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * 
 * @author suzhenyin suzhenyin@malam.com
 * @date 2014年9月3日 下午2:42:22
 * 
 *
 */
public class SecurityInterceptor implements HandlerInterceptor {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	private List<String> excludedUrls;

	public void setExcludedUrls(List<String> excludedUrls) {
		this.excludedUrls = excludedUrls;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		response.setHeader("pragma", "no-cache");
		response.setHeader("cache-control", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setHeader("P3P", "CP=CAO PSA OUR");
		String logDesc = "SUCCED";
		try {
			for (String url : excludedUrls) {
				if (isExcludeUrl(request.getContextPath(), request.getRequestURI(), url)) {
					logDesc = "EXCLUDE";
					return true;
				}
			}
			// 若用户未登录,则跳转到登陆页
			if (request.getSession().getAttribute("LOON_SESSION") == null) {
				logDesc = "UNLOGON";
				response.sendRedirect(request.getContextPath() + "LOON_SESSION");
			}

			// 校验功能权限
			//			Object obj = request.getSession().getAttribute(LbcBaseController.SESSION_KEY_URL_LIST) ;
			//			Object obj2 = request.getSession().getAttribute(LbcBaseController.SESSION_KEY_BUTTONNO) ;
			//			Object obj3 = request.getSession().getAttribute(LbcBaseController.SESSION_KEY_MENU_URL) ;
			//			System.out.println(obj);
			//			System.out.println(obj2);
			//			System.out.println(obj3);
			//			String requestType = request.getHeader("X-Requested-With");
			//			if (StringUtils.isEmpty(requestType)) {
			//				System.out.println("页面  请求");
			//			} else {
			//				System.out.println("Ajax请求");
			//			} 

		} finally {
			//记录log
			logAllUserRequests(logDesc, request);
		}

		return true;
	}

	/**
	 * 例外URL判断
	 * 
	 * @param requestUri
	 * @param url
	 * @return
	 * @author albert.su suzy@wjs.com
	 * @param ContextPath
	 * @date 2015年9月29日 上午10:30:52
	 */
	private boolean isExcludeUrl(String ContextPath, String requestUri, String url) {
		if (StringUtils.isNotEmpty(ContextPath) && requestUri.length() > ContextPath.length()) {
			requestUri = requestUri.substring(ContextPath.length());
		}
		if (requestUri.equals(url)) {
			return true;
		}
		if (url.endsWith("*") && requestUri.startsWith(url.substring(0, url.length() - 2))) {
			return true;
		}
		return false;
	}

	/**
	 * 
	 * @Description: 记录请求日志
	 * @param request 设定文件
	 * @throws 异常说明
	 * @author suzy suzy@malam.com
	 * @param isLogon
	 * @date 2014年4月1日 上午10:30:40
	 */
	private void logAllUserRequests(String logDesc, HttpServletRequest request) {

		StringBuffer logBuffer = new StringBuffer();
		String userName = null;
		logBuffer.append("request : " + logDesc + " : -->" + request.getRequestURL() + ";");

		//获取所有参数
		StringBuffer paramBuffer = new StringBuffer();
		Enumeration<?> enu = request.getParameterNames();
		while (enu.hasMoreElements()) {
			String paraName = (String) enu.nextElement();
			paramBuffer.append(paraName + ": " + request.getParameter(paraName) + " ");
		}
		if (paramBuffer.length() > 0) {
			logBuffer.append("requestParameters:" + paramBuffer.toString());
		}
		logBuffer.append("\tuserName:" + userName);
		logBuffer.append("\tuserIp:" + getIP(request));
		logger.info(logBuffer.toString());
	}

	private String getIP(HttpServletRequest request) {
		String headerName = "X-Forwarded-For";
		String ip = request.getHeader(headerName);
		if (ip == null) {
			ip = request.getRemoteAddr();
		}
		if (ip == null)
			return "";
		return ip;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
	}

}