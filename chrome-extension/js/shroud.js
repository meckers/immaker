var MacroMaker = MacroMaker || {};

MacroMaker.Shroud = Class.extend({

    startEl: null,
    leftEl: null,
    overEl: null,
    underEl: null,
    rightEl: null,
    finalMouseX: null,
    finalMouseY: null,

    init: function(container, offset) {
        this.offset = offset;
        this.$container = $(container);
        this.listen();
        this.create();
        this.shroudAll();
    },

    listen: function() {
        var me = this;

        MacroMaker.Events.register("BOX_DRAW_START", this, function(coords) {
            me.onBoxDrawStart(coords);
        })

        MacroMaker.Events.register("BOX_DRAW_END", this, function(coords) {
            me.finalMouseX = coords.x;
            me.finalMouseY = coords.y;
            this.hwr = $.proxy(me.handleWindowResize, this);
            $(window).bind('resize', this.hwr);
        })

        MacroMaker.Events.register("BOX_DRAW", this, function(coords) {
            me.onBoxDraw(coords.x, coords.y);
        })
    },

    handleWindowResize: function(e) {
        this.transform(this.finalMouseX, this.finalMouseY);
    },

    shroudAll: function() {
        this.startEl = $("<div></div>").addClass('imkr shroud imkr-start');
        this.startEl.css({
            'width': $(document).width() + 'px',
            'height': $(document).height() + 'px'
        });
        this.$container.append(this.startEl);
    },

    onBoxDrawStart: function(coordinates) {
        this.startTransform(coordinates.x, coordinates.y);
    },

    onBoxDraw: function(x, y) {
        if (!this.transforming) {
            this.startTransform(x, y);
            this.transforming = true;
        }
        else {
            this.transform(x, y);
        }
    },

    startTransform: function(x, y) {
        this.startX = x;
        this.startY = y;
        $('.shroud:not(.start)').css('display', 'block');
        this.startEl.css('display', 'none');
        this.transform(x, y);
    },

    create: function() {

        if(this.startEl) {
            this.startEl.remove();
        }

        this.leftEl = $("<div></div>").addClass('imkr shroud imkr-left');
        this.overEl = $("<div></div>").addClass('imkr shroud imkr-over');
        this.underEl = $("<div></div>").addClass('imkr shroud imkr-under');
        this.rightEl = $("<div></div>").addClass('imkr shroud imkr-right');

        this.$container.append(this.leftEl);
        this.$container.append(this.overEl);
        this.$container.append(this.underEl);
        this.$container.append(this.rightEl);
    },

    destroy: function() {
        this.startEl.remove();
        this.leftEl.remove();
        this.overEl.remove();
        this.underEl.remove();
        this.rightEl.remove();
    },

    hide: function() {
        $('.shroud').css('display', 'none');
    },

    transform: function(mouseX, mouseY) {
        this.overEl.css('left', this.startX + this.offset);
        this.leftEl.css('height', $(document).height() + this.offset);
        this.underEl.css('left', this.startX + this.offset);
        this.rightEl.css('height', $(document).height() + this.offset);
        this.leftEl.css('width', this.startX + this.offset);
        this.overEl.css('height', this.startY + this.offset);
        this.overEl.css('width', mouseX - this.startX);
        this.underEl.css('height', $(document).height() - mouseY - this.offset);
        this.underEl.css('width', mouseX - this.startX);
        this.underEl.css('top', mouseY);
        this.rightEl.css('width', $(document).width() - mouseX - this.offset);
    },

    reset: function() {
        this.hide();
        this.shroudAll();
    }

});