MacroMaker = MacroMaker || {};

MacroMaker.GUI = Class.extend({

    container: null,

    init: function(container) {
        var me = this;
        this.container = $(container);
        //this.shroud = new MacroMaker.shroud(this.container);
        this.mouseSelection = new MacroMaker.MouseSelection({
            container: container,
            shroud: true
        });
        this.listen();
    },

    listen: function() {
        var me = this;
        Events.register('MOUSE_SELECTION_COMPLETE', this, function(e) {
            me.onMouseSelectionComplete(e);
        });
    },

    onMouseSelectionComplete: function(e) {
        var me = this;
        //this.selection = e.selection;
        this.grabButton = this.createButton("SAVE & SHARE", "save", "positive", function() {
            me.grab();
        });
        this.mouseSelection.appendElement(this.grabButton);
        this.cancelButton = this.createButton("CANCEL", "cancel", "negative", function() {
            Events.trigger("QUIT", null);
        });
        this.mouseSelection.appendElement(this.cancelButton);

        this.textTop = new MacroMaker.TextEditor(this.mouseSelection.getBox(), "bottom");
        this.mouseSelection.appendElement(this.textTop.getElement());
        this.textBottom = new MacroMaker.TextEditor(this.mouseSelection.getBox(), "top");
        this.mouseSelection.appendElement(this.textBottom.getElement());
    },

    createButton: function(text, name, style, callback) {
        var me = this;
        var button = jQuery("<div></div>");
        button.html(text);
        button.addClass("imkr button hanging " + name + " " + style);
        button.click(callback);
        return button;
    },

    // Destroy all elements that are present.
    destroy: function() {

        // Shroud is always present:
        //this.shroud.destroy();
        //this.shroud = null;

        // Some elements may not be present, as they are not created until selection is defined.
        if (this.mouseSelection) {
            this.mouseSelection.destroy();
        }
        /*
        if (this.grabButton) {
            this.grabButton.remove();
        }
        if (this.cancelButton) {
            this.cancelButton.remove();
        } */
    }

});