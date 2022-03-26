/**
 * [媒体播放处理插件]
 * @arguments {Object} [参数是一个对象字面量对象]
 * Object = {
 * 		type: 'audio' || 'video',
 * 		loadType: 'local' || 'online',
 * 		//本地加载参数
      localArgument: {
        listTank: $('#listTank'),
        videoTank: $('#videoTank'),
        addButton: $('#addBtn')
      }
 * 		//可视化元素
 * 		VL: {
 * 			type: ,
 * 			VLTank: 原生对象 || null,
 * 			switchBtn: 原生对象 || null
 * 		},
 * 		//歌词元素
 * 		lyric: {
 * 			lyricTank: 原生对象 || null,
 * 			timeControlTank: 原生对象 || null
 * 		}
 * }
 *
 * 对外:
 * AD对象
 * 事件钩子:AW-play,AW-pause,AW-prev,AW-next,AW-refresh
 * 这些钩子都在对应的控制按钮上，所以监听也在这些按钮上
 *
 * class:
 * 		AW-prevBtn,AW-playBtn,AW-nextBtn,AW-refreshBtn
 */
;
(function () {
  //定义操作事件
  var playEvent = diyEvent('AW-play'),
    pauseEvent = diyEvent('AW-pause'),
    prevEvent = diyEvent('AW-prev'),
    nextEvent = diyEvent('AW-next'),
    refreshEvent = diyEvent('AW-refresh');
  window.AD = AD;
})();


/*
获取缓冲长度
	var buffered, percent;
	if (player.readyState === 4) {
		// 已缓冲部分
		buffered = player.buffered.end(0);
		// 已缓冲百分百
		percent = Math.round(buffered / player.duration * 100) + '%'
	}

readyState：
	0	HAVE_NOTHING	没有关于音频/视频是否就绪的信息
	1	HAVE_METADATA	关于音频/视频就绪的元数据
	2	HAVE_CURRENT_DATA	关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
	3	HAVE_FUTURE_DATA	当前及至少下一帧的数据是可用的
	4	HAVE_ENOUGH_DATA	可用数据足以开始播放

判断音频能否播放
	audio.load()
	var timer = setInterval(function(){
		audio.readyState > 1 && (clearInterval(timer), audio.play());
	}, 30);
*/