package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

public class Application extends Controller {

    public static void index(String comicId) {
        Comic comic = null;
        if (comicId != null) {
            comic = ComicStore.get(comicId);
            if (comic.getPublished()) {
                renderTemplate("Application/document.html", comic);
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