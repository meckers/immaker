package models;

import java.util.ArrayList;
import java.util.UUID;

/**
 * Created with IntelliJ IDEA.
 * User: magnus
 * Date: 2014-02-25
 * Time: 13:47
 * To change this template use File | Settings | File Templates.
 */
public class Image {
    private String _id;
    private String _rev;
    private boolean published = false;
    private String text1;
    private String text2;
    private String textIdentifier;


    public Image() {
        UUID uuid = UUID.randomUUID();
        this._id = uuid.toString().substring(0, 5);
    }

    public Image(String id) {
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

    public boolean getPublished() {
        return this.published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getText1() {
        return this.text1;
    }

    public void setText1(String text) {
        this.text1 = text;
    }

    public String getText2() {
        return this.text2;
    }

    public void setText2(String text) {
        this.text2 = text;
    }

    public String getTextIdentifier() {
        return this.textIdentifier;
    }

    public void setTextIdentifier(String text) {
        this.textIdentifier = text;
    }
}
