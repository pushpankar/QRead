var clickedEl = null;

document.addEventListener("mousedown", function(event) {
  //right click
  if (event.button === 2) {
    clickedEl = event.target;
  }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request === "getClickedEl") {
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

function removeHTML(htmlText){
  var text = "";
  for(var i = 0; i < htmlText.length; i++){
    if(htmlText[i] === "<"){
      while(htmlText[i] !== ">")
        i++;
      continue;
    }
    text += htmlText[i];
  }
  return text;
}

async function renderPara(clickedEl){
  var span = 8;
  var defaultTime = 150;
  var originalText = clickedEl.innerHTML;
  var text = getFormattedText(clickedEl);
  console.log(text);
  var pre = "";
  var middle = "";
  var post = text;
  while(post){
    if(post[0] === "<"){
      while(post[0] !== ">")
        post = post.substring(1);
      post = post.substring(1);
    }
    if(post[0] >= '0' && post[0] <= "9"){
      while(post && post[0] !== " "){
        middle += post[0];
        post = post.substring(1);
      }
    }
    if(post)
      middle += post[0];
    console.log(post);
    if(post.length <= 1 || pauseTime[post[0]] || (post[0] === " "  && middle.length > span)){
      var emboldedText = emboldText(pre, middle, post.substring(1));
      clickedEl.innerHTML = emboldedText;
      //sleep here
      var waitTime = defaultTime + middle.length * 20;
      if(pauseTime[post[0]]){
        waitTime += pauseTime[post[0]];
      }
      await sleep(waitTime);
      pre += middle;
      middle = ""; 
    }
    post = post.substring(1);
  }
  clickedEl.innerHTML = originalText;

}

function getFormattedText(para){
  // https://stackoverflow.com/questions/3738490/finding-line-wraps
  var current = para;
  var text = removeHTML(current.innerHTML);
  var words = text.split(' ');
  current.innerHTML = words[0];
  var height = current.offsetHeight;
  var finalText = words[0];
  for(var i = 1; i < words.length; i++){
    current.innerHTML = current.innerHTML + ' ' + words[i];
    if(current.offsetHeight > height){
      finalText += "\n" + words[i];
        height = current.offsetHeight;
    }else{
      finalText += ' ' + words[i];
    }
  }
  return finalText;
}

function emboldText(pre, boldTxt, post){
  var emboldedText = "<span style='color: #D3D3D3'>" + pre +"</span>" + "<span style='color: #000000'>" + boldTxt +"</span>" + "<span style='color: #D3D3D3'>" + post +"</span>";
  return emboldedText;
}
