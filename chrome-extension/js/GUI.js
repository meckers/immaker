MacroMaker = MacroMaker || {};

MacroMaker.GUI = Class.extend({

    container: null,
    progressImage: null,
    canvas: null,
    images: null,

    init: function(container) {
        this.id = Math.ceil(Math.random()*1000);
        var me = this;
        this.container = $(container);
        //this.shroud = new MacroMaker.shroud(this.container);
        this.mouseSelection = new MacroMaker.MouseSelection({
            container: container,
            shroud: true
        });
        this.initImages();
        this.listen();
    },

    initImages: function() {
        this.images = {
            captioned : "",
            uncaptioned : ""
        };
    },

    listen: function() {
        var me = this;
        MacroMaker.Events.register('BOX_DRAW_END', this, function(e) {
            me.onMouseSelectionComplete();
        });
        MacroMaker.Events.register('IMAGE_SAVE_COMPLETE', this, function() {
            me.hideProgressIcon();
            me.enableButton(me.grabButton);
        })
    },

    onMouseSelectionComplete: function() {
        var me = this;
        //this.selection = e.selection;
        this.grabButton = this.createButton("SAVE & SHARE", "save", "positive", function() {
            if (me.grabButton.hasClass('imkr-disabled') === false) {
                console.log("GRABBING!");
                me.disableButton(me.grabButton);
                me.showProgressIcon();
                me.grab();
            }
            else {
                console.log("NO GRAB FOR YOU");
            }
        });
        this.mouseSelection.appendElement(this.grabButton);
        this.cancelButton = this.createButton("CANCEL", "cancel", "negative", function() {
            MacroMaker.Events.trigger("QUIT", null);
        });
        this.mouseSelection.appendElement(this.cancelButton);

        this.textTop = new MacroMaker.TextEditor(this.mouseSelection.getBox(), "top");
        this.mouseSelection.appendElement(this.textTop.getElement());
        this.textBottom = new MacroMaker.TextEditor(this.mouseSelection.getBox(), "bottom");
        this.mouseSelection.appendElement(this.textBottom.getElement());

        this.textTop.focus();

    },

    disableButton: function(button) {
        button.addClass('imkr-disabled');
    },

    enableButton: function(button) {
        button.removeClass('imkr-disabled');
    },

    createButton: function(text, name, style, callback) {
        var me = this;
        var button = jQuery("<div></div>");
        button.html(text);
        button.addClass("imkr imkr-button hanging " + name + " " + style);
        button.click(callback);
        return button;
    },

    grab: function() {
        this.captureImagesWithCanvas();
    },

    captureImagesWithCanvas: function() {
        var me = this;

        if (!this.canvas) {
            this.canvas = $("<canvas></canvas>");
            this.canvas.css({
                'display': 'none'
            });
            $('body').append(this.canvas);
        }

        chrome.runtime.sendMessage({command:"capture-tab"}, function(response) {
            me.processImage(response, me.canvas[0], "captioned");
            $(".imkr-caption").css('display', 'none');
            // TODO: DETTA MÅSTE FIXAS, vi kan inte förlita oss på en setTimout.
            window.setTimeout(function() {
                chrome.runtime.sendMessage({command:"capture-tab"}, function(secondResponse) {
                    me.processImage(secondResponse, me.canvas[0], "uncaptioned");
                });
            }, 500);
        });
    },

    processImage: function(response, canvas, target) {
        console.log("processing image", response, canvas, target);
        var me = this;
        var image = new Image();
        image.onload = function() {
            console.log("image loaded");
            me.images[target] = me.cropImage(image, canvas);
            me.checkIfReadyToPost();
        };
        image.src = response.image;
    },

    cropImage: function(image, canvas) {
        var selectionValues = this.getValues();
        var multiplier = window.devicePixelRatio;
        canvas.width = selectionValues.width;
        canvas.height = selectionValues.height;
        var context = canvas.getContext('2d');

        if (multiplier == 2) {
            context.scale(0.5, 0.5);
        }

        context.drawImage(image,
            selectionValues.left * multiplier,
            selectionValues.top * multiplier,
            selectionValues.width * multiplier,
            selectionValues.height * multiplier,
            0, 0,
            selectionValues.width * multiplier,
            selectionValues.height * multiplier
        );



        return canvas.toDataURL("image/png");
    },

    checkIfReadyToPost: function() {
        console.log("checking if ready to post");
        if (this.images.captioned !== "" && this.images.uncaptioned !== "") {
            var values = this.getValues();
            console.log(this.images.captioned.substr(this.images.captioned.length-10), this.images.uncaptioned.substr(this.images.uncaptioned.length-10));
            var text1 = this.textTop.getText();
            var text2 = this.textBottom.getText();
            MacroMaker.App.postDataAjax(this.images.captioned, this.images.uncaptioned, text1, text2);
            return true;
        }
    },

    showProgressIcon: function() {
        /*
        var url = chrome.extension.getURL('images/progress.gif');
        console.log("extension url", url);
        this.progressImage = $("<img/>");
        this.progressImage.attr('src', url);
        this.progressImage.addClass("imkr-progress");
        this.mouseSelection.getBox().append(this.progressImage);
        */
        this.grabButton.html("WORKING...");
    },

    hideProgressIcon: function() {
        //this.progressImage.remove();
    },

    getValues: function() {
        var values = this.mouseSelection.getValues();
        var borderWidth = parseInt(this.mouseSelection.borderWidth());
        values.top += borderWidth;
        values.left += borderWidth;
        values.width -= borderWidth;
        values.height -= borderWidth;
        console.log(values);
        return values;
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

        this.initImages();

        /*
        if (this.grabButton) {
            this.grabButton.remove();
        }
        if (this.cancelButton) {
            this.cancelButton.remove();
        } */
    }

});