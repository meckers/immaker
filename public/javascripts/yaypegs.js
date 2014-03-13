YayPegs = Class.extend({

    //baseUrl: null,
    imageId: null,

    init: function() {
        //this.baseUrl = _env.host + (_env.port.length > 0 ? ":" + _env.port : "");
        //console.log(this.baseUrl);
        this.initTitle();
        this.initSaveButton();
        this.imageId = $("#image-id").val();
    },

    initTitle: function() {
        var me = this;
        this.title = $("#title");
        if (this.title.attr('contenteditable') == 'true') {
            this.title.on('click', function() {
                me.selectAll(me.title[0]);
                me.saveButton.removeClass('hidden');
            })
        }
    },

    selectAll: function(element) {
        var range = document.createRange();
        range.selectNodeContents(element);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    },

    initSaveButton: function() {
        var me = this;
        this.saveButton = $("#save-button");
        this.saveButton.on('click', function() {
            me.save();
        });
    },

    save: function() {
        var data = {
            'id': this.imageId,
            'title': $('#title').html()
        };

        console.log("posting data", data);

        var me = this;
        $.post('/edit/saveajax', data, function(data) {
            console.log("save complete", data);
            me.saveButton.addClass('hidden');
        });
    }
});