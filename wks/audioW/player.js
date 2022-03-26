// 默认设置
const INIT_OPTS = {
  player: null, // 播放器
  mode: 'single', // [list, loop, single, random]
  index: 0, // 当前播放的歌曲排序值

  // 正在考虑的属性
  loadType: 'local', // ???
};

// 私有属性

// 私有方法

// 常量

// 播放模式
const MODE_ARR = ['list', 'loop', 'single', 'random'];

// 播放对象类
class AudioPlayer {
  constructor(...args) {
    Object.assign(this, INIT_OPTS, args);
    switch (this.type) {
      case 'audio':
        this.player = new Audio();
        break;
      case 'video':
        this.player = document.createElement('video');
        break;
    }
  }
}
function AD(arg) {
  this.init(arg);
};
AD.prototype = {
  constructor: AD,
  init: function (arg) {
    var volume = $('.AW-volumeTank'),
      timeLine = $('.AW-timeLineTank'),
      volumeInner = strToDom2('<span class="AW-muted">静</span>\
                          <div class="AW-bar" data-bartype="volume">\
                              <progress class="AW-prog" max="1" value=".5"></progress>\
                              <span class="AW-dot"></span>\
                          </div>\
                          <span class="AW-curr">50</span>'),
      timeLineInner = strToDom2('<span class="AW-curr time">0:00</span>\
                        <div class="AW-bar" data-bartype="time">\
                            <progress class="AW-prog" max="1" value="0"></progress>\
                            <span class="AW-dot"></span>\
                        </div>\
                        <span class="AW-duration time">0:00</span>');
    volume.forEach(function (item, index, self) {
      item.appendChild(volumeInner);
    });
    timeLine.forEach(function (item, index, self) {
      item.appendChild(timeLineInner);
    });

    this.listener();
    this.control();

    this.Player.volume = .5;
    if (this.loadType === 'local') {
      $('.AW-playModeBtn')[0].classList.add('list'); //初始mode
      this.localLoad(this.localArgument);
    }
    this.lyric = new Lyric();
    this.VL = new VL();
  },
  //测试专用，检测是否支持某个媒体类型
  canplay: function (playType) {
    return !!this.Player.canPlayType(playType);
  },
  control: function () {
    var _this = this,
      modedIndex = 0;
    document.addEventListener('touchstart', dragStart, false);

    function dragStart(event) {
      var tg = event.target,
        cl = tg.classList,
        tc = event.touches[0],
        oldX = tc.clientX,
        maxL = tg.offsetWidth,
        dot, prog, curr, restDis, barType;
      if (cl.contains('AW-bar')) {
        dot = tg.lastElementChild;
        prog = tg.firstElementChild;
        curr = tg.nextElementSibling;
        restDis = tc.clientX - tg.getBoundingClientRect().left;
        barType = tg.getAttribute('data-bartype');
        //可有可无
        (restDis < 0) && (restDis = 0);
        (restDis > maxL) && (restDis = maxL);

        dot.style.left = restDis + 'px';
        prog.value = restDis / maxL;

        if (barType === 'volume') {
          //音量调节
          _this.Player.volume = prog.position;
          curr.innerHTML = ~~(prog.position * 100);
        }

        document.addEventListener('touchmove', dragMove, false);
        document.addEventListener('touchend', dragEnd, false);

        function dragMove(event) {
          var changeX = event.touches[0].clientX - oldX,
            newLeft = restDis + changeX;
          (newLeft < 0) && (newLeft = 0);
          (newLeft > maxL) && (newLeft = maxL);
          dot.style.left = newLeft + 'px';
          prog.value = newLeft / maxL;

          if (barType === 'volume') {
            //音量调节
            _this.Player.volume = prog.position;
            curr.innerHTML = ~~(prog.position * 100);
          }
        };

        function dragEnd() {
          document.removeEventListener('touchmove', dragMove, false);
          document.removeEventListener('touchend', dragEnd, false);
          if (barType === 'time') {
            //时间线调节
            _this.Player.currentTime = prog.position * _this.Player.duration;
          }
        };
      }
    };

    document.addEventListener('touchend', function (event) {
      var tg = event.target,
        cl = tg.classList;
      if (cl.contains('AW-prevBtn')) {
        tg.dispatchEvent(prevEvent);
        if (_this.loadType === 'local') {
          (--_this.now < 0) ? (_this.now = 0) : (_this.localPlay());
        }
      } else if (cl.contains('AW-playBtn')) {
        if (!!_this.Player.src) {
          switch (_this.Player.paused) {
            case true:
              tg.dispatchEvent(playEvent);
              _this.Player.play();
              break;
            case false:
              tg.dispatchEvent(pauseEvent);
              _this.Player.pause();
              break;
          }
        } else {
          console.log('歌曲为空！');
        }
      } else if (cl.contains('AW-nextBtn')) {
        tg.dispatchEvent(nextEvent);
        if (_this.loadType === 'local') {
          (++_this.now > _this.localAddedName.length - 1) ? (_this.now = _this.localAddedName.length - 1) : (_this.localPlay());
        }
      } else if (cl.contains('AW-refreshBtn')) {
        tg.dispatchEvent(refreshEvent);
        _this.Player.currentTime = 0;
      } else if (cl.contains('AW-playModeBtn')) {
        modedIndex = ++modedIndex % _this.modeArr.length;
        _this.mode = _this.modeArr[modedIndex];
        console.log(_this.mode);
        for (var i = 0, l = _this.modeArr.length; i < l; i++) {
          cl.remove(_this.modeArr[i]);
        }
        cl.add(_this.mode);
      } else if (cl.contains('AW-muted')) {
        _this.Player.muted = !_this.Player.muted;
      }
    }, false);
  },
  localPlay: function () {
    this.Player.pause();
    if (!this.localFileList[this.now]) {
      return false;
    }
    this.Player.src = this.localFileList[this.now];
    this.Player.load();
    this.Player.play();
  },
  getLyric: function () {
    return this.lyric;
  },
  getVL: function () {
    return this.VL;
  },
  listener: function () {
    var _this = this,
      player = this.Player;
    player.addEventListener('loadstart', function () {
      console.log('开始加载媒体');
    }, false);
    player.addEventListener('durationchange', function () {
      console.log('时长改变：' + this.duration);
      $('.AW-duration')[0].innerHTML = calcTime(this.duration);
    }, false);
    player.addEventListener('loadedmetadata', function () {
      console.log('元数据加载完毕');
    }, false);
    player.addEventListener('loadeddata', function () {
      console.log('已加载当前帧');
    }, false);
    player.addEventListener('progress', function () {
      console.log('正在加载数据');
      // 获取缓冲百分比
      var buffered, percent;
      if (player.readyState === 4) {
        // 已缓冲部分
        buffered = player.buffered.end(0);
        // 已缓冲百分百
        percent = Math.round(buffered / player.duration * 100) + '%';
      }
    }, false);
    player.addEventListener('canplay', function () {
      console.log('可以播放了');
    }, false);
    player.addEventListener('canplaythrough', function () {
      console.log('可以无停顿播放了');
    }, false);
    player.addEventListener('abort', function () {
      console.log('加载中断');
    }, false);
    player.addEventListener('emptied', function () {
      console.log('当前播放为空');
    }, false);
    player.addEventListener('error', function () {
      console.log('加载发生错误');
    }, false);
    player.addEventListener('stalled', function () {
      console.log('数据不可用');
    }, false);
    player.addEventListener('suspend', function () {
      console.log('获取数据挂起');
    }, false);
    player.addEventListener('play', function () {
      console.log('播放媒体');
      var lyric = _this.lyric;
      console.log(lyric.hasLyric);
      if (lyric.hasLyric) {
        lyric.rollLyric(this);
        lyric.lyricArr[lyric.now].style.WebkitAnimationPlayState = 'running';
        lyric.lyricArr[lyric.now].style.animationPlayState = 'running';
      }
    }, false);
    player.addEventListener('playing', function () {
      console.log('播放就绪');
    }, false);
    player.addEventListener('pause', function () {
      console.log('暂停媒体');
      var lyric = _this.lyric;
      if (lyric.hasLyric) {
        clearInterval(lyric.rollTimer);
        lyric.lyricArr[lyric.now].style.WebkitAnimationPlayState = 'paused';
        lyric.lyricArr[lyric.now].style.animationPlayState = 'paused';
      }
    }, false);
    player.addEventListener('ended', function () {
      console.log('播放结束');
      // 这里还要处理播放模式，mode
    }, false);
    player.addEventListener('timeupdate', _this.timeUpdate, false);
    player.addEventListener('volumechange', function () {
      console.log('改变音量');
    }, false);
    player.addEventListener('waiting', function () {
      console.log('缓冲等待中');
    }, false);
    player.addEventListener('seeking', function () {
      console.log('在跳跃操作开始时触发');
    }, false);
    player.addEventListener('seeked', function () {
      console.log('在跳跃操作完成时触发');
    }, false);
  },
  timeUpdate: function () {
    var ratio = this.currentTime / this.duration,
      aRdot = $('.AW-timeLineTank .AW-dot'),
      aRpg = $('.AW-timeLineTank .AW-prog');
    AD.prototype.moveVolumeDot(aRdot, aRpg, ratio);
  },
  moveVolumeDot: function (aRdot, aRpg, ratio) {
    aRdot.forEach(function (dot, index, self) {
      var rpg = aRpg[index];
      rpg.value = ratio;
      dot.style.left = ratio * 100 + '%';
    });
  }
};