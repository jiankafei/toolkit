const defaultheader = {
  'content-type': 'application/json',
};

class SocketIO {
  id = Date.now();
  connected = false;
  queue = new Map();
  constructor(url, options) {
    this.url = url;
    this.protocol = options.protocol || [];
    options.field = options.field || 'type';
    this.options = options;
    this._connect();
  };
  // open close error
  on(name, callback) {
    if (!callback) return;
    if (!this.queue.has(name)) {
      this.queue.set(name, new Set());
    }
    this.queue.get(name).add(callback);
  };
  emit(name, data) {
    this.ST.send({
      data: JSON.stringify({
        [this.options.field]: name,
        ...data,
      }),
    });
  };
  open() {
    this._connect();
  };
  close() {
    console.log('主动断开连接');
    this.ST.close();
  };
  _connect() {
    const { header, ...rest } = this.options;
    this.ST = wx.connectSocket({
      url: this.url,
      header: Object.assign({}, defaultheader, header),
      ...rest,
    });

    this.ST.onOpen((res) => {
      console.log(`Socket open`, res);
      this.connected = true;
      if (this.queue.has('open')) {
        this.queue.get('open').forEach(callback => {
          callback(res);
        });
      }
    });

    this.ST.onMessage((res) => {
      const data = JSON.parse(res.data);
      // console.log('Socket Msg', data);
      const name = data[this.options.field];
      if (this.queue.has(name)) {
        this.queue.get(name).forEach(callback => {
          callback(data);
        });
      }
    });

    this.ST.onClose((res) => {
      console.log('Socket Close', res);
      this.connected = false;
      if (this.queue.has('close')) {
        this.queue.get('close').forEach(callback => {
          callback(res);
        });
      }
    });

    this.ST.onError((err) => {
      console.log('Socket Error', err);
      this.connected = false;
      if (this.queue.has('error')) {
        this.queue.get('error').forEach(callback => {
          callback(err);
        });
      }
    });
  };
};

export default (url, options) => new SocketIO(url, options);
