// 空值
export const nil = () => Object.create(null);

// 类型判断
export const typeis = (obj) => Object.prototype.toString.call(obj).slice(8, -1);

// 是否是真值
export const isTruthy = (val) => val !== undefined && val !== null && val !== 'undefined' && val !== 'null' && val.trim() !== '';

// 是否是假值
export const isFalsy = (val) => val === undefined || val === null && val === 'undefined' || val === 'null' && val === '';

// 过滤表单值
export const filterData = (formData) => {
  const data = {};
  Object.entries(formData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) data[key] = value;
    } else {
      if(!nil(value)) data[key] = value;
    }
  });
  return data;
};

// 本地存储
const isSNBType = (obj) => {
  const type = typeis(obj);
  return type === 'String' || type === 'Number' || type === 'Boolean';
};
export const localStore = {
  get: (key) => {
    let res = localStorage.getItem(key);
    try {
      if (res) res = JSON.parse(res);
    } catch (error) {
      // console.warn(error);
    }
    return res;
  },
  set: (key, value) => {
    if (isFalsy(key) || isFalsy(value)) return;
    try {
      value = isTruthy(value) ? value : '';
      if (typeis(value) === 'Object' || Array.isArray(value)) {
        value = JSON.stringify(value);
      } else if (!isSNBType(value)) {
        value = '';
      }
    } catch (error) {
      value = '';
    }
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  },
  remove: key => {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  },
};

// 检测和标准化 url
export const checkURL = (url) => {
  if (!url) return null;
  try {
    const URL = window.URL || window.webkitURL;
    if (/^\/\//.test(url)) {
      return new URL(`${window.location.protocol}${url}`);
    }
    if (/^\//.test(url)) {
      return new URL(`${window.location.origin}${url}`);
    }
    if (!/^https?:\/\//.test(url)) {
      return new URL(`${window.location.protocol}//${url}`);
    }
    return new URL(url);
  } catch (error) {
    console.warn(error);
    return null;
  }
};

// 保存文件
export const saveFile = (content, suffix, filename = '未命名') => {
  let url;
  if (content instanceof Blob) {
    url = URL.createObjectURL(content);
  } else if (typeof content === 'string') {
    url = URL.createObjectURL(new Blob(content));
  } else if (content.constructor === Object || Array.isArray(content)) {
    url = URL.createObjectURL(new Blob(JSON.stringify(content), { type: 'application/json' }));
  }
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${suffix}`;
    a.dispatchEvent(new MouseEvent('click'));
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  } else {
    console.warn('Content must be Blob or Object or Array or String');
  }
};

/**
 * name: nameA-nameB-nameC
 * path: /pathA/pathB/pathC
[
  {
    name: '',
    path: '', // 支持外链
    redirect: '', // 支持自动添加
    component: Comp,
    meta: {
      title: '',
      menu: Boolean,
      icon: '', // icon 名称
    },
    children: [
      类似结构
    ],
  }
]
*/
// 处理原始路由数据生成菜单和路由
export const createMenusAndRoutes = (routesRaw) => {
  const routes = [];
  const menus = [];
  const processData = (list, menus, parent) => {
    list.forEach(({ children = [], ...routeRaw }) => {
      // init
      routeRaw.meta = Object.assign({ title: '' }, routeRaw.meta);
      let menu = Object.create(null);

      // route menu state
      let isDealRoute = false;
      let isDealMenu = false;
      if (!routeRaw.component) {
        // console.log('无组件路由');
        if (isProtocol(routeRaw.path)) {
          // console.log('外链');
          isDealMenu = true;
        } else if (children.length) {
          // console.log('有子路由');
          isDealRoute = true;
          isDealMenu = true;
        } else if (routeRaw.redirect) {
          // console.log('自定义跳转路由');
          isDealRoute = true;
          isDealMenu = true;
        } else {
          // console.warn('无效路由');
        }
      } else {
        // console.log('有组件路由');
        isDealRoute = true;
        isDealMenu = true;
      }

      if (isDealRoute) {
        routeRaw.name = parent.name ? `${parent.name}-${routeRaw.name}` : routeRaw.name;
        routeRaw.path = parent.path ? `${parent.path}/${routeRaw.path}` : routeRaw.path;
        if (!routeRaw.component && children.length) {
          routeRaw.redirect = `${routeRaw.path}/${children[0].path}`;
        } else if (routeRaw.redirect) {
          routeRaw.redirect = /^\//.test(routeRaw.redirect) ? routeRaw.redirect : `${routeRaw.path}/${routeRaw.redirect}`;
        }
        const currentBreadcrumb = {
          name: routeRaw.name,
          title: routeRaw.meta.title,
        };
        routeRaw.meta.breadcrumb = (parent.meta && parent.meta.breadcrumb) ? [...parent.meta.breadcrumb, currentBreadcrumb] : [currentBreadcrumb];
        routes.push({ ...routeRaw });
      }

      if (isDealMenu) {
        menu = {
          ...routeRaw,
          children: [],
        };
        if (menus && routeRaw.meta.menu) {
          menus.push(menu);
        }
      }

      if (children.length) {
        processData(children, menu.children, routeRaw);
      }
    });
  };
  processData(routesRaw, menus, Object.create(null));

  return {
    routes,
    menus,
  };
};

// 生成 areas
export const getAreasData = ({ provinces, cities, counties }) => {
  // 生成 map
  const provincesMapRaw = {};
  const citiesMapRaw = {};
  const countiesMapRaw = {};
  for (const item of provinces) {
    provincesMapRaw[item.code] = {
      value: item.code,
      label: item.name
    };
  }
  for (const item of cities) {
    citiesMapRaw[item.code] = {
      value: item.code,
      label: item.name
    };
  }

  // 生成 areas
  const provincesMap = JSON.parse(JSON.stringify(provincesMapRaw));
  const citiesMap = JSON.parse(JSON.stringify(citiesMapRaw));

  for (const item of counties) {
    countiesMapRaw[item.code] = {
      value: item.code,
      label: item.name
    };
    if (!citiesMap[item.parentCode].children) {
      citiesMap[item.parentCode].children = [];
    }
    citiesMap[item.parentCode].children.push(countiesMapRaw[item.code]);
  }
  for (const item of cities) {
    if (!provincesMap[item.parentCode].children) {
      provincesMap[item.parentCode].children = [];
    }
    provincesMap[item.parentCode].children.push(citiesMap[item.code]);
  }
  return {
    areas: Object.values(provincesMap),
    provincesMapRaw,
    citiesMapRaw,
    countiesMapRaw
  };
};

// 复制
export const copyText = (text) => {
  const el = document.createElement('textarea');
  el.style = 'width: 0; height: 0; overflow: hidden; margin: 0; padding: 0';
  el.value = typeof text === 'object' ? JSON.stringify(text) : text;
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, el.value.length);
  document.execCommand('copy');
  document.body.removeChild(el);
};

// 根据路径获取值
export const getPathsValue = (obj, paths) => {
  for (const key of paths.split('.')) {
    if (!obj[key]) return;
    obj = obj[key];
  }
  return obj;
};

// 文件后缀
export const fileSuffix = (file) => {
  return (/.*\.(.*)$/.exec(file.name) || ['', ''])[1];
};

// 可已接受的文件类型
export const acceptTypes = (file, ...types) => {
  const suffix = fileSuffix(file);
  return types.some(type => (file.type === type || suffix === type));
}

//判断是否支持某个css样式
//cssStr必须是标准css样式属性
export const CSSSupportsRule = (cssStr) => {
	let styles = document.body.style || document.documentElement.style;
	let cssStr2 = cssStr.charAt(0).toUpperCase() + cssStr.substring(1);
	if ((cssStr in styles) || ('webkit' + cssStr2 in styles) || ('ms' + cssStr2 in styles) || ('moz' + cssStr2 in styles) || ('o' + cssStr2 in styles)) {
		return true;
	};
};

// 获取随机值
export const getRandomValue = () => {
  const array = new Uint32Array(3);
  window.crypto.getRandomValues(array);
  return array.join('-');
};

// 获取计算样式
export const getComputedStyle = (el, name) => {
  if (el.computedStyleMap) {
    return el.computedStyleMap().get(name).value;
  }
  return window.getComputedStyle(el).getPropertyValue(name);
};

// 深度复制
const deepMerge = (...rest) => {
  const result = Object.create(null);
  const assign = (key, val) => {
    const resultType = is(result[key]);
    const valType = is(val);
    if (resultType === 'Object' && valType === 'Object') {
      result[key] = deepMerge(result[key], val);
    } else if (valType === 'Object') {
      result[key] = deepMerge(Object.create(null), val);
    } else {
      result[key] = val;
    }
  };
  for (const obj of rest) {
    for (const key of Object.keys(obj)) {
      assign(key, obj[key]);
    }
  }
  return result;
};


// 生成查询字符串路径 path 必须
const QSPath = (path, data = {}) => {
  let qs = '';
  for (const key of Object.keys(data)) {
    qs += `&${key}=${data[key]}`;
  }
  return qs ? `${path}?${qs.slice(1)}` : path;
};

// 获取分享路径 base path 必须
const sharePath = (base, path, data = {}) => {
  switch (base) {
    case 'home':
      base = '/pages/index/index';
      break;
    case 'theme':
      base = '/pages/themes/index/index';
      break;
    case 'room':
      base = '/pages/rooms/index/index';
      break;
    case 'me':
      base = '/pages/me/index/index';
      break;
    case 'qrcode-home':
      base = 'http://apis-puzzle-test.zaih.com/qrcode/activity';
      break;
    case 'qrcode-theme':
      base = 'http://apis-puzzle-test.zaih.com/qrcode/theme';
      break;
    case 'qrcode-room':
      base = 'http://apis-puzzle-test.zaih.com/qrcode/room';
      break;
    case 'qrcode-me':
      base = 'http://apis-puzzle-test.zaih.com/qrcode/me';
      break;
  }
  const redirectPath = encodeURIComponent(this.QSPath(path, data));
  return `${base}?redirect=${redirectPath}`;
};

// 解析跳转路径
const parseRedirectPath = (options) => {
  const landings = [
    'http://apis-puzzle-test.zaih.com/qrcode/activity',
    'http://apis-puzzle-test.zaih.com/qrcode/theme',
    'http://apis-puzzle-test.zaih.com/qrcode/room',
    'http://apis-puzzle-test.zaih.com/qrcode/me',
  ]
  if (options.redirect) {
    // 卡片分享
    return decodeURIComponent(options.redirect);
  } else if (options.q) {
    // 二维码分享
    const q = decodeURIComponent(options.q);
    const [host, qs] = q.split('?');
    if (landings.indexOf(host) !== -1) {
      return decodeURIComponent(qs.split('=')[1]);
    }
  }
  return '';
};

// 导航，分享出去的链接会自动被微信转码，放在 onLoad
const redirect = (options) => {
  const redirectPath = this.parseRedirectPath(options);
  if (redirectPath) {
    wx.navigateTo({
      url: redirectPath,
    });
  }
};
