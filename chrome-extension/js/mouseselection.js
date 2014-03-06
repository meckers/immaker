var MacroMaker = MacroMaker || {};

MacroMaker.MouseSelection = Class.extend({

    id: null,
    mouseDownHandler: null,
    mouseUpHandler: null,
    mouseMoveHandler: null,
    shroud: null,
    border: '3px dashed yellow',
    handlers: [],

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
        this.active = true;
    },

    listen: function() {
        var me = this;

        this.hmd = $.proxy(this.handleMouseDown, this);
        this.hmu = $.proxy(this.handleMouseUp, this);
        this.hmm = $.proxy(this.handleMouseMove, this);

        $('body').bind('mousedown', this.hmd);
        $('body').bind('mouseup', this.hmu);
        $('body').bind('mousemove', this.hmm);
    },


    handleMouseDown: function(e) {
        if (this.active && !this.done && e.which == 1) {
            this.startBoxDraw(e.pageX, e.pageY);
            e.stopPropagation();
        }
    },

    handleMouseUp: function(e) {
        if (this.active) {
            // if selecting:
            if (this.drawing) {
                this.endBoxDraw(e.pageX, e.pageY);
                e.stopPropagation();
                e.preventDefault();
                this.done = true;
                //this.shroud.remove();
            }
        }
    },

    handleMouseMove: function(e) {
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

                MacroMaker.Events.trigger("BOX_DRAW", {x: mouseX, y: mouseY});

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
        MacroMaker.Events.trigger("BOX_DRAW_START", { x: x, y: y });
    },

    endBoxDraw: function(x, y) {
        this.drawing = false;
        if (!this.isTooSmall()) {
            if (this.callback) {
                this.callback(this.element);
            }
            MacroMaker.Events.trigger("BOX_DRAW_END", { x: x, y: y });
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

        $('body').unbind('mousedown', this.hmd);
        $('body').unbind('mouseup', this.hmu);
        $('body').unbind('mousemove', this.hmm);
    },

    appendElement: function(element) {
        this.box.append(element);
    }

});