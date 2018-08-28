package com.wjs.member.service.file.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjs.member.clientVo.deduct.DeductTplVo;
import com.wjs.member.dao.deduct.DeductTemplateMapper;
import com.wjs.member.qry.deduct.DeductTplQry;
import com.wjs.member.service.file.FileDubboRestExample;

@Path("file")
@Provider 
@Service("fileDubboRestExample")
public class FileDubboRestExampleImpl implements FileDubboRestExample {

	private static final Logger LOGGER = LoggerFactory.getLogger(FileDubboRestExampleImpl.class);

	@Autowired
	private DeductTemplateMapper deductTemplateMapper;

	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Override
	public Object uploadfile(MultipartFormDataInput input,@QueryParam("name")String name, @FormParam("age") Integer age, @Context HttpServletRequest request, @Context HttpServletResponse response) {
		System.out.println("进入业务逻辑");
		System.err.println("QueryParam_name:" + name);
		System.err.println("FormParam_age:" + age);
//		MultipartFormDataReader

		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		//取得文件表单名
		List<InputPart> inputParts = uploadForm.get("file");

		final String DIRCTORY = "D:/temp/datainput/";
		initDirectory(DIRCTORY);
		InputStream inputStream = null;
		OutputStream outStream = null;
		for (InputPart inputPart : inputParts) {
			try {
				// 文件名称  
				String fileName = getFileName(inputPart.getHeaders());
				inputStream = inputPart.getBody(InputStream.class, null);
				//把文件流保存;
				File file = new File(DIRCTORY + fileName);
				
				
				int index;
				byte[] bytes = new byte[1024];
				outStream = new FileOutputStream(file);
				while ((index = inputStream.read(bytes)) != -1) {
					outStream.write(bytes, 0, index);
					outStream.flush();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}finally {
				if(null != inputStream){
					try {
						inputStream.close();
					} catch (IOException e) {
					}
				}
				if(null != outStream){
					try {
						outStream.close();
					} catch (IOException e) {
					}
				}
			}

		}

		return Response.ok().build();
	}
	

	private String getFileName(MultivaluedMap<String, String> header) {
		          String[] contentDisposition = header.getFirst("Content-Disposition").split(";");
		          for (String filename : contentDisposition) {
		              if ((filename.trim().startsWith("filename"))) {
		                  String[] name = filename.split("=");
		                  String finalFileName = name[1].trim().replaceAll("\"", "");
		                  return finalFileName;
		              }
		          }
		          return "unknown";
		      }
	
	@POST
	@Path("/up")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces("application/json;charset=UTF-8")
	@Override
	public Response upload(@MultipartForm DiskFile diskFile,
			@Context HttpServletRequest request,@QueryParam("name")String name,@FormParam("age") Integer age) {
		
		System.out.println("进入业务逻辑");
		System.err.println("PathParam_name:" + name);
		System.err.println("FormParam_age:" + age);
		System.err.println("MultipartForm_DiskFile:" + diskFile);
		
		
		//使用@MultipartForm，暂时无法获取到fileName属性，详见：https://issues.jboss.org/browse/RESTEASY-1069?_sscc=t
		try {
			final String DIRCTORY = "D:/temp/form/";
			initDirectory(DIRCTORY);
			
//			String newName = getNewName(diskFile.getFileName());
			String newName = diskFile.getFileName();
			File file = new File(DIRCTORY + newName);
			FileUtils.writeByteArrayToFile(file, diskFile.getFileDate());

			return Response.ok("文件上传成功").build();
		} catch (IOException e) {
			e.printStackTrace();
			return Response.serverError().build();
		}
//		Message message = new Message(true, "文件上传成功！");
//		return Response.ok(message).build();
	}

	/**
	 * 初始化目录
	 * 
	 * @param path
	 * @throws IOException
	 */
	private void initDirectory(String path){
		File dir = new File(path);
		if (!dir.exists()) {
			try {
				FileUtils.forceMkdir(dir);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	

	@GET
	@Path("/download")
	@Produces("application/json; charset=UTF-8")
	@Override
	public void download(@QueryParam(value = "fileName") String fileName, @Context HttpServletRequest request, @Context HttpServletResponse response) {

		InputStream in = null;
		OutputStream out = null;
		try {
			fileName = "app.log";
			String filePath = "D:\\logs\\manageplat\\" + fileName;
			response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode(fileName, "UTF-8"));

			in = new FileInputStream(filePath); //获取文件的流  
			int len = 0;
			byte buf[] = new byte[1024];//缓存作用  
			out = response.getOutputStream();//输出流  
			while ((len = in.read(buf)) > 0) //切忌这后面不能加 分号 ”;“  
			{
				out.write(buf, 0, len);//向客户端输出，实际是把数据存放在response中，然后web服务器再去response中读取  
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	@POST
	@Path("/{tplId}/getbyid")
	@Produces("application/json; charset=UTF-8") // {MediaType.APPLICATION_JSON,}
	@Override
	public DeductTplVo getDeductById(@PathParam("tplId") Long tplId, @QueryParam("id") Long id, @Context HttpServletRequest request) {

		System.out.println(" request_param_id-> "+request.getParameter("id"));
		System.out.println("tplId ----" + tplId);
		System.out.println("id ----" + id);
		DeductTplQry qry = new DeductTplQry();
		qry.setId(tplId);
		qry.setDeductTemplateId(id);
		
		List<DeductTplVo> list = deductTemplateMapper.selectByExample(qry);
		if(CollectionUtils.isNotEmpty(list)){
			return  list.get(0);		
		}
		return null;
	}
	
	
	@POST
	@Path("/uploadmulti")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Override
	public Object uploadmulti(MultipartFormDataInput input) {
		System.out.println("进入业务逻辑");
//		MultipartFormDataReader

		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();

		InputStream inputStream = null;
		OutputStream outStream = null;
		final String DIRCTORY = "D:/temp/datainputmulti/";
		//取得文件表单名
		try {
			for (Iterator<Entry<String, List<InputPart>>> it = uploadForm.entrySet().iterator() ; it.hasNext() ;) {
				Entry<String, List<InputPart>> entry = it.next();
				List<InputPart> inputParts = entry.getValue();

				initDirectory(DIRCTORY);
				for (InputPart inputPart : inputParts) {
						// 文件名称  
						String fileName = getFileName(inputPart.getHeaders());
						inputStream = inputPart.getBody(InputStream.class, null);
						//把文件流保存;
						File file = new File(DIRCTORY + fileName);
						
						
						int index;
						byte[] bytes = new byte[1024];
						outStream = new FileOutputStream(file);
						while ((index = inputStream.read(bytes)) != -1) {
							outStream.write(bytes, 0, index);
							outStream.flush();
						}

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally {

			if(null != inputStream){
				try {
					inputStream.close();
				} catch (IOException e) {
				}
			}
			if(null != outStream){
				try {
					outStream.close();
				} catch (IOException e) {
				}
			}
		
		}
		

		return Response.ok().build();
	}
	
	@POST
	@Path("/upmulti")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces("application/json;charset=UTF-8")
	@Override
	public Response upload(@MultipartForm DiskFileMulti diskFile) {
		
		System.out.println("进入业务逻辑");
		System.err.println("MultipartForm_DiskFile:" + diskFile);
		
		
		//使用@MultipartForm，暂时无法获取到fileName属性，详见：https://issues.jboss.org/browse/RESTEASY-1069?_sscc=t
		try {
			final String DIRCTORY = "D:/temp/formmulti/";
			initDirectory(DIRCTORY);
			
//			String newName = getNewName(diskFile.getFileName());
			String newName1 = diskFile.getFileName1();
			File file1 = new File(DIRCTORY + newName1);
			FileUtils.writeByteArrayToFile(file1, diskFile.getFileDate1());
			
			String newName2 = diskFile.getFileName2();
			File file2 = new File(DIRCTORY + newName2);
			FileUtils.writeByteArrayToFile(file2, diskFile.getFileDate2());

			return Response.ok("文件上传成功").build();
		} catch (IOException e) {
			e.printStackTrace();
			return Response.serverError().build();
		}
//		Message message = new Message(true, "文件上传成功！");
//		return Response.ok(message).build();
	}
	
}
