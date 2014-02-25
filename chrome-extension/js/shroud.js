var ClipNote = ClipNote || {};

ClipNote.Shroud = {

    startEl: null,
    leftEl: null,
    overEl: null,
    underEl: null,
    rightEl: null,

    init: function(container, offset) {
        this.offset = offset;
        this.$container = $(container);
        this.listen();
    },

    listen: function() {
        var me = this;

        Events.register("BOX_DRAW_START", this, function(coordinates) {
            me.onBoxDrawStart(coordinates);
        })
    },

    activate: function() {
        this.create();
        this.shroudAll();
    },

    shroudAll: function() {
        this.startEl = $("<div></div>").addClass('shroud start');
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

        this.leftEl = $("<div></div>").addClass('shroud left');
        this.overEl = $("<div></div>").addClass('shroud over');
        this.underEl = $("<div></div>").addClass('shroud under');
        this.rightEl = $("<div></div>").addClass('shroud right');

        this.$container.append(this.leftEl);
        this.$container.append(this.overEl);
        this.$container.append(this.underEl);
        this.$container.append(this.rightEl);
    },

    remove: function() {
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

}