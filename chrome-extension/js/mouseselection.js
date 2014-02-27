var MacroMaker = MacroMaker || {};

MacroMaker.MouseSelection = Class.extend({

    id: null,
    mouseDownHandler: null,
    mouseUpHandler: null,
    mouseMoveHandler: null,
    shroud: null,
    border: '3px dashed yellow',

    init: function(options) {
        this.id = Math.ceil(Math.random()*1000);
        this.$container = $(options.container) || $('body');
        if (options.shroud) {
            this.shroud = new MacroMaker.Shroud('body', 3);
        }
        this.activate();
        this.listen();
    },

    activate: function() {
        //this.shroud.activate();
        this.active = true;
    },

    listen: function() {
        var me = this;
        /*
        Events.register("START_SELECTION_BUTTON_CLICK", this, function() {
            me.activate();
            ClipNote.Messages.sendEvent("SELECTION_ACTIVATED");
        });
        Events.register("CANCEL_SELECTION_CLICK", this, function() {
            me.onCancelSelection();
        });
        Events.register("SAVE_AND_SHARE", this, function() {
            me.dismantle();
        })*/

        $('body').bind('mousedown', function(e) {
            me.handleMouseDown(e);
        });
        $('body').bind('mouseup', function(e) {
            me.handleMouseUp(e);
        });
        $('body').bind('mousemove', function(e) {
            me.handleMouseMove(e);
        });
    },


    handleMouseDown: function(e) {
        if (this.active && !this.done && e.which == 1) {
            this.startBoxDraw(e.pageX, e.pageY);
            e.stopPropagation();
        }
    },

    handleMouseUp: function(e) {
        console.log("mouse up on", this.id);
        if (this.active) {
            // if selecting:
            if (this.drawing) {
                this.endBoxDraw();
                e.stopPropagation();
                e.preventDefault();
                this.done = true;
                //this.shroud.remove();
            }
        }
    },

    handleMouseMove: function(e) {
        //console.log("M.M. pageXY=", e.pageX, e.pageY, "clientXY=", e.clientX, e.clientY);
        if (this.active) {
            if (this.drawing) {
                var mouseX = parseInt(e.pageX);
                var mouseY = parseInt(e.pageY);
                var boxWidth = mouseX - this.startX;
                var boxHeight = mouseY - this.startY;

                if (!this.box) {
                    this.box = this.createBox();
                    this.$container.append(this.box);
                }

                this.box.css('width', boxWidth);
                this.box.css('height', boxHeight);

                Events.trigger("BOX_DRAW", {x: mouseX, y: mouseY});

                e.stopPropagation();
                e.preventDefault();
            }
        }
    },

    createBox: function() {
        var el = jQuery('<div></div>');
        el.addClass('imkr mouse-selection');
        el.css('top', this.startY);
        el.css('left', this.startX);
        el.css('border', this.border);
        return el;
    },

    getBox: function() {
        return this.box;
    },

    startBoxDraw: function(x, y) {
        this.drawing = true;
        this.startX = x;
        this.startY = y;
        Events.trigger("BOX_DRAW_START", { x: x, y: y });
    },

    endBoxDraw: function() {
        this.drawing = false;
        if (!this.isTooSmall()) {
            if (this.callback) {
                this.callback(this.element);
            }
            Events.trigger("MOUSE_SELECTION_COMPLETE", this.box);
            //this.shroud.remove();
        }
        else {
            this.reset();
        }
    },

    isTooSmall: function() {
        return this.box === undefined || this.box === null || this.box.width() < 50 || this.box.height() < 50;
    },

    getValues: function() {
        return {
            top: this.box.offset().top - $(window).scrollTop(),
            left: this.box.offset().left,
            width: this.box.width(),
            height: this.box.height()
        }
    },

    borderWidth: function() {
        return this.box.css('border-width').replace('px', '');
    },

    destroy: function() {
        if (this.box) {
            this.box.remove();
            this.box = null;
        }
        if (this.shroud) {
            this.shroud.destroy();
            this.shroud = null;
        }
    },

    /*
    dismantle: function() {
        this.destroyBox();
        //this.shroud.remove();
        this.active = false;
        this.done = false;
    },

    reset: function() {
        this.dismantle();
        this.activate();
    },*/

    appendElement: function(element) {
        this.box.append(element);
    }

});