window.AudioContext = window.AudioContext || window.webkitAudioContext;
// AudioAPI 私有方法
const methods = {
  createNodes(nodes = ['Gain']) {
    const nodesObj = {};
    for (const node of nodes) {
      nodesObj[node] = this.ctx[`create${node}`]();
    }
    return nodesObj;
  },
  createBufferSource() {
    const { ctx } = this;
    const source = ctx.createBufferSource();
    source.start = source.start || source.noteGrainOn;
    source.stop = source.stop || source.noteOff;
    return source;
  },
  createOscillator() {
    const osc = this.ctx.createOscillator();
    osc.start = osc.start || osc.noteOn;
    osc.stop = osc.stop || osc.noteOff;
    return osc;
  },
  createAudio(buffer) {
    const { ctx } = this;
    const source = this.createBufferSource();
    source.buffer = buffer;
    const gain = this.nodes.Gain;
    source.connect(gain);
    gain.connect(ctx.destination);
    return {
      source,
      gain,
    };
  },
  decodedBuffer(data) {
    const { ctx } = this;
    return new Promise((resolve, reject) => {
      if (ctx.decodeAudioData) {
        ctx.decodeAudioData(data, buffer => {
          resolve(this.createAudio(buffer));
        }, err => {
          console.log(`Error with decoding audio data${err.err}`);
          reject(err);
        });
      } else {
        const buffer = ctx.createBuffer(data, false);
        if (buffer) {
          resolve(this.createAudio(buffer));
        } else {
          alert('Decoding the audio buffer failed');
          reject(err);
        }
      }
    });
  },
  // 淡入淡出
  crossfade(element) {
    const x = parseInt(element.value) / parseInt(element.max);
    // Use an equal-power crossfading curve
    const gain1 = Math.cos(x * 0.5 * Math.PI);
    const gain2 = Math.cos((1.0 - x) * 0.5 * Math.PI);
    this.ctl1.gainNode.gain.value = gain1;
    this.ctl2.gainNode.gain.value = gain2;
  },
};
// 绑定私有方法
for (const method of Object.keys(methods)) {
  methods[method].bind(methods);
}

// AudioAPI
class AudioAPI {
  constructor(...args) {
    // 初始化
    this.audioType = 'webapi';
    this.ctx = new window.AudioContext();
    this.ctx.createGain = this.ctx.createGain || this.ctx.createGainNode;
    this.ctx.createDelay = this.ctx.createDelay || this.ctx.createDelayNode;
    this.ctx.createScriptProcessor = this.ctx.createScriptProcessor || this.ctx.createJavaScriptNode;
    // 关联私有方法
    Object.setPrototypeOf(methods, this);
    // 创建 nodes
    this.nodes = methods.createNodes(args.nodes);
    // 创建 player
    this.audio = this.createAudio();
  }
  play() {
    this.audio.source.play();
  }
  pause() {
    this.audio.source.stop();
  }
  toggle() {
    this.paused ? this.audio.source.play() : this.audio.source.stop();
    this.paused = !this.paused;
  }
}

// AudioTag
class AudioTag extends Audio {
  constructor(...args) {
    super(args);
    this.audioType = 'element';
  }
  toggle() {
    this.paused ? this.play() : this.pause();
  }
}

export default class AudioPlayer {
  constructor(options, type) {
    if (type === 'element') {
      return new AudioTag(options);
    } else if (type === 'audioapi') {
      return new AudioAPI(options);
    } else {
      return window.AudioContext ? new AudioAPI(options) : new AudioTag(options);
    }
  }
}