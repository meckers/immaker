package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

public class Application extends Controller {

    public static void index(String imageId) {

        String yaypegsId = request.cookies.get("yaypegs-id") != null ? request.cookies.get("yaypegs-id").value : null;

        Image image = null;
        if (imageId != null) {
            image = ImageStore.get(imageId);

            boolean imageOwner = image.getYaypegsId().equals(yaypegsId);

            if (image.getPublished()) {
                renderTemplate("Application/document.html", image, imageOwner);
            }
        }
        renderTemplate("Application/document.html");
    }

    public static void edit(String id) {
        String comicId = null;
        Comic comic = null;
        Http.Cookie idCookie = request.cookies.get("comicid");
        if (idCookie != null) {
            comicId = idCookie.value;
            comic = ComicStore.get(comicId);
        }
        render(comic);
    }

}