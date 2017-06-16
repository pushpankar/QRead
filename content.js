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
  var span = 10;
  var defaultTime = 150;
  var text = clickedEl.innerHTML;
  var pre = "";
  var middle = "";
  var post = text;
  while(post){
    middle += post[0];
    if(post.length === 1 || (post[0] === " "  && middle.length > span) || post[0] === "\n" || post[0] === "."){
    // if((post[0] === " " || post[0] == "\n" || post.length == 1) && ()){
      var emboldedText = emboldText(pre, middle, post);
      clickedEl.innerHTML = emboldedText;
      //sleep here
      var waitTime = defaultTime + middle.length * 5;
      if(post[0] === "\n" || post[0] === "."){
        waitTime += 1000;
      }
      
      await sleep(waitTime);
      pre += middle;
      middle = ""; 
    }
    post = post.substring(1);
  }
  clickedEl.innerHTML = text;

}

function emboldText(pre, boldTxt, post){
  var emboldedText = "<span style='color: #D3D3D3'>" + pre +"</span>" + "<span style='color: #000000'>" + boldTxt +"</span>" + "<span style='color: #D3D3D3'>" + post +"</span>";
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
