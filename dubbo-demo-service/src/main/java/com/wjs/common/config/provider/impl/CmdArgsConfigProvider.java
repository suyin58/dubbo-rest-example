package com.wjs.common.config.provider.impl;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wjs.common.config.provider.ConfigProvider;

public class CmdArgsConfigProvider implements ConfigProvider {
	private static final Logger LOGGER = LoggerFactory.getLogger(CmdArgsConfigProvider.class);

	private Properties properties = new Properties();
	private static final String CONFIG_FILE_NAME_ARG = System.getProperty("configFile");

	@Override
	public String getConfig(String key) {
		String val = System.getProperty(key);
		if (LOGGER.isDebugEnabled()) {
			LOGGER.debug("get config from cmd args. {}={}", key, val);
		}
		if (null == val) {
			val = properties.getProperty(key);
			if (LOGGER.isDebugEnabled()) {
				LOGGER.debug("get config from config file. {}={}", key, val);
			}
		}

		return val;
	}

	@Override
	public void init() {
		if (null != CONFIG_FILE_NAME_ARG && !"".equals(CONFIG_FILE_NAME_ARG)) {
			LOGGER.info("load config from config file :{}", CONFIG_FILE_NAME_ARG);
			BufferedReader br = null;
			try {
				br = new BufferedReader(new InputStreamReader(new FileInputStream(CONFIG_FILE_NAME_ARG), "UTF-8"));
				properties.load(br);
			} catch (Exception e) {
				LOGGER.error("load config from file error: file={}", CONFIG_FILE_NAME_ARG, e);
			} finally {
				IOUtils.closeQuietly(br);
			}
		}
	}

	@Override
	public Map<String, String> getAll() {
		Map<String, String> all = new HashMap<String, String>();
		for (Object keyObject : properties.keySet()) {
			String key = keyObject.toString();
			all.put(key, properties.getProperty(key));
		}
		for (Object keyObject : System.getProperties().keySet()) {
			String key = keyObject.toString();
			all.put(key, properties.getProperty(key));
		}
		return all;
	}

}
