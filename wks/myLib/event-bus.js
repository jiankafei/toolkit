/**
 * 页面间通信事件
 * @method on 向后添加事件 name, cb[, scope]
 * @method once 向后添加事件，回掉函数只会执行一次
 * @method fire 触发事件 name[, data]
 * @method off 移除事件 name[, cb]
 * @prop names 当前事件名列表
 */

const bus = new Map();

const on = (type, callback) => {
  if (!bus.get(type)) bus.set(type) = new Set();
  bus.get(type).add(callback);
};

const once = (type, callback) => {
  callback.__once__ = true;
  on(type, callback);
};

const off = (type, callback) => {
  if (!bus.get(type)) return;
  bus.get(type).delete(callback);
  if (!bus.get(type).size) {
    bus.delete(type);
  }
};

const fire = (type, detail) => {
  if (!bus.get(type)) return;
  for (const callback of bus.get(type)) {
    callback(detail);
    if (callback.__once__) {
      off(type, callback);
    }
  }
};

const EventBus = {
  on,
  once,
  off,
  fire,
  get names() {
    return bus.keys();
  },
};

export default EventBus;