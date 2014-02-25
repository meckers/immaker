package models;

import java.util.ArrayList;
import java.util.UUID;

public class Comic {

    private String _id;
    private String _rev;
    private ArrayList<String> frames;
    private boolean published = false;


    public Comic() {
        UUID uuid = UUID.randomUUID();
        this._id = uuid.toString().substring(0, 5);
        this.frames = new ArrayList<String>();
    }

    public Comic(String id) {
        if (id != null) {
            // Fyll från databas...
        }
    }

    public String getId() {
        return this._id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public String getRev() {
        return this._rev;
    }

    public void setRev(String rev) {
        this._rev = rev;
    }

    public ArrayList<String> getFrames() {
        return this.frames;
    }

    public void setFrames(ArrayList<String> frames) {
        this.frames = frames;
    }


    public boolean getPublished() {
        return this.published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }
}
