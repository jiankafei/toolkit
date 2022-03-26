// 本地存储

// 获取
const getItem = (name, defaultValue = '') => {
  let res = localStorage.getItem(name);
  try {
    res = JSON.parse(res) || Object.create(null);
  } catch (error) {
    console.warn(error);
    return res || defaultValue;
  }
  if (!res.maxAge || Date.now() - res.createTime <= res.maxAge * 1000) {
    return res.value || defaultValue;
  } else {
    localStorage.removeItem(name);
    return defaultValue;
  }
};

export const local = {
  // 没有 name 则获取所有存储
  // defaultValue 默认值，纯粹为了好看，只有在有name时才有作用
  get: (name, defaultValue = '') => {
    if (name) {
      return getItem(name, defaultValue);
    } else {
      const res = {};
      for (const index of localStorage.length) {
        const name = localStorage.key(index);
        const value = getItem(name);
        if (value) res[name] = value;
      }
      return res;
    }
  },
  // maxAge -1 表示永久存储，单位s
  set: (name, value = '', maxAge = -1) => {
    if (!name || typeof name !== 'string') {
      return console.warn('name is required and must be a String');
    }
    if (typeof maxAge !== 'number') {
      return console.warn('maxAge must be a Number');
    }
    try {
      JSON.stringify(value);
    } catch (error) {
      console.warn(error);
      value = '';
    }
    const data = Object.create(null);
    data.value = value;
    if (maxAge > 0) {
      data.maxAge = maxAge;
      data.createTime = Date.now();
    }
    localStorage.setItem(name, JSON.stringify(data));
  },
  // 没有 name 则删除所有存储
  remove: (name) => {
    if (name) {
      localStorage.removeItem(name);
    } else {
      localStorage.clear();
    }
  },
};
