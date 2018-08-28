package com.wjs.member.temp;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;


public class ImageModify {

	public static void main(String[] a) {

		ImageModify.createStringMark("E://1.jpg", "adssssssssssss", Color.RED, 100, "E://2.jpg");

		String imageQrCOde = "E://qrcode.jpg";

		try {
			File file1 = new File("E://1.jpg");
			File file2 = new File(imageQrCOde);
			File fileTartget = new File("E://tartget.jpg");
			BufferedImage image1 = ImageIO.read(file1);
			BufferedImage image2 = ImageIO.read(file2);
			mergeImage(image1, image2, fileTartget);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	//给jpg添加文字
	public static boolean createStringMark(String filePath, String markContent, Color markContentColor, float qualNum, String outPath) {

		ImageIcon imgIcon = new ImageIcon(filePath);
		Image theImg = imgIcon.getImage();
		int width = theImg.getWidth(null) == -1 ? 200 : theImg.getWidth(null);
		int height = theImg.getHeight(null) == -1 ? 200 : theImg.getHeight(null);
		System.out.println(width);
		System.out.println(height);
		System.out.println(theImg);
		BufferedImage bimage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D g = bimage.createGraphics();
		g.setColor(markContentColor);
		g.setBackground(Color.red);
		g.drawImage(theImg, 0, 0, null);
		g.setFont(new Font(null, Font.BOLD, 15)); //字体、字型、字号 
		g.drawString(markContent, 11, height / 2); //画文字 
		g.dispose();
		try {
//			FileOutputStream out = new FileOutputStream(outPath); //先用一个特定的输出文件名 
//			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
//			JPEGEncodeParam param = encoder.getDefaultJPEGEncodeParam(bimage);
//			param.setQuality(qualNum, true);
//			encoder.encode(bimage, param);
			ImageIO.write(bimage, "JPG", new File(outPath) /* target */ );
//			out.close();
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	//给jpg添加图片
	public static void mergeImage(BufferedImage image1, BufferedImage image2, File mergeFile) throws IOException {

		BufferedImage combined = new BufferedImage(image1.getWidth() * 2, image1.getHeight(), BufferedImage.TYPE_INT_RGB);

		// paint both images, preserving the alpha channels
		Graphics g = combined.getGraphics();
		g.drawImage(image1, 0, 0, null);
		g.drawImage(image2, image1.getWidth(), 0, null);

		// Save as new image
		ImageIO.write(combined, "JPG", mergeFile);
	}

}