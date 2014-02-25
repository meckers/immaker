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
            String contentFolder = publicFolder + File.separator + "comiccontent";
            String comicFolder = contentFolder + File.separator + folder;

            File dir = new File(comicFolder);
            if (!dir.exists()) {
                dir.mkdir();
            }

            String filePath = comicFolder + File.separator + fileName + fileNameSuffix + ".png";

            ImageIO.write(image, "png", new File(filePath));
        }
        catch(Exception ex) {

        }
    }
}
