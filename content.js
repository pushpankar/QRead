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

/**
 * This function takes the clicked HTML object
 * And renders text according to configuration
**/
async function renderPara(clickedEl){
  if(!clickedEl){
      return;
  }
  // 
  var span = 11;
  // min time to stop on a word. Will add time to this based on word
  var defaultTime = 150;
  // get the text and clean it
  var originalText = clickedEl.innerHTML;
  var text = getFormattedText(clickedEl);
  console.log(text);

  // pre is the words that has been rendered
  // middle is the word that will be renedered now
  // post is the word that will be rendered in future
  var pre = "";
  var middle = "";
  var post = text;

  // iterate till there is no word left to iterate
  while(post){
    // remove html elements
    if(post[0] === "<"){
      while(post[0] !== ">")
        post = post.substring(1);
      post = post.substring(1);
    }

    // render numbers in one go
    if(post[0] >= '0' && post[0] <= "9"){
      while(post && post[0] !== " "){
        middle += post[0];
        post = post.substring(1);
      }
    }

    if(post)
      middle += post[0];
    // console.log(post);

    // its time to display new text
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
  // make the page as it was before
  clickedEl.innerHTML = originalText;
  currentEl = clickedEl.nextElementSibling;
  console.log(currentEl.nodeName);
  console.log(clickedEl.nodeName);
  while(currentEl.nodeName !== clickedEl.nodeName){
      currentEl = currentEl.nextElementSibling;
      console.log(clickedEl.nodeName);
  }
  return renderPara(currentEl);

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
