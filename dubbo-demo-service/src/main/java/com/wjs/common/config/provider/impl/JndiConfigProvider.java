package com.wjs.common.config.provider.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NameClassPair;
import javax.naming.NamingEnumeration;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wjs.common.config.provider.ConfigProvider;

/**
 * 
 * @Description: JNDI配置提供者
 * @author suzy suzy@malam.com
 * @date 2014年5月6日 上午12:12:49
 * 
 *
 */
public class JndiConfigProvider implements ConfigProvider {

	private static final String JEE_ENV_PREFIX = "java:comp/env/";

	/**
	 * if true add "java:comp/env/" as the prefix
	 */
	private boolean addEnvPrefix = true;

	private static final Logger LOGGER = LoggerFactory.getLogger(JndiConfigProvider.class);

	private List<String> jndiLocations;

	private Map<String, Object> ramCache = new HashMap<String, Object>();

	@Override
	public void init() {
		if (this.jndiLocations != null) {
			long t1 = System.currentTimeMillis();
			Context ctx = null;
			try {
				ctx = new InitialContext();
			} catch (Exception e) {
				LOGGER.error("init jndi context error", e);
			}

			if (null == ctx) {
				return;
			}
			Context envContext = null;
			NamingEnumeration<NameClassPair> ne = null;
			for (String jndi : this.jndiLocations) {
				if (addEnvPrefix && !StringUtils.startsWith(jndi, JEE_ENV_PREFIX)) {
					jndi = JEE_ENV_PREFIX + jndi;
				}
				LOGGER.info("load JNDI path : " + jndi);
				try {
					envContext = (Context) ctx.lookup(jndi);
					ne = envContext.list("");
					while (ne.hasMore()) {
						NameClassPair np = (NameClassPair) ne.next();
						String path = np.getName();
						LOGGER.info("load JNDI property key=" + path);
						Object value = decode(envContext.lookup(path));
						ramCache.put(path, value);
					}
				} catch (Exception e) {
					LOGGER.error("load jndi properties failed! ignore to load jndi:" + jndi);
				}
			}

			LOGGER.info("load jndi completed in " + (System.currentTimeMillis() - t1) + " ms.");
		}
	}

	private Object decode(Object str) {

		if (str instanceof String) {
			try {
				return URLDecoder.decode(str.toString(), "utf-8");
			} catch (UnsupportedEncodingException e) {
				LOGGER.error("decode property value error, str={}", str, e);
			}
		}
		return str;
	}

	/**
	 * @return the addEnvPrefix
	 */
	public boolean isAddEnvPrefix() {
		return addEnvPrefix;
	}

	/**
	 * @param addEnvPrefix
	 *        the addEnvPrefix to set
	 */
	public void setAddEnvPrefix(boolean addEnvPrefix) {
		this.addEnvPrefix = addEnvPrefix;
	}

	public void setJndiLocations(List<String> jndiLocations) {
		this.jndiLocations = jndiLocations;
	}

	@Override
	public String getConfig(String key) {
		Object value = ramCache.get(key);
		return (null == value ? null : value.toString());
	}

	@Override
	public Map<String, String> getAll() {
		Map<String, String> all = new HashMap<String, String>();
		for (Entry<String, Object> entry : ramCache.entrySet()) {
			all.put(entry.getKey(), (null == entry.getValue() ? null : entry.getValue().toString()));
		}
		return all;
	}

}
