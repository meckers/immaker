var MacroMaker = MacroMaker || {};

MacroMaker.App = {

	baseUrl: 'http://localhost:9881',
    //baseUrl: 'http://www.yaypegs.com',
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


    postDataAjax: function(imageWithCaption, image, text1, text2) {

        var isRetina = window.devicePixelRatio > 1;

        var data = {
            'imageWithCaption': imageWithCaption,
            'imageNoCaption': image,
            'retina': isRetina,
            'text1': text1,
            'text2': text2
        };

        console.log("posting data", data);

        var me = this;
        $.post(this.baseUrl + '/edit/createajax', data, function(data) {
            console.log("save complete", data);
            if (data._id) {
                chrome.runtime.sendMessage({
                    command: "new-tab",
                    url: me.baseUrl + "/" + data._id + "/" + data.textIdentifier
                });
                MacroMaker.Events.trigger("IMAGE_SAVE_COMPLETE", data);
            }
        });
    }
}