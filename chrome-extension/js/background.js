var active = false;

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("click browser action", active);
    if (!active) {
        chrome.tabs.executeScript(null, {
            file: 'js/start.js'
        });
        active = true;
    }
    else {
        chrome.tabs.executeScript(null, {
            code: 'if (ClipNote) { ClipNote.App.quit(); }'
        })
        active = false;
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
                /*respond({
                    image: imgUrl,
                    originalCommand: request.command,
                    captionVisible: request.captionVisible
                });*/
            });    
        });

    }
    else if (request.command == 'quit') {
        active = false;
    }

    return true;
});







