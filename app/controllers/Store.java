package controllers;

import com.google.gson.*;
import org.lightcouch.CouchDbClient;
import play.mvc.Controller;

import java.util.UUID;

public class Store extends Controller {

    public static void save(String id, String title, String thebody) {
        String debugmessage = "nothing happened";
        String action = "";

        // Save to couchdb
        try {
            CouchDbClient dbClient = new CouchDbClient();

            JsonObject json = new JsonObject();

            UUID uuid = UUID.randomUUID();

            if (id == null) {
                id = uuid.toString().substring(0, 4);
            }

            //JsonParser parser = new JsonParser();
            /*
            JsonElement jsonElement = parser.parse(jsonObject.toString());
            JsonObject gsonObject = jsonElement.getAsJsonObject();
            */
            //JsonArray gsonArray = stepsElement.getAsJsonArray();

            json.addProperty("_id", id);
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
        }

        renderJSON("{\"debuginfo\": \"" + debugmessage + "\"," + "\"id\": \"" + id + "\"}");
    }

    public static void load(String id) {
        JsonObject json = null;
        CouchDbClient dbClient = new CouchDbClient();
        try {
            json = dbClient.find(JsonObject.class, id);
        }
        catch (Exception ex) {

        }

        renderJSON(json);
    }

}
