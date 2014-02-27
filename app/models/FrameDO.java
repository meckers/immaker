package models;

import play.Play;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class FrameDO {

    public static void save(BufferedImage image, String folder, String fileName, String fileNameSuffix) {
        try {
            String appFolder = Play.getFile("").getAbsolutePath();
            String publicFolder = appFolder + File.separator + "public";
            String contentFolder = publicFolder + File.separator + "content";
            String imageFolder = contentFolder + File.separator + folder;

            File dir = new File(imageFolder);
            if (!dir.exists()) {
                dir.mkdir();
            }

            String filePath = imageFolder + File.separator + fileName + fileNameSuffix + ".png";

            ImageIO.write(image, "png", new File(filePath));
        }
        catch(Exception ex) {

        }
    }
}
