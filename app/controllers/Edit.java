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

    public static void newComic() {
        response.removeCookie("comicid");
        renderTemplate("Application/edit.html");
    }

    public static void createImage() {

        BufferedImage imageWithCaption = ImageHelpers.decodeToImage(params.get("imageWithCaption"));
        BufferedImage imageNoCaption = ImageHelpers.decodeToImage(params.get("imageNoCaption"));
        int top = Integer.parseInt(params.get("top"));
        int left = Integer.parseInt(params.get("left"));
        int width = Integer.parseInt(params.get("width"));
        int height = Integer.parseInt(params.get("height"));

        /*
        UUID uuid = UUID.randomUUID();
        String frameId =  uuid.toString().substring(0, 5);
        */

        Image image = null;

        // create new image in db
        image = new Image();  // comic created with new random ID.
        image.setPublished(true);
        ImageStore.save(image);

        imageWithCaption = ImageHelpers.cropImage(imageWithCaption, top, left, width, height);
        imageNoCaption = ImageHelpers.cropImage(imageNoCaption, top, left, width, height);

        FrameDO.save(imageWithCaption, image.getId(), image.getId(), "");
        FrameDO.save(imageNoCaption, image.getId(), image.getId(), "_t");

        renderTemplate("Application/document.html", image);
    }

    public static void createImageAjax() {

        try{
            BufferedImage imageWithCaption = ImageHelpers.decodeToImage(params.get("imageWithCaption"));
            BufferedImage imageNoCaption = ImageHelpers.decodeToImage(params.get("imageNoCaption"));
            /*
            int top = Integer.parseInt(params.get("top"));
            int left = Integer.parseInt(params.get("left"));
            int width = Integer.parseInt(params.get("width"));
            int height = Integer.parseInt(params.get("height"));
            */

            Image image = null;

            // create new image in db
            image = new Image();  // image created with new random ID.
            image.setPublished(true);
            ImageStore.save(image);

            //FrameDO.save(imageWithCaption, image.getId(), image.getId(), "_o");

            //imageWithCaption = ImageHelpers.cropImage(imageWithCaption, top, left, width, height);
            //imageNoCaption = ImageHelpers.cropImage(imageNoCaption, top, left, width, height);

            FrameDO.save(imageWithCaption, image.getId(), image.getId(), "");
            FrameDO.save(imageNoCaption, image.getId(), image.getId(), "_t");

            renderJSON("{\"imageId\": \"" + image.getId() + "\"}");
        }
        catch(Exception ex) {
            renderJSON("{\"error\": \"" + ex.getMessage() + "\"}");
        }

    }

    /*
    public static void order(String comicId, String frameId, String direction) {
        Comic comic = ComicStore.get(comicId);
        int sourceIndex = comic.getFrames().indexOf(frameId);
        int destinationIndex = (direction.equals("up") ? sourceIndex - 1 : sourceIndex + 1);
        ArrayList<String> frames = comic.getFrames();
        Collections.swap(frames, sourceIndex, destinationIndex);
        comic.setFrames(frames);
        ComicStore.update(comic);
        renderTemplate("Application/edit.html", comic);
    }

    public static void removeFrame(String comicId, String frameId) {
        Comic comic = ComicStore.get(comicId);
        int index = comic.getFrames().indexOf(frameId);
        ArrayList<String> frames = comic.getFrames();
        frames.remove(index);
        comic.setFrames(frames);
        ComicStore.update(comic);
        renderTemplate("Application/edit.html", comic);
    }

    public static void finalizeComic(String comicId) {
        Comic comic = ComicStore.get(comicId);
        stackFrames(comic, false);
        stackFrames(comic, true);
        comic.setPublished(true);
        ComicStore.update(comic);
        renderTemplate("Application/edit.html", comic);
    }

    private static void stackFrames(Comic comic, boolean isTemplate) {
        try {
            int totalHeight = 0;
            int maxWidth = 0;
            String path = Play.getFile("").getAbsolutePath() + Play.configuration.getProperty("comicfolder") + File.separator + comic.getId() + File.separator;
            ArrayList<BufferedImage> images = new ArrayList<BufferedImage>();
            ArrayList<String> frames = comic.getFrames();
            for(int i=0; i<frames.size(); i++) {
                BufferedImage img = ImageIO.read(new File(path, frames.get(i) + (isTemplate ? "_t" : "") + ".png"));
                images.add(img);
                totalHeight += img.getHeight();
                if (img.getWidth() > maxWidth) {
                    maxWidth = img.getWidth();
                }
            }
            BufferedImage stackedImage = ImageHelpers.stackImages(maxWidth, totalHeight, images);
            FrameDO.save(stackedImage, comic.getId(), comic.getId() + (isTemplate ? "_t" : ""), "");
        }
        catch(Exception ex) {}
    }

    */

}
