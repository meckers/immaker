var MacroMaker = MacroMaker || {};

MacroMaker.App = {
	
	frame: null,
	baseUrl: 'http://localhost:9881',

	init: function() {
		//this.frame = new MacroMaker.Frame();
        this.GUI = new MacroMaker.GUI('body');
        this.listen();
	},

    listen: function() {
        var me = this;
        Events.register('QUIT', this, function() {
            me.quit();
        })
    },

    quit: function() {
        this.GUI.destroy();
        this.GUI = null;
        chrome.runtime.sendMessage({
            command: "quit"
        });
    },

    /*
    quit: function() {

    },

	registerListeners: function() {
		var me = this;
        Events.register("QUIT", this, function() {
            me.quit();
        })
	},
    */


    postDataAjax: function(imageWithCaption, image, top, left, width, height) {

        var isRetina = window.devicePixelRatio > 1;
        var multiplier = isRetina ? 2 : 1;

        console.log("posting via AJAX. retina=", isRetina, "multiplier=", multiplier);

        var me = this;
        $.post(this.baseUrl + '/edit/createajax', {
            'imageWithCaption': imageWithCaption,
            'imageNoCaption': image,
            'top': top * multiplier,
            'left': left * multiplier,
            'width': width * multiplier,
            'height': height * multiplier,
            'retina': isRetina
        }, function(data) {
            console.log(data);
            if (data.imageId) {
                chrome.runtime.sendMessage({
                    command: "new-tab",
                    url: me.baseUrl + "/" + data.imageId
                });
                Events.trigger("IMAGE_SAVE_COMPLETE", data);
            }
        });
    }


	// Since I want to specify target, It seems I need to do this via an injected form:
    /*
	postData: function(imageWithCaption, image, top, left, width, height) {
        console.log("post data", top, left, width, height);
		var fform = $('<form></form>');
		fform.attr({
			'id': 'chinti_uploadform',
			'method': 'POST',
			'target': '_self',
			'enctype': 'multipart/form-data',
			'action': this.baseUrl + '/edit/create'
		});
		
		if ($("#chinti_uploadform")) {
			$("#chinti_uploadform").remove();
		}

		$('body').append(fform);
		this.appendInput('imageWithCaption', imageWithCaption, fform);
		this.appendInput('image', image, fform);
		this.appendInput('top', Math.ceil(top), fform);
		this.appendInput('left', Math.ceil(left), fform);
		this.appendInput('width', Math.ceil(width), fform);
		this.appendInput('height', Math.ceil(height), fform);
		$("#chinti_uploadform").submit();

	},

	appendInput: function(name, value, fform) {
	    var input = $('<input/>');
	    input.attr('type', 'hidden');
	    input.attr('name', name);
	    input.val(value);
	    fform.append(input);    
	}	    */
}