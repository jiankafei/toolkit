/* 逐帧动画
1. 支持所有 style 的可计算的属性以及 scrollTop scrollLeft，暂不支持 transform
class Animate(target, description);
  target
  description // 全局运动描述，会被animate方法的局部描述覆盖

method:
animate(keyframe, description) // 添加动画，可以链式多次调用添加组动画
  keyframe = {
    scrollTop: {
      start: '', // 开始位置，非必须
      end: '', // 结束位置，非必须，end 和 dis 必须有一个存在，优先 dis
      dis: '', // 变化量，非必须，end 和 dis 必须有一个存在，优先 dis
    },
    opacity: {
      start: '',
      end: '',
      dis: '',
    },
  };
  description = {
    easing: 'linear' || Function, // 动画 timing-function
    duration: 300, // 动画持续时间
    delay: 0, // 每组动画开始前的延迟时间 detal >=16.6
  };

play() // animate调用完成后执行动画

events:
  groupStart
  groupEnd
  animateStart
  animateProgress // ev.detail.rate 表示动画进度
  animateEnd
*/
export class Animate extends EventTarget {
  constructor(target, description) {
    super();
    this._target = target;
    this._description = Object.assign({
      duration: 300,
      easing: 'linear',
      delay: 0,
    }, description);
    this._keyframes = [];
    this._attrs = [
      'scrollTop',
      'scrollLeft',
    ];
  }
  animate(keyframe, description) {
    const frame = {
      target: this._target,
      attrArr: [],
      styleArr: [],
      description: Object.assign(this._description, description),
    };
    const getFormatResult = (key, val, originStart) => {
      const start = parseFloat(originStart);
      const dis = parseFloat(val.dis) || parseFloat(val.end) - start;
      const unit = typeof originStart === 'number' ? '' : originStart.replace(/^\d*(?:\.\d+)?/, '');
      return {
        key,
        start,
        dis,
        unit,
      };
    };
    for (const [key, val] of Object.entries(keyframe)) {
      if (this._attrs.indexOf(key) !== -1) {
        const originStart = val.start || this._target[key];
        frame.attrArr.push(getFormatResult(key, val, originStart));
      } else {
        const originStart = val.start || window.getComputedStyle(this._target).getPropertyValue(key);
        frame.styleArr.push(getFormatResult(key, val, originStart));
      }
    }
    this._keyframes.push(frame);
    return this;
  }
  play() {
    this.dispatchEvent(new Event('groupStart'));
    const frame = i => {
      if (this._keyframes[i]) {
        const keyframe = this._keyframes[i];
        if (keyframe.description.delay >= 16.6) {
          setTimeout(() => {
            this._run(keyframe, () => {
              frame(++i);
            });
          }, keyframe.description.delay);
        } else {
          this._run(keyframe, () => {
            frame(++i);
          });
        }
      } else {
        this.dispatchEvent(new Event('groupEnd'));
      }
    };
    frame(0);
  }
  _run(frame, callback) {
    this.dispatchEvent(new Event('animateStart'));
    const { target, styleArr, attrArr, description } = frame;
    const { duration, easing } = description;
    let timestart;
    const step = timestamp => {
      timestamp = timestamp || window.performance.now();
      if (!timestart) timestart = timestamp;
      const process = Math.min(timestamp - timestart, duration);
      const rate = process / duration;

      for (const style of styleArr) {
        let range = easing === 'linear' ? style.start + rate * style.dis : easing(process, style.start, style.dis, duration);
        target.style.setProperty(style.key, `${range}${style.unit}`);
      }
      for (const attr of attrArr) {
        const range = easing === 'linear' ? attr.start + rate * attr.dis : easing(process, attr.start, attr.dis, duration);
        target[attr.key] = `${range}${attr.unit}`;
      }

      this.dispatchEvent(new CustomEvent('animateProgress', { detail: { rate } }));
      if (process < duration) {
        window.requestAnimationFrame(step);
      } else {
        typeof callback === 'function' && callback();
        this.dispatchEvent(new Event('animateEnd'));
      }
    };
    window.requestAnimationFrame(step);
  }
};