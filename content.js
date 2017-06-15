var clickedEl = null;

document.addEventListener("mousedown", function(event) {
  //right click
  if (event.button == 2) {
    clickedEl = event.target;
  }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request == "getClickedEl") {
    sendResponse({
      value: clickedEl.value
    });
    console.log(clickedEl.innerHTML);
    highlight(clickedEl, 10, 20);
  }
});

function highlight(inputText, start, end) {
  // inputText = document.getElementById("inputText")
  var innerHTML = inputText.innerHTML;
  // var index = innerHTML.indexOf(text);
  innerHTML = innerHTML.substring(0, start) + "<span style='font-weight: bold '>" + innerHTML.substring(start, end) + "</span>" + innerHTML.substring(end);
  inputText.innerHTML = innerHTML;
  console.log(innerHTML);
  return innerHTML;
};
