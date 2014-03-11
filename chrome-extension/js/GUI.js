MacroMaker = MacroMaker || {};

MacroMaker.GUI = Class.extend({

    container: null,
    progressImage: null,
    canvas: null,

    init: function(container) {
        this.id = Math.ceil(Math.random()*1000);
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

        this.textTop = new MacroMaker.TextEditor(this.mouseSelection.getBox(), "bottom");
        this.mouseSelection.appendElement(this.textTop.getElement());
        this.textBottom = new MacroMaker.TextEditor(this.mouseSelection.getBox(), "top");
        this.mouseSelection.appendElement(this.textBottom.getElement());

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
        var me = this;
        this.captureImagesWithCanvas(function() {
            //me.mouseSelection.showBorder();
            //ClipNote.Messages.sendMessage("POST_GRAB");
        });
    },

    captureImagesWithCanvas: function() {
        var me = this;
        var selectionValues = this.getValues();
        var isRetina = window.devicePixelRatio > 1;
        var multiplier = isRetina ? 2 : 1;

        console.log("selection values", selectionValues, "multiplier", multiplier);
        chrome.runtime.sendMessage({command:"capture-tab"}, function(response) {
            if (!me.canvas) {
                me.canvas = $("<canvas></canvas>");
                me.canvas.css({
                    'display': 'none'
                });
                $('body').append(me.canvas);
            }

            var image = new Image();
            image.onload = function() {
                var cvs = me.canvas[0];
                cvs.width = selectionValues.width * multiplier;
                cvs.height = selectionValues.height * multiplier;
                var context = cvs.getContext('2d');
                context.drawImage(image,
                    selectionValues.left * multiplier,
                    selectionValues.top * multiplier,
                    selectionValues.width * multiplier,
                    selectionValues.height * multiplier,
                    0, 0,
                    selectionValues.width * multiplier,
                    selectionValues.height * multiplier
                );

                me.imageWithCaption = cvs.toDataURL("image/png");
                me.image = me.imageWithCaption;
                me.checkIfReadyToPost();
            }

            image.src = response.image;
        });
    },

    doCapture: function() {

    },

    captureImages: function(callback) {
        var me = this;
        chrome.runtime.sendMessage({
            command: "capture-tab"
        }, function(response) {
            //document.getElementById('chinti-texteditor').style.display = 'none';
            $(".imkr-caption").css('display', 'none');
            if (response.image) {
                me.imageWithCaption = response.image;
            }
            //me.textEditor.show();

            // TODO: DETTA MÅSTE FIXAS, vi kan inte förlita oss på en setTimout.
            setTimeout(function() {
                chrome.runtime.sendMessage({
                    command: "capture-tab"
                }, function(secondResponse) {
                    if (secondResponse.image) {
                        me.image = secondResponse.image;
                        //document.getElementById('chinti-texteditor').style.display = 'block';
                        $(".imkr-caption").css('display', 'block');
                        me.checkIfReadyToPost();
                        if (callback) {
                            callback();
                        }
                    }
                });
            }, 500);

        });
    },

    checkIfReadyToPost: function() {
        if (this.imageWithCaption && this.image) {
            var values = this.getValues();
            console.log(this.imageWithCaption.substr(this.imageWithCaption.length-10), this.image.substr(this.image.length-10));
            MacroMaker.App.postDataAjax(this.imageWithCaption, this.image, values.top, values.left, values.width, values.height);
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
        /*
        if (this.grabButton) {
            this.grabButton.remove();
        }
        if (this.cancelButton) {
            this.cancelButton.remove();
        } */
    }

});