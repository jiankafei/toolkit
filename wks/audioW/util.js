//简易选择器
function $(sel) {
  if (sel.indexOf('#') !== -1) {
    return document.getElementById(sel.substr(1));
  } else {
    return [].slice.call(document.querySelectorAll(sel));
  }
};
//strToDom
function strToDom(str) {
  let oDiv = document.createElement('div');
  oDiv.innerHTML = str;
  const nodes = oDiv.childNodes[0];
  oDiv = null;
  return nodes;
};
//strToDom2
function strToDom2(str) {
  const frag = document.createDocumentFragment();
  let oDiv = document.createElement('div');
  oDiv.innerHTML = str;
  const nodes = oDiv.childNodes;
  for (const i = 0, l = nodes.length; i < l; i++) {
    if (!!nodes[i]) {
      frag.appendChild(nodes[i]);
    }
  }
  oDiv = null;
  return frag;
};
//添0函数
function num2double(num) {
  return num < 10 ? '0' + num : '' + num;
};
//添0函数2
function addZero(n, m) {
  let n = n.toString();
  let l = n.length;
  while (l < m) {
    n = '0' + n;
    l++;
  }
  return n;
};
//处理播放时间
function calcTime(time) {
  var original = Math.floor(time),
    minute = Math.floor(original / 60),
    second = num2double(original % 60);
  return minute + ':' + second;
};
//自定义事件
function diyEvent(eventType, canBubble, cancelable) {
  var ev = document.createEvent('Event');
  ev.initEvent(eventType, canBubble || false, cancelable || false);
  return ev;
};