function mycallback(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {
    elt.value = clickedEl.value;
  });
}

var id = chrome.contextMenus.create({
  "title": "Read Now",
  // "contexts": ["selection"],
  "onclick": mycallback
});
