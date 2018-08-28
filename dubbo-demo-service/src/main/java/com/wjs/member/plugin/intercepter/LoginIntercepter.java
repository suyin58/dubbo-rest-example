package com.wjs.member.plugin.intercepter;	
import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;


public class LoginIntercepter  implements ContainerRequestFilter , ContainerResponseFilter {

	@Context
	private HttpServletRequest request;

	@Context
	private HttpServletResponse response;
	
	// request filter
	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {

		
//		if (not_authenticated){ requestContext.abortWith(response)};
		
		
		System.out.println("进入request拦截器");
		
		
		// 打印Path参数
		MultivaluedMap<String, String>  pathParameters  = requestContext.getUriInfo().getPathParameters();
		for (Iterator<Entry<String, List<String>>> it = pathParameters.entrySet().iterator();it.hasNext();) {

			Entry<String, List<String>> entry = it.next();
			System.out.println("Path_key:" + entry.getKey() + "-- val:" + entry.getValue());
		}
		
		// 打印query参数
		MultivaluedMap<String, String>  	queryParameters = requestContext.getUriInfo().getQueryParameters();
		
		for (Iterator<Entry<String, List<String>>> it = queryParameters.entrySet().iterator();it.hasNext();) {

			Entry<String, List<String>> entry = it.next();
			System.out.println("Query_key:" + entry.getKey() + "-- val:" + entry.getValue());
		}
		
		// 打印form参数
		Map<String, Object> formParameters = request.getParameterMap();
		for (Iterator<Entry<String, Object>> it = formParameters.entrySet().iterator();it.hasNext();) {

			Entry<String, Object> entry = it.next();
			System.out.println("Param_key:" + entry.getKey() + "-- val:" + entry.getValue());
		}
		
		
	}
//    @Override
//    public void filter(ContainerRequestContext requestContext){
//      if (not_authenticated){ requestContext.abortWith(response)};
//    }

	
	// resonse filter
	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {

		System.out.println("进入response拦截器");
		// TODO 补充自动生成的代码块
		
	}

}

