var MacroMaker = MacroMaker || {};

MacroMaker.Frame = Class.extend({

	element: null,
	image: null,
	imageWithCaption: null,
	text: null,
	textEditor: null,
    textEditorTop: null,
	mouseSelection: null,

	init: function() {
		this.textEditor = new MacroMaker.TextEditor();
        this.textEditorTop = new MacroMaker.TextEditor();
		this.mouseSelection = MacroMaker.MouseSelection;
        this.mouseSelection.init('body');
		this.registerListeners();
        console.log("inited");
	},

    create: function(box) {
        this.element = box;
        this.textEditor.create(box, "bottom");
        this.textEditorTop.create(box, "top");
        this.createGrabButton();
        this.createCancelButton();
    },

    destroy: function() {
        this.element.remove();
        this.element = null;
        //this.textEditor.destroy();
        //this.textEditorTop.destroy();
        //this.destroyButtons();
    },

	registerListeners: function() {
		var me = this;
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			me.onMessage(request, sender, sendResponse);
		});

        Events.register("BOX_SELECTION_COMPLETE", this, function(box) {
            me.onSelectionComplete(box);
        });
	},

	onMessage: function(request, sender, sendResponse) {
		if (request.originalCommand == 'capture-tab') {
			this.onCaptureResponse(request);
		}
	},

	onSelectionComplete: function(box) {
        this.create(box);
	},

	createGrabButton: function() {
		var me = this;
		var grabButton = jQuery("<div></div>");
        grabButton.html("SAVE & SHARE");
        grabButton.addClass("imkr button hanging save positive");
        grabButton.click(function() {
			me.grabFrame();
		});
		this.element.append(grabButton);
	},

    createCancelButton: function() {
        var me = this;
        var cancelButton = jQuery("<div></div>");
        cancelButton.html("CANCEL SELECTION");
        cancelButton.addClass("imkr button hanging cancel negative");
        cancelButton.click(function() {
            Events.trigger("CANCEL_SELECTION_CLICK");
        });
        this.element.append(cancelButton);
    },

    destroyButtons: function() {
        $('.imkr.button').remove();
    },

    cancelSelection: function() {
        Events.trigger("SELECTION_CANCELLED");
    },

	grabFrame: function() {
		var me = this;
		//this.mouseSelection.hideBorder();
		this.captureImages(function() {
			//me.mouseSelection.showBorder();
            //ClipNote.Messages.sendMessage("POST_GRAB");
		});
	},

	captureImages: function(callback) {
		var me = this;
		chrome.runtime.sendMessage({
			command: "capture-tab"
		}, function(response) {
			//document.getElementById('chinti-texteditor').style.display = 'none';
            $(".caption").css('display', 'none');
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
                        $(".caption").css('display', 'block');
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

	getValues: function() {
        var values = this.mouseSelection.getValues();
        var borderWidth = parseInt(this.mouseSelection.borderWidth());
        console.log("border width", borderWidth);
        values.top += borderWidth;
        values.left += borderWidth;
        values.width -= borderWidth;
        values.height -= borderWidth;
        console.log(values);
		return values;
	}

});