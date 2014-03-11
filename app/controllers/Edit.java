package controllers;

import models.*;
import play.Play;
import play.mvc.Controller;
import play.mvc.Http;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.UUID;

public class Edit extends Controller {

    public static void createImageAjax() {

        try{

            String text1 = params.get("text1");
            String text2 = params.get("text2");

            BufferedImage imageWithCaption = ImageHelpers.decodeToImage(params.get("imageWithCaption"));
            BufferedImage imageNoCaption = ImageHelpers.decodeToImage(params.get("imageNoCaption"));

            Image image = null;

            // create new image in db
            image = new Image();  // image created with new random ID.
            image.setPublished(true);

            if (text1 != null) {
                image.setText1(text1);
            }

            if (text2 != null) {
                image.setText2(text2);
            }

            image.setTextIdentifier(createTextIdentifier(text1 + " " + text2));

            ImageStore.save(image);

            FrameDO.save(imageWithCaption, image.getId(), image.getId(), "");
            FrameDO.save(imageNoCaption, image.getId(), image.getId(), "_t");

            //renderJSON("{\"imageId\": \"" + image.getId() + "\"}");
            renderJSON(image);
        }
        catch(Exception ex) {
            renderJSON("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }

    private static String createTextIdentifier(String text) {
        if (text.length() < 50) {
            return text.replace(" ", "_");
        }
        else {
            String fifty = text.substring(0, 49);
            int lastSpaceIndex = fifty.lastIndexOf(" ");
            if (lastSpaceIndex != -1) {
                return fifty.substring(0, lastSpaceIndex).replace(" ", "_");
            }
            return fifty;
        }
    }
}
