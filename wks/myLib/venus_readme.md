# venus

## 全局配置

### 设置

```js
venus.defaults = {};
```

### 添加拦截器

```js
const req1 = venus.reqWall.use(config => {
  return config;
}, err => Promise.reject(err));
const res1 = venus.resWall.use(res => {
  return res;
}, err => Promise.reject(err));
```

### 移除拦截器

```js
venus.resWall.eject(req1);
venus.resWall.eject(res1);
```

## 默认实例发起一个请求

```js
const fetch = venus.fetch(config);
const fetch = venus[method](url, data, config);
```

## 新建实例

### 启动一个实例

```js
const instance = venus.create(defaults);
```

### 修改实例设置

1、 覆盖实例化时的 defaults

```js
  instance.defaults = {};

  /* 注：
    1. 这种方式会覆盖内部配置和全局配置，所以不建议这样用；
    2. 默认配置在实例化时传入即可，推荐第二种单个修改个别配置；
    3. 这样的设计是为了内部优化考虑；
    4. 若有需要批量修改默认配置的需求，推荐使用 Object.assign(defaults, {...otherConfig});
  */
```

2、 修改实例化时的 defaults

```js
  instance.defaults.baseURL = 'baseURL';
```

### 添加实例拦截器

```js
const req1 = instance.reqWall.use(config => {
  return config;
}, err => Promise.reject(err));
const res1 = instance.resWall.use(res => {
  return res;
}, err => Promise.reject(err));
```

### 移除实例拦截器

```js
instance.resWall.eject(req1);
instance.resWall.eject(res1);
```

### 实例发起一个请求

```js
const fetch = instance.fetch(config);
const fetch = instance[method](url, data, config);
```

## Callback

```js
fetch.done(res => {});
fetch.fail(err => {});
fetch.end(() => {});
```

注：请求方法返回的实例都支持链式调用 Callback

## Method

```js
'post', 'put', 'patch';
'delete', 'get', 'head', 'options';
```

## Request Config

```js
{
  url,
  baseURL,
  method: 'GET', // 默认 GET
  header,
  data,
  timeout: 0, // 默认0 代表使用代理的默认超时
  dataType, // 默认json [json, '']
  responseType, // 默认text [text, arraybuffer]
  validateStatus: status => status >= 200 && status < 300 || status === 304, // true ? done : fail
}
```

## Response Schema

```js
res = {
  statusCode,
  statusText,
  data,
  header,
  config, // 该次请求的配置
}
```

## 内部状态码

  408 // Request Timeout 请求超时

  418 // I am a Teapot 网络错误

注：这两个状态的返回值为 {statusCode, statusText}
