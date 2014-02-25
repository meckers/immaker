var ClipNote = ClipNote || {};

ClipNote.MouseSelection = {

    mouseDownHandler: null,
    mouseUpHandler: null,
    mouseMoveHandler: null,
    shroud: null,
    border: '3px dashed yellow',

    init: function(container) {
        this.$container = $(container) || $('body');
        this.shroud = ClipNote.Shroud;
        this.shroud.init("body", 3);
        this.listen();
    },

    activate: function() {
        // this create (but hidden)
        this.createBox({hidden: true});
        this.shroud.activate();
        // shroud activate & create (all shrouded)
        this.active = true;
    },

    listen: function() {
        var me = this;
        Events.register("START_SELECTION_BUTTON_CLICK", this, function() {
            me.activate();
            ClipNote.Messages.sendEvent("SELECTION_ACTIVATED");
        });
        Events.register("CANCEL_SELECTION_CLICK", this, function() {
            me.onCancelSelection();
        });
        Events.register("SAVE_AND_SHARE", this, function() {
            me.dismantle();
        })

        $('body').bind('mousedown', function(e) {
            console.log("mouse down");
            me.handleMouseDown(e);
        });
        $('body').bind('mouseup', function(e) {
            me.handleMouseUp(e);
        });
        $('body').bind('mousemove', function(e) {
            me.handleMouseMove(e);
        });
    },

    onCancelSelection: function() {
        this.dismantle();
        ClipNote.Messages.sendEvent("SELECTION_CANCELLED");
    },

    handleMouseDown: function(e) {
        if (this.active && !this.done && e.which == 1) {
            console.log("left mouse button down");
            this.startBoxDraw(e.pageX, e.pageY);
            e.stopPropagation();
        }
    },

    handleMouseUp: function(e) {
        if (this.active) {
            // if selecting:
            if (this.drawing) {
                this.endBoxDraw();
                e.stopPropagation();
                this.done = true;
                //this.shroud.remove();
            }
        }
    },

    handleMouseMove: function(e) {
        //console.log("M.M. pageXY=", e.pageX, e.pageY, "clientXY=", e.clientX, e.clientY);
        if (this.active) {
            console.log("mouse move", this.drawing);
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

                this.shroud.onBoxDraw(mouseX, mouseY);

                e.stopPropagation();
                e.preventDefault();
            }
        }
    },

    createBox: function() {
        var el = jQuery('<div></div>');
        el.addClass('mouse-selection');
        el.css('top', this.startY);
        el.css('left', this.startX);
        el.css('border', this.border);
        return el;
    },

    destroyBox: function() {
        if (this.box) {
            this.box.remove();
            this.box = null;
        }
    },

    startBoxDraw: function(x, y) {
        console.log("start box draw", this);
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
            Events.trigger("BOX_SELECTION_COMPLETE", this.box);
            this.shroud.remove();
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
            top: this.box.offset().top,
            left: this.box.offset().left,
            width: this.box.width(),
            height: this.box.height()
        }
    },

    borderWidth: function() {
        return this.box.css('border-width').replace('px', '');
    },

    dismantle: function() {
        this.destroyBox();
        this.shroud.remove();
        this.active = false;
        this.done = false;
    },

    reset: function() {
        this.dismantle();
        this.activate();
    }

}