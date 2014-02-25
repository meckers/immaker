var ClipNote = ClipNote || {};

ClipNote.MouseState = {
    NO_SELECTION: 'no selection',
    SELECTING: 'selecting',
    SELECTION_MADE: 'selection made'
};

ClipNote.MouseSelection = {

    state: ClipNote.MouseState.NO_SELECTION,

    shroudi: null,
    shroudl: null,
    shroudo: null,
    shroudu: null,
    shroudr: null,

    handlers: {
        'mousedown': null,
        'mouseup': null,
        'mousemove': null,

        set: function(evt, func) {
            if (this[evt] === null) {
                this[evt] = func;
                $('body').bind(evt, func);
            }
            console.log('set', evt ,'. down=', this.mousedown !== null, "up=", this.mouseup !== null, "move=", this.mousemove !== null);
        },

        unset: function(evt) {
            if (this[evt] !== null) {
                $('body').unbind(evt, this[evt]);
                this[evt] = null;
            }
            console.log('unset', evt ,'. down=', this.mousedown !== null, "up=", this.mouseup !== null, "move=", this.mousemove !== null);
        }
    },

	init: function(callback) {

		this.callback = callback;
		var me = this;

		this.handlers.set('mousedown', function (e) {
			me.handleMouseDown(e);
		}); /*.on('mouseup', function(e) {
			me.handleMouseUp(e);
		}).on('mousemove', function(e) {
			me.handleMouseMove(e);
		});*/

        this.createShroud();
	},


	destroyElement: function() {
        if (this.element !== undefined) {
            this.element.remove();
            this.element = undefined;
        }
	},

    setState: function(state) {
        this.state = state;
    },

	handleMouseDown: function(e) {
        var me = this;

        if (e.which == 3 && this.state == ClipNote.MouseState.SELECTION_MADE) {
            this.reset();
        }
        else if (e.which == 1 && this.state == ClipNote.MouseState.NO_SELECTION) {

            this.handlers.set('mousemove', function(e) {
                me.handleMouseMove(e);
            });


            //this.isDrawing = true
            this.setState(ClipNote.MouseState.SELECTING);
            this.startX = parseInt(e.clientX);
            this.startY = parseInt(e.clientY);
            e.stopPropagation();
        }

        ClipNote.Messages.sendMessage("SELECTING");
	},

    isTooSmall: function() {
        return this.element === undefined || this.element === null || this.element.width() < 50 || this.element.height() < 50;
    },

    reset: function() {
        this.destroyElement();
        this.removeShroud();
        this.setState(ClipNote.MouseState.NO_SELECTION);
        setTimeout(function() {$('body').unbind('contextmenu');}, 500);
    },

	handleMouseUp: function(e) {
        var me = this;
        if (e.which == 1 && this.state == ClipNote.MouseState.SELECTING) {
            if (!this.isTooSmall()) {
                this.setState(ClipNote.MouseState.SELECTION_MADE);
                this.removeShroud();
                if (this.callback) {
                    this.callback(this.element);
                }
                ClipNote.Messages.sendMessage("POST_SELECTION");

                $("body").bind('contextmenu', function(e) {
                    return false;
                });

                this.handlers.unset('mousemove');
                this.handlers.unset('mouseup');

            }
            else {
                this.reset();
            }
            // TOOD: fixa ett smidigt sätt att kunna börja om med sin markering
            /*$("body").off('mousedown');
            $("body").off('mousemove');
            $("body").off('mouseup');*/

        }

        e.stopPropagation();
        e.preventDefault();
	},

    handleMouseMove: function(e) {

        var me = this;

        //if (this.isDrawing) {
        if (this.state == ClipNote.MouseState.SELECTING) {

            this.handlers.set('mouseup', function(e) {
                me.handleMouseUp(e);
            });

            var mouseX = parseInt(e.clientX);
            var mouseY = parseInt(e.clientY);
            var elementWidth = mouseX - this.startX;
            var elementHeight = mouseY - this.startY;

            if (elementHeight > 5) {

                if (!this.element) {
                    this.element = this.createElement();
                    $("body").append(this.element);
                    this.createShroud();
                }

                this.element.css('width', mouseX - this.startX);
                this.element.css('height', mouseY - this.startY);
                this.transformShroud(mouseX, mouseY);
            }
            else if (this.element) {
                this.element.remove();
                this.removeShroud();
            }

            e.stopPropagation();
        }
    },

    createShroud: function() {
        if(this.shroudi) {
            this.shroudi.remove();
        }

        this.shroudl = $("<div></div>").addClass('shroud left');
        this.shroudo = $("<div></div>").addClass('shroud over');
        this.shroudu = $("<div></div>").addClass('shroud under');
        this.shroudr = $("<div></div>").addClass('shroud right');

        $("body").append(this.element);
        $("body").append(this.shroudl);
        $("body").append(this.shroudo);
        $("body").append(this.shroudu);
        $("body").append(this.shroudr);

        this.shroudo.css('left', this.startX);
        this.shroudl.css('height', $("body").height());
        this.shroudu.css('left', this.startX);
        this.shroudr.css('height', $("body").height());
    },

    removeShroud: function() {
        this.shroudl.remove();
        this.shroudo.remove();
        this.shroudu.remove();
        this.shroudr.remove();
    },

    transformShroud: function(mouseX, mouseY) {
        this.shroudl.css('width', this.startX);
        this.shroudo.css('height', this.startY);
        this.shroudo.css('width', mouseX - this.startX);
        this.shroudu.css('height', $("body").height() - mouseY);
        this.shroudu.css('width', mouseX - this.startX);
        this.shroudr.css('width', $("body").width() - mouseX);
    },



	createElement: function() {
		var el = jQuery('<div></div>');
		el.addClass('mouse-selection');
		el.css('top', this.startY);
		el.css('left', this.startX);
		return el;
	},

	getValues: function() {
		return {
			top: this.element.offset().top,
			left: this.element.offset().left,
			width: this.element.width(),
			height: this.element.height()
		}
	},

    borderWidth: function() {
        return this.element.css('border-width').replace('px', '');
    },

	hideBorder: function() {
		//this.element.addClass('no-border');
	},

	showBorder: function() {
		//this.element.removeClass('no-border');
	}


}