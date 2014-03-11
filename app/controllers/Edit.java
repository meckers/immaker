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
            BufferedImage imageWithCaption = ImageHelpers.decodeToImage(params.get("imageWithCaption"));
            BufferedImage imageNoCaption = ImageHelpers.decodeToImage(params.get("imageNoCaption"));

            Image image = null;

            // create new image in db
            image = new Image();  // image created with new random ID.
            image.setPublished(true);
            ImageStore.save(image);

            FrameDO.save(imageWithCaption, image.getId(), image.getId(), "");
            FrameDO.save(imageNoCaption, image.getId(), image.getId(), "_t");

            renderJSON("{\"imageId\": \"" + image.getId() + "\"}");
        }
        catch(Exception ex) {
            renderJSON("{\"error\": \"" + ex.getMessage() + "\"}");
        }

    }
}
