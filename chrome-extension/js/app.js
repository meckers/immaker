var MacroMaker = MacroMaker || {};

MacroMaker.App = {

	baseUrl: 'http://localhost:9881',
    running: false,

	init: function() {
        this.running = true;
        this.GUI = new MacroMaker.GUI('body');
        this.listen();
        $('body').addClass('imkr-stop-scrolling');
	},

    listen: function() {
        var me = this;
        MacroMaker.Events.register('IMAGE_SAVE_COMPLETE', this, function() {
            me.quit();
        })
        MacroMaker.Events.register('QUIT', this, function() {
            me.quit();
        })
    },

    quit: function() {
        this.running = false;
        this.GUI.destroy();
        this.GUI = null;
        chrome.runtime.sendMessage({
            command: "quit"
        });
        $('body').removeClass('imkr-stop-scrolling');
    },


    postDataAjax: function(imageWithCaption, image, top, left, width, height) {

        var isRetina = window.devicePixelRatio > 1;
        var multiplier = isRetina ? 2 : 1;

        var data = {
            'imageWithCaption': imageWithCaption,
            'imageNoCaption': image,
            'top': Math.ceil(top * multiplier),
            'left': Math.ceil(left * multiplier),
            'width': Math.ceil(width * multiplier),
            'height': Math.ceil(height * multiplier),
            'retina': isRetina
        };

        var me = this;
        $.post(this.baseUrl + '/edit/createajax', data, function(data) {
            if (data.imageId) {
                chrome.runtime.sendMessage({
                    command: "new-tab",
                    url: me.baseUrl + "/" + data.imageId
                });
                MacroMaker.Events.trigger("IMAGE_SAVE_COMPLETE", data);
            }
        });
    }
}