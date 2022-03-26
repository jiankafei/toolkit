// 本地资源加载管理类
class Local {
  constructor() {
    this.localFileList = [];
    this.localAddedName = [];
  }
  load() {

  }
}

const localLoad = (arg) => {
  var fileIpt = document.createElement('input');
  fileIpt.type = 'file';
  fileIpt.multiple = true;
  fileIpt.hidden = true;
  // document.body.appendChild(fileIpt);

  var listTank = arg.listTank,
    addButton = arg.addButton,
    videoTank = arg.videoTank || null,
    _this = this;

  switch (this.type) {
    case 'audio':
      fileIpt.accept = 'audio/mp3,audio/wav,audio/ogg';
      break;
    case 'video':
      videoTank.appendChild(_this.Player);
      fileIpt.accept = 'video/mp4,video/wmv,video/wma,video/webM,video/avi,video/rmvb,video/mkv';
      break;
  }

  fileIpt.addEventListener('change', function () {
    //添加歌曲
    for (var i = 0, l = this.files.length; i < l; i++) {
      var name = this.files[i].name.replace(/\..+/g, '');
      if (!findInList(name, _this.localAddedName)) {
        var oA = document.createElement('a');
        _this.localAddedName.push(name);
        listTank.appendChild(oA);
        oA.className = 'AW-audioItem';
        oA.href = 'javascript:;';
        oA.setAttribute('data-index', _this.localAddedName.length - 1);
        oA.innerHTML = name;
        var url = window.URL.createObjectURL(this.files[i]);
        _this.localFileList.push(url);
      }
    };
    (!!_this.Player.src) || (_this.Player.src = _this.localFileList[0]);
    //播放歌曲
    document.addEventListener('touchend', function (event) {
      var tg = event.target;
      if (tg.className === 'AW-audioItem') {
        _this.now = tg.getAttribute('data-index');
        _this.localPlay();
      }
    }, false);
    //歌曲查重
    function findInList(name, mList) {
      var name = name.replace(/\..+/g, '');
      if (mList.length === 0) {
        //alert('没有该歌曲！'+name);
        return false;
      } else {
        for (var i = 0; i < mList.length; i++) {
          if (name === mList[i].innerHTML) {
            //alert('有该歌曲！'+name);
            return true;
          }
        };
        //alert('没有该歌曲！'+name);
        return false;
      };
    }
  }, false);

  fileIpt.click();
};