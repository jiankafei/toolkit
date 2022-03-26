// WeixinJSBridge.invoke('', res => { console.log(res.err_msg) });

const wp = new Proxy(wx, {
  get: (target, name) => {
    if (/^(?:config|ready|error)$/.test(name)) return;
    if (name === 'verify') {
      return (options = Object.create(null)) => new Promise((resolve, reject) => {
        target.config(options);
        // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
        wx.ready(resolve);
        // 对于SPA可以在这里更新签名
        wx.error(reject);
      });
    }
    return (options = Object.create(null)) => new Promise((resolve, reject) => {
      for (const name of ['success', 'fail', 'complete']) {
        delete options[name];
      }
      target[name]({
        success: resolve,
        fail: reject,
        ...options,
      });
    });
  },
});

export default wp;
