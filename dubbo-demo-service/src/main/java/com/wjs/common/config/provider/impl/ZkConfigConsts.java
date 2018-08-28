package com.wjs.common.config.provider.impl;

public class ZkConfigConsts {

	public static final String ROOT = "/tuan_lbc";

	public static final String PARENT = ROOT + "/configure";

	public static final String SEP = "/";

	public static final String D_PARAM = "lbc.registry.file";

	public static final String DEFAULT_CONFIG_FILE_NAME = "registry.properties";

	public static final String DEFAULT_CONFIG_FILE_PATH = "/home/config/";

	public static final String CONFIG_HOST_KEY = "registry.zookeeper.host";

	public static final String CONFIG_TIMEOUT_KEY = "registry.zookeeper.timeout";

	public static String getKey(String group, String key) {
		return new StringBuilder().append(group).append(SEP).append(key).toString();
	}

	public static String getPath(String group) {
		return new StringBuilder().append(PARENT).append(SEP).append(group).toString();
	}

	public static String getPath(String group, String key) {
		return new StringBuilder().append(PARENT).append(SEP).append(group).append(SEP).append(key).toString();
	}

}
