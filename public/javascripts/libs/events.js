Events = {

    listeners: [],

    register: function(name, context, callback) {
        var listener = new Listener(name, context, callback);
        this.listeners.push(listener);
    },

    trigger: function(name, data) {
        $(this.listeners).each(function(i,e) {
            if (e.name === name) {
                e.callback.apply(e.context, [data]);
            }
        });
    }
}

Listener = Class.extend({

    name: null,
    callback: null,
    context: null,

    init: function(name, context, callback) {
        this.name = name;
        this.callback = callback;
        this.context = context;
    }
});