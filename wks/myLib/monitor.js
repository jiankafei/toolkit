const observe = data => new Proxy(data, {
  set: (target, key, value) => {
    const res = Reflect.set(target, key, value);
    this.handles[key].map(item => item.update());
    return res;
  },
});

const compile = () => {};

// 使用
const obj = {};
const state = observe(obj);
watch(obj, () => {});
state.aaa = 1;