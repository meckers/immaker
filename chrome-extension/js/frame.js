var ClipNote = ClipNote || {};

ClipNote.Frame = {

	element: null,
	image: null,
	imageWithCaption: null,
	text: null,
	textEditor: null,
    textEditorTop: null,
	mouseSelection: null,

	init: function() {
		//this.element = element;
		this.textEditor = new ClipNote.TextEditor();
        this.textEditorTop = new ClipNote.TextEditor();
		this.mouseSelection = ClipNote.MouseSelection;
        this.mouseSelection.init('body');
		//this.enableSelection();
		this.registerListeners();
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

    /*
	enableSelection: function() {
		var me = this;
		this.mouseSelection.init(function(element) {
			me.onSelectionComplete(element);
		});	
	},*/

	onSelectionComplete: function(box) {
		this.element = box;
		this.textEditor.create(box, "bottom");
        this.textEditorTop.create(box, "top");
		this.createGrabButton();
        this.createCancelButton();
	},

	createGrabButton: function() {
		var me = this;
		var ClipNote_snapshotButton = jQuery("<div></div>");
		ClipNote_snapshotButton.html("GRAB ->");
		//ClipNote_snapshotButton.addClass("hanging-button grab");
        ClipNote_snapshotButton.addClass("button selectiondocked positive");
		ClipNote_snapshotButton.click(function() {
			me.grabFrame();
		});
		this.element.append(ClipNote_snapshotButton);
	},

    createCancelButton: function() {
        var me = this;
        var cancelButton = jQuery("<div></div>");
        cancelButton.html("CANCEL SELECTION");
        cancelButton.addClass("hanging-button cancel");
        cancelButton.click(function() {
            //me.cancelSelection();
            Events.trigger("CANCEL_SELECTION_CLICK");

        });
        this.element.append(cancelButton);
    },

    cancelSelection: function() {
        //this.mouseSelection.cancel();
        //this.mouseSelection.reset();
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
			command: "capture-tab",
			test: '1'
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
					command: "capture-tab",
					test: '2'
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
			ClipNote.App.postData(this.imageWithCaption, this.image, values.top, values.left, values.width, values.height);
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

};