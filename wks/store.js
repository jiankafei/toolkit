import {
  useState, useEffect, useCallback, Component,
} from 'react';
import {
  produce,
  createDraft,
} from 'immer';

const aaa = {};

const createStore = (baseState) => {
  const queue = new Set();
  return {
    subscribe(handler) {
      queue.add(handler);
      return () => {
        queue.delete(handler);
      };
    },
    dispatch(reducer) {
      const nextState = baseState = produce(baseState, reducer);
      queue.forEach(handler => void (handler(nextState)));
    },
    get state() {
      return createDraft(state);
    },
    useState() {
      const [state, setState] = useState(createDraft(baseState));
      useEffect(() => {
        queue.add(setState);
        return () => {
          queue.delete(setState);
        };
      }, []);
      return state;
    },
    useDispatch() {
      const dispatch = useCallback((reducer) => {
        const nextState = baseState = produce(baseState, reducer);
        queue.forEach(handler => void (handler(nextState)));
      }, []);
      return dispatch;
    },
    useStore() {
      const [state, setState] = useState(createDraft(baseState));
      const dispatch = useCallback((reducer) => {
        const nextState = baseState = produce(baseState, reducer);
        queue.forEach(handler => void (handler(nextState)));
      }, []);
      useEffect(() => {
        queue.add(setState);
        return () => {
          queue.delete(setState);
        };
      }, []);
      return [state, dispatch];
    },
  };
};

class Component extends React.Component {
  constructor(props) {
    super(props);
  };
  // 该方法会在 componentDidMount 时执行，在 componentWillUnmount 时尝试执行返回值
  // 如果返回值为数组，则会尝试执行数组的每一项
  componenFromMountToUnmout = (state, props) => ([
    subscribe(),
    subscribe(),
    subscribe(),
  ]);
  componentEffect() {};
  componentLayoutEffect() {};
};

// 改造
const unMountHandlers = Symbol('unMountHandlers');
const componentDidMount = Component.prototype.componentDidMount;
const componentWillUnmount = Component.prototype.componentWillUnmount;
Component.prototype.componentDidMount = function (...args) {
  this[unMountHandlers] = this.componenFromMountToUnmout();
  componentDidMount.call(this, ...args);
}
Component.prototype.componentWillUnmount = function (...args) {
  if (!Array.isArray(this[unMountHandlers])) {
    this[unMountHandlers] = [this[unMountHandlers]];
  }
  this[unMountHandlers].forEach(handle => {
    typeof handle === 'function' && handle();
  });
  componentWillUnmount.call(this, ...args);
}

export default createStore(aaa);
