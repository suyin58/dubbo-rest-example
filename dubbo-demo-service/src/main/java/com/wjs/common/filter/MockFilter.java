package com.wjs.common.filter;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * (测试使用的过滤器)
 * 
 * @author suzy suzy@malam.com
 * @date 2014年5月12日 下午4:38:52
 * 
 * 
 */
public class MockFilter implements Filter {

	private static final Logger LOGGER = LoggerFactory
					.getLogger(MockFilter.class);

	private String filePath;

	private String contextPath;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

		filePath = filterConfig.getInitParameter("filePath");
		contextPath = filterConfig.getServletContext().getRealPath("/");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

		HttpServletRequest httpRequest = (HttpServletRequest) request;
		String requestUrl = httpRequest.getRequestURI();
		String requestType = httpRequest.getHeader("X-Requested-With");

		// 判断用户请求方式是否为ajax
		if ("XMLHttpRequest".equals(requestType)) {
			String jsonFilePatch = getFileValue(requestUrl);
			if (jsonFilePatch != null) {
				response.setContentType("application/json;charset=UTF-8");
				jsonFilePatch = contextPath + jsonFilePatch;
				File file = FileUtils.getFile(jsonFilePatch);
				FileUtils.copyFile(file, response.getOutputStream());
				return;
			}
		}
		chain.doFilter(request, response);

	}

	@Override
	public void destroy() {

	}

	/**
	 * 
	 * (获取配置文件的中对应URL的内容，即json文件路径)
	 * 
	 * @param url
	 * @return
	 * @author changyanheng changyanheng@malam.com
	 * @date 2014年5月12日 下午5:26:32
	 */
	public String getFileValue(String url) {

		InputStream in = null;
		Properties p = null;
		String value = null;
		try {
			in = new BufferedInputStream(new FileInputStream(contextPath + filePath));
			p = new Properties();
			p.load(in);

			Set<Object> key = p.keySet();
			for (Iterator<Object> it = key.iterator(); it.hasNext();) {
				String reg = (String) it.next();
				Pattern pattern = Pattern.compile(reg);
				Matcher matcher = pattern.matcher(url);

				if (matcher.matches()) {
					value = p.getProperty(reg);
					break;
				}

			}

		} catch (FileNotFoundException e) {
			LOGGER.error(
							"URL:" + url + ",FileNotFoundException:" + e.getMessage(),
							e);
		} catch (IOException e) {
			LOGGER.error("URL:" + url + ",IOException:" + e.getMessage(), e);
		} finally {
			IOUtils.closeQuietly(in);
		}

		return value;
	}

}
