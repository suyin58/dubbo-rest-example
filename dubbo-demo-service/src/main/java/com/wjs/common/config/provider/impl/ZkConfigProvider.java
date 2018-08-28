package com.wjs.common.config.provider.impl;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.ZkClient;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wjs.common.config.provider.ConfigProvider;

public class ZkConfigProvider implements ConfigProvider {
	protected final Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * 缓存属性
	 */
	private static ConcurrentHashMap<String, String> props = new ConcurrentHashMap<String, String>();
	/**
	 * 缓存所有目录
	 */
	private static CopyOnWriteArrayList<String> paths = new CopyOnWriteArrayList<String>();
	/**
	 * 配置的分组信息
	 */
	private List<String> groups;

	/**
	 * @param groups the groups to set
	 */
	public void setGroups(List<String> groups) {
		this.groups = groups;
	}

	private ZkClient zkClient;

	/**
	 * laod properties from zookeeper
	 * 
	 * @param first 第一次load不出内容， 系统会中断
	 */
	private void reloadPropsFromZookeeper() {
		if (!zkClient.exists(ZkConfigConsts.ROOT)) {
			String result = zkClient.create(ZkConfigConsts.ROOT, System.currentTimeMillis(), CreateMode.PERSISTENT);
			logger.info("create root, return={}", result);
		}
		if (!zkClient.exists(ZkConfigConsts.PARENT)) {
			String result = zkClient.create(ZkConfigConsts.PARENT, System.currentTimeMillis(), CreateMode.PERSISTENT);
			logger.info("create parent, return={}", result);
		}
		List<String> _groups = null;
		if (CollectionUtils.isEmpty(_groups)) {
			_groups = zkClient.getChildren(ZkConfigConsts.PARENT);
		} else {
			_groups = this.groups;
		}

		Map<String, String> _props = new HashMap<String, String>();
		List<String> _paths = new ArrayList<String>();
		long start = System.currentTimeMillis();
		logger.info("[zk init] =================start=======================================");

		for (String group : _groups) {
			List<String> children = zkClient.getChildren(ZkConfigConsts.getPath(group));
			logger.info("[zk init] ====== group={}", group);
			for (String key : children) {
				String data = zkClient.readData(ZkConfigConsts.getPath(group, key));
				_props.put(key, data);
				_paths.add(ZkConfigConsts.getKey(group, key));
				logger.info("[zk init] ====== group={}, {}={}", group, key, data);
			}
		}

		if (!_props.isEmpty()) {
			props.putAll(_props);
		}
		if (!_paths.isEmpty()) {
			paths.addAll(_paths);
		}
		logger.info("[zk init] =================end=======================================");
		logger.info("[zk init] get props time ={}", (System.currentTimeMillis() - start));

	}

	/**
	 * @Description: 监控节点变化
	 * @throws 异常说明
	 * @author pangtongtong01 pangtongtong01@malam.com
	 * @date 2014年5月4日 下午6:11:46
	 */
	private void monitorZookeeper() {
		zkClient.subscribeChildChanges(ZkConfigConsts.PARENT, new IZkChildListener() {
			@Override
			public void handleChildChange(String parentPath, List<String> currentChildren) throws Exception {

				Map<String, String> _props = new HashMap<String, String>();
				List<String> _paths = new ArrayList<String>();
				long start = System.currentTimeMillis();

				logger.info("[zk change] =================start=====================================");
				for (String currentChild : currentChildren) {
					if (CollectionUtils.isNotEmpty(groups)) {
						if (!groups.contains(currentChild)) {
							logger.info("[zk change] ====== group not contains : {}", currentChild);
							continue;
						}
					}
					String groupPath = parentPath + ZkConfigConsts.SEP + currentChild;
					List<String> children = zkClient.getChildren(groupPath);
					for (String key : children) {
						String data = zkClient.readData(ZkConfigConsts.getPath(currentChild, key));

						_props.put(key, data);
						_paths.add(ZkConfigConsts.getKey(currentChild, key));
						logger.info("[zk change] ====== group={}, {}={}", currentChild, key, data);
					}

				}

				if (!_props.isEmpty()) {
					props.clear();
					props.putAll(_props);
				}
				if (!_paths.isEmpty()) {
					paths.clear();
					paths.addAll(_paths);
				}

				logger.info("[zk change] =================end=======================================");
				logger.info("[zk change] get props time ={}", (System.currentTimeMillis() - start));
			}
		});
	}

	public List<String> getPaths() {
		return Collections.unmodifiableList(paths);
	}

	/**
	 * 
	 * @Description: 创建配置信息
	 * @param path
	 * @param value
	 * @return 设定文件
	 * @throws 异常说明
	 * @author pangtongtong01 pangtongtong01@malam.com
	 * @date 2014年5月3日 下午4:21:01
	 */
	public boolean create(String group, String key, String value) {
		String groupPath = ZkConfigConsts.getPath(group);
		if (!zkClient.exists(groupPath)) {
			zkClient.create(groupPath, "", CreateMode.PERSISTENT);
			logger.info("[zk create] groupPath={}", groupPath);
		}
		String path = ZkConfigConsts.getPath(group, key);
		if (zkClient.exists(path)) {
			logger.info("[zk create] path exists, path={}", path);
			return false;
		}
		String result = zkClient.create(path, value, CreateMode.PERSISTENT);
		logger.info("[zk create] path={},value={},return={}", path, value, result);
		if (!props.containsKey(key)) {
			props.put(key, value);
			paths.add(ZkConfigConsts.getKey(group, key));
		}
		return true;

	}

	/**
	 * 
	 * @Description: 更新节点
	 * @param path
	 * @param value
	 * @return 设定文件
	 * @throws 异常说明
	 * @author pangtongtong01 pangtongtong01@malam.com
	 * @date 2014年5月4日 上午10:36:44
	 */
	public boolean modify(String group, String key, String value) {
		String path = ZkConfigConsts.getPath(group, key);
		if (!zkClient.exists(path)) {
			logger.info("[zk modify] path not exists:{}", path);
			return false;
		}
		Stat stat = zkClient.writeDataReturnStat(path, value, -1);
		logger.info("[zk modify] path={},value={},return_stat_version={}", path, value, stat.getVersion());
		boolean flag = false;
		if (stat != null) {
			props.replace(key, value);
			flag = true;
		}
		return flag;
	}

	/**
	 * 删除
	 * 
	 * @param path
	 */
	public boolean sync() {
		String path = ZkConfigConsts.getPath("sync");
		if (zkClient.exists(path)) {
			return zkClient.delete(path);
		}
		String result = zkClient.create(path, System.currentTimeMillis(), CreateMode.PERSISTENT);
		return StringUtils.isNotBlank(result);
	}

	private Properties loadProperties() {
		String fileName = System.getProperty(ZkConfigConsts.D_PARAM);
		logger.info("system -dfileName={}", fileName);
		if (StringUtils.isBlank(fileName)) {
			String classPath = this.getClass().getResource("/").getPath();
			fileName = classPath + ZkConfigConsts.DEFAULT_CONFIG_FILE_NAME;
			logger.info("classpath fileName={}", fileName);
			if (!new File(fileName).exists()) {
				fileName = ZkConfigConsts.DEFAULT_CONFIG_FILE_PATH + ZkConfigConsts.DEFAULT_CONFIG_FILE_NAME;
				logger.info("classpath donot exist file, default fileName={}", fileName);
			}
		}
		Properties p = new Properties();
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(fileName);
			p.load(fis);
		} catch (Exception e) {
			logger.error("load " + fileName + " error", e);
		} finally {
			IOUtils.closeQuietly(fis);
		}
		return p;
	}

	@Override
	public void init() {
		Properties p = this.loadProperties();
		String host = p.getProperty(ZkConfigConsts.CONFIG_HOST_KEY);
		String timeout = p.getProperty(ZkConfigConsts.CONFIG_TIMEOUT_KEY);
		logger.info("[zk server] host={},timeout={}", host, timeout);
		zkClient = new ZkClient(host, Integer.valueOf(timeout));
		reloadPropsFromZookeeper();
		monitorZookeeper();
	}

	@Override
	public String getConfig(String key) {
		return props.get(key);
	}

	@Override
	public Map<String, String> getAll() {
		return Collections.unmodifiableMap(props);
	}

	public static void main(String[] args) {
		;
	}
}
