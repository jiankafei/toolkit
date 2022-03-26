const wm = new WeakMap();

export default class EventTarget {
  get events() {
    return wm.get(this).keys();
  }
  constructor() {
    wm.set(this, new Map());
  }
  addEventListener(type, callback) {
    if (!type) throw new Error('params: type is required');
    if (!callback) throw new Error('params: callback is required');
    const map = wm.get(this);
    if (!map.get(type)) map.set(type) = new Set();
    map.get(type).add(callback);
  }
  removeEventListener(type, callback) {
    if (!type) throw new Error('params: type is required');
    if (!callback) throw new Error('params: callback is required');
    const map = wm.get(this);
    map.get(type).delete(callback);
    if (!map.get(type).size) {
      map.delete(type);
    }
  }
  dispatchEvent(ev) {
    const map = wm.get(this);
    ev.target = ev.currentTarget = this;
    for (const callback of map.get(ev.type)) {
      callback.call(this, ev);
    }
  }
};