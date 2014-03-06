jQuery(function() {
    if (!MacroMaker.App.running) {
        MacroMaker.Events = new Events();
        MacroMaker.App.init();
    }
    else {
        MacroMaker.App.quit();
    }
});