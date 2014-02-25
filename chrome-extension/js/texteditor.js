var ClipNote = ClipNote || {};

ClipNote.TextEditor = Class.extend({

	hidden: false,
    editMode: false,

    init: function() {

    },

	create: function(container, dockLocation) {
		var me = this;
		this.$container = $(container);
		this.element = jQuery("<div></div>");
		this.element.attr('id', 'chinti-texteditor');
		this.element.addClass('caption');
		this.element.addClass('outlined');

		this.width = Math.ceil(this.$container.width() * 0.66);
		this.height = Math.ceil(this.$container.height() * 0.2);
        this.fontSize = Math.ceil(this.height * 0.5);

		this.element.css({
			'width': this.width + 'px',
			'left': (this.$container.width()/2) - this.width/2 + 'px',
            'font-size': this.fontSize + 'px'
		});

        this.element.css(dockLocation, '0px');
		this.element.attr('contenteditable', 'true');
		this.element.attr('spellcheck', 'false');
		this.element.html('Enter your caption');
		this.element.on('click', function() {
			me.focus();
		});

		this.element.on('blur', function() {	
			me.element.off('keypress keydown keyup');
		});

		jQuery(container).append(this.element);

		//this.focus();
	},

    enterInitialMode: function() {
        var me = this;
        this.element.removeClass('edit-mode');
        this.element.addClass('initial-mode');
        var $textDiv = $('<div></div>').html("CLICK HERE TO ENTER TEXT").addClass('text');
        $textDiv.on('click', function() {
            me.enterInputMode();
            me.focus();
        })
        this.element.append($textDiv);
    },

    enterInputMode: function() {
        this.element.removeClass('inital-mode');
        this.element.addClass('edit-mode');
        this.element.empty();
    },

	focus: function() {
		this.selectAll(); // also automatically sets focus.
		this.kkk = this.element.on('keypress keydown keyup', function(ev) {
			ev.stopPropagation();
		});
	},

	selectAll: function() {
		var range = document.createRange();
		range.selectNodeContents(this.element[0]);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);		
	},

	hide: function() {		
		this.element.addClass('hidden');
		//this.hidden = true;
	},

	show: function() {
		this.element.removeClass('hidden');
		//this.hidden = false;
	}
});