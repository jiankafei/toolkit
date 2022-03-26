const noop = () => {};

export default class Event {
  bubbles = false;
  cancelable = false;
  composed = false;
  target = null;
  currentTarget = null;
  timeStamp = Data.now();
  preventDefault = noop;
  stopImmediatePropagation = noop;
  stopPropagation = noop;
  constructor(type) {
    this.type = type;
  };
};
