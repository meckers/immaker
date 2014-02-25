package models;

import com.google.gson.JsonObject;
import org.lightcouch.CouchDbClient;
import org.lightcouch.Response;

import java.util.UUID;

public class ComicStore {

    public static Comic get(String comicId) {
        CouchDbClient client = new CouchDbClient();
        Comic comic = client.find(Comic.class, comicId);
        return comic;
    }

    public static String update(Comic comic) {

        String result = "";

        try {
            CouchDbClient client = new CouchDbClient();
            Response response = client.update(comic);
            result = response.toString();
        }
        catch (Exception ex) {
            result = ex.getMessage();
        }

        return result;
    }

    public static String save(Comic comic) {

        String result = "";

        try {
            CouchDbClient client = new CouchDbClient();
            Response response = client.save(comic);
            result = response.toString();
        }
        catch (Exception ex) {
            result = ex.getMessage();
        }



        /*
        try {
            CouchDbClient dbClient = new CouchDbClient();

            JsonObject json = new JsonObject();

            json.addProperty("_id", comic.getId());
            json.addProperty("title", title);
            json.addProperty("body", thebody);

            if (dbClient.contains(id)) {
                json = dbClient.find(JsonObject.class, id);
                if (json != null) {
                    String rev = json.get("_rev").toString().replaceAll("\"", "");
                    json.addProperty("_rev", rev);
                    json.addProperty("title", title);
                    json.addProperty("body", thebody);
                    action = "updated!";
                    dbClient.update(json);
                }
            }
            else {
                action = "created!";
                dbClient.save(json);
            }

            dbClient.shutdown();
            debugmessage = "it seemed to work, we " + action;
        }
        catch (Exception ex) {
            debugmessage = ex.getMessage();
        }       */
        return result;
    }
}
