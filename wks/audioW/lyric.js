class Lyric {
  constructor() {
    //定时器
    this.rollTimer = null;
    //歌词时间延迟量
    this.tout = 0;
    //歌词时间数组
    this.timeArr = [];
    //时间差数组
    this.timelag = [];
    //歌词容器数组
    this.lyricArr = [];
    //歌词容器
    this.lyricTank = $('#AW-lyricTank');
    //当前歌词容器小标
    this.now = 0;
    //是否加载歌词
    this.hasLyric = false;
  };
  initLyric(data) {
    if (!!data) {
      this.hasLyric = true;
    } else {
      return false;
    }
    var oDiv = document.createElement('div'),
      reg = /\[\d\d[:\.]\d\d[:\.]\d\d\]/g,
      textArr = data.split(reg);
    oDiv.id = 'AW-lyricInner';
    this.lyricTank.innerHTML = '';
    this.lyricArr.length = 0;
    //处理时间
    this.timeArr = data.match(reg); //获取时间数组
    for (var i = 0; i < this.timeArr.length; i++) {
      var tmp = this.timeArr[i].match(/\d+/g);
      this.timeArr[i] = parseInt(tmp[0]) * 60 * 1000 + parseInt(tmp[1]) * 1000 + parseInt(tmp[2]);
    };
    this.timelag = []; //时差
    for (var i = 0; i < this.timeArr.length - 1; i++) {
      this.timelag[i] = this.timeArr[i + 1] - this.timeArr[i];
    };
    //处理歌词
    textArr.splice(0, 1);
    for (var i = 0; i < textArr.length; i++) {
      var oSpan = document.createElement('span');
      oSpan.className = 'AW-lyricTxt';
      oSpan.style.animationDuration = this.timelag[i] + 'ms';
      oSpan.style.WebKitAnimationDuration = this.timelag[i] + 'ms';
      //oSpan.style.transition = 'background-size ' + this.timelag[i] + 'ms ease-in-out';
      this.lyricArr.push(oSpan);
      if (/^\s+$/.test(textArr[i])) {
        textArr[i] = '♪··♫··♪··♫··♪';
      };
      oSpan.innerHTML = textArr[i];
      oDiv.appendChild(oSpan);
    };
    this.lyricTank.appendChild(oDiv);
    this.lyricInner = oDiv;
  };
  rollLyric(player) {
    var _this = this;
    this.rollTimer = setInterval(function () { //还需修饰
      if (_this.timeArr) {
        var tmptime = Math.floor((player.currentTime + _this.tout) * 1000);
        //二分法递归获取
        _this.now = getlocate(tmptime, _this.timeArr, 0, _this.timeArr.length - 1);

        function getlocate(a, arr, l, r) {
          var c = Math.floor((l + r) / 2);
          if (l === c) {
            return c;
          }
          if (a < arr[c]) {
            l = l;
            r = c;
            return getlocate(a, arr, l, r);
          } else {
            l = c;
            r = r;
            return getlocate(a, arr, l, r);
          }
        };
        var top = _this.lyricArr[_this.now].offsetTop;
        _this.lyricInner.style.transform = 'translateY(' + -top + 'px)';
        var currTxt = _this.lyricInner.querySelector('.AW-lyricTxt.curr');
        currTxt && (currTxt.classList.remove('curr'));
        _this.lyricArr[_this.now].classList.add('curr');
      };
    }, 30);
  }
};
