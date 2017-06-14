function mycallback(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {
        elt.value = clickedEl.value;
    });
}
function mycallback(info, tab) {
  // missing part that refers to the question:
  // how to retrieve elt which is assumed to be
  // the element on which the contextMenu has been executed ?
  alert("Awesome");
}

var id = chrome.contextMenus.create({
  "title": "Click me",
  // "contexts": ["selection"],
  "onclick": mycallback
});
