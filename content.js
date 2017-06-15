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
    console.log("Now Rendering");
    renderPara(clickedEl);
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function renderPara(clickedEl){
  var text = clickedEl.innerHTML;
  var pre = "";
  var middle = "";
  var post = text;
  while(post){
    middle += post[0];
    if(post[0] === " " || post[0] == "\n" || post.length == 1){
      var emboldedText = emboldText(pre, middle, post);
      clickedEl.innerHTML = emboldedText;
      //sleep here
      await sleep(200);
      pre += middle;
      middle = ""; 
    }
    post = post.substring(1);
  }

}

function emboldText(pre, boldTxt, post){
  var emboldedText = pre + "<span style='font-weight: bold'>" + boldTxt +"</span>" + post;
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
