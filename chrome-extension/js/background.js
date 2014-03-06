var active = false;

chrome.browserAction.onClicked.addListener(function(tab) {
    //console.log("click browser action", MacroMaker);
    if (typeof(MacroMaker) !== 'undefined') {
        MacroMaker.App.quit();
    }
    else {
        chrome.tabs.executeScript(null, {
            file: 'js/start.js'
        });
        //active = true;
    }
});

/*
chrome.windows.getCurrent(function (win) {
    win.addEventListener('message', function(e) {
        if (e.data.command == 'startSelection') {
            alert(e.data.message);
        }
    });
});*/

function respond(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
        console.log(response.farewell);
    });
  });
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {    

    var imageData = "";
    console.log("extension script recieved message:", request);
    if (request.command == 'capture-tab') {
        chrome.windows.getCurrent(function (win) {  
            chrome.tabs.captureVisibleTab(win.id, {"format":"png"}, function(imgUrl) {
                imageData = imgUrl;
                console.log("sendresponse", imageData);
                sendResponse({
                    image: imageData,
                    test: request.test
                });
            });    
        });

    }
    else if (request.command == 'new-tab') {
        chrome.tabs.create({ url: request.url });
    }
    else if (request.command == 'quit') {
        // doesn't work as intended:
        //chrome.runtime.reload();
    }

    return true;
});







