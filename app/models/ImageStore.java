package models;

import org.lightcouch.CouchDbClient;
import org.lightcouch.Response;


public class ImageStore {

    public static Image get(String imageId) {
        CouchDbClient client = new CouchDbClient();
        Image image = client.find(Image.class, imageId);
        return image;
    }

    public static String update(Image image) {

        String result = "";

        try {
            CouchDbClient client = new CouchDbClient();
            Response response = client.update(image);
            result = response.toString();
        }
        catch (Exception ex) {
            result = ex.getMessage();
        }

        return result;
    }

    public static String save(Image image) {

        String result = "";

        try {
            CouchDbClient client = new CouchDbClient();
            Response response = client.save(image);
            result = response.toString();
        }
        catch (Exception ex) {
            result = ex.getMessage();
        }

        return result;
    }

}
