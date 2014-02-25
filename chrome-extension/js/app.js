var ClipNote = ClipNote || {};

ClipNote.App = {
	
	frame: null,
	sidebar: null,
	baseUrl: 'http://localhost:9881',

	init: function() {
        $('body').addClass('eckersvcmaker');
		this.frame = ClipNote.Frame;
		this.registerListeners();
        ClipNote.Messages.init();
	},

	activate: function() {
		this.openSidebar();
		this.frame.init();
	},

    quit: function() {
        this.removeSidebar();
        chrome.runtime.sendMessage({
            command: "quit"
        });
    },

	registerListeners: function() {
		var me = this;
        Events.register("QUIT", this, function() {
            me.quit();
        })
	},

	openSidebar: function() {
        ClipNote.SideBar.init('body', this.baseUrl + '/edit');
	},

    removeSidebar: function() {
        ClipNote.SideBar.remove();
    },

	// Since I want to specify target, It seems I need to do this via an injected form:
	postData: function(imageWithCaption, image, top, left, width, height) {
		var fform = $('<form></form>');
		fform.attr({
			'id': 'chinti_uploadform',
			'method': 'POST',
			'target': 'chinti_edit',
			'enctype': 'multipart/form-data',
			'action': this.baseUrl + '/edit/add'
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
	}	
}