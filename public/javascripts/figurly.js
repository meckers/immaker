var Figurly = {
    toggleTemplate: function() {
        var hidden = $("img.image.hidden");
        var visible = $("img.image:not('.hidden')");
        if (hidden) { hidden.removeClass('hidden'); }
        if (visible) { visible.addClass('hidden'); }
    }
}


Figurly.SideBar = {

    selecting: false,

    init: function() {
        alert("!");
        this.listen();
    },

    listen: function() {
        var me = this;
        window.addEventListener('message', function(e) {
            me.recieveMessage(e);
        });

        MacroMaker.Events.register("SELECTION_ACTIVATED", this, function(e) {
            // deactivate selection button
            //$('#start-selection-button').attr('disabled', 'true');
            $('#start-selection-button').attr('value', 'EXIT SELECT MODE');
            me.selecting = true;
        });

        MacroMaker.Events.register("SELECTION_CANCELLED", this, function(e) {
            // re-activate selection button
            //$('#start-selection-button').removeAttr('disabled');
            $('#start-selection-button').attr('value', 'ENTER SELECT MODE');
            me.selecting = false;
        });
    },

    saveAndShare: function(comicId) {
        parent.postMessage({command: 'saveandshare'}, "*");
        document.location = document.location='/edit/finalize/' + comicId;
    },

    recieveMessage: function(m) {
        if (m.data.command == 'showMessage') {
            $("#instructions").html('<i class="fa fa-info-circle"></i>' + e.data.message);
        }
        else if (m.data.command == "event") {
            Events.trigger(m.data.message.name, m.data.message.data);
        }
    },

    toggleSelectionMode: function() {
        // send message to parent.
        if (this.selecting) {
            parent.postMessage({command: 'disableSelection'}, "*");
        }
        else {
            parent.postMessage({command: 'startSelection'}, "*");
        }
    },

    quit: function() {
        parent.postMessage({command: 'quit'}, "*");
    }

}