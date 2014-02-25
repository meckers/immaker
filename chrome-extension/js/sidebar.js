var ClipNote = ClipNote || {};

ClipNote.SideBar = {

    init: function(container, url) {
        this.$container = $(container);
        this.url = url;
        this.create(url);
        this.registerEvents();
    },

    registerEvents: function() {
        var me = this;

        this.$element.on('load', function() {
            //ClipNote.Messages.sendMessage("PRE_SELECTION");
        });

        this.$handle.on('mousedown', function(e) {
            console.log('mouse down');
            me.resizing = true;
            me.savedHandleLeft = me.$handle.offset().left;
            me.savedMouseLeft = e.clientX;

            // MOAHAHAHAHA EVIL PLAN TO ALWAYS CAPTURE MOUSEMOVE!!! MOAHAHAHAH!
            me.$handle.css({
                'left': '0',
                'width': '100%'
            });

            me.$handle.on('mousemove', function(e) { /*console.log("moving on", this);*/ me.handleMouseMove(e); } );
        });

        $('.handle').on('mouseup', function(e) { me.handleMouseUp(e); } );

        $(window).scroll(function () {
            var y=$(this).scrollTop();
            if(y<me.elpos){me.$element.stop().animate({'top':0},200);}
            else{me.$element.stop().animate({'top':y-me.elpos},200);}
        });
    },

    handleMouseMove: function(e) {
        if (this.resizing) {
            var mouseLeft = parseInt(e.clientX);
            var mouseDelta = mouseLeft - this.savedMouseLeft;
            var newHandleLeft = this.savedHandleLeft + mouseDelta;
            this.$delimiter.css('left', newHandleLeft + 10);
            this.$element.css('width', $('body').width() - newHandleLeft - 13);
            this.savedHandleLeft = newHandleLeft;
            this.savedMouseLeft = mouseLeft;
            e.stopPropagation();
        }
    },

    handleMouseUp: function(e) {
        console.log('mouse up');
        this.resizing = false;
        this.$handle.off('mousemove');

        this.$handle.css({
            'left': this.$delimiter.offset().left - 10,
            'width': '20px'
        });
    },

    create: function(url) {

        this.$element = $('<iframe></iframe>');
        this.$element.attr('id', 'chinti_edit');
        this.$element.addClass('sidebar');
        this.$element.css('height', $('body').height());
        this.$container.append(this.$element);
        this.$element.attr('src', url);

        this.$delimiter = this.createDelimiter();
        this.$container.append(this.$delimiter);

        this.$handle = this.createHandle();
        this.$container.append(this.$handle);

        console.log("elpos", this.$element.offset().top);
        this.elpos = this.$element.offset().top;
    },

    createDelimiter: function() {
        var $delimiter = $("<div></div>");
        $delimiter.addClass('delimiter');
        $delimiter.css('height', $(document).height() + 'px');
        return $delimiter;
    },

    createHandle: function() {
        var $handle = $("<div></div>");
        $handle.addClass('handle');
        $handle.css('right', '290px');
        $handle.css('height', $(document).height() + 'px');
        return $handle;
    },



    remove: function() {
        this.$element.remove();
        this.$delimiter.remove();
        this.$handle.remove();
    }

}