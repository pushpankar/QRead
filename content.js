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
    highlight(clickedEl, 10, 20);
  }
});

function renderPara(clickedEl){
  var text = clickedEl.innerHTML();
  var pre = "";
  var middle = "";
  var post = text;
  while(post){
    middle += post[0];
    if(post[0] === " " || post[0] == "\n"){
      var emboldedText = emboldText(pre, middle, post);
      clickedEl.innerHTML = emboldedText;
      //sleep here
      pre += middle;
      middle = ""; 
    }
    post = post.substring(1);
  }

}

function emboldText(pre, boldTxt, post){
  var emboldedText = pre + "<span style='font-weight: bold'>" + post;
  return emboldedText;
}

function highlight(inputText, start, end) {
  // inputText = document.getElementById("inputText")
  var innerHTML = inputText.innerHTML;
  // var index = innerHTML.indexOf(text);
  innerHTML = innerHTML.substring(0, start) + "<span style='font-weight: bold '>" + innerHTML.substring(start, end) + "</span>" + innerHTML.substring(end);
  inputText.innerHTML = innerHTML;
  console.log(innerHTML);
  return innerHTML;
};
