
window.addEventListener('error', (msg, url, row, col, error) => {
  console.warn({
		msg, // 错误信息
		url, // 发生错误的脚本
		row, // 行号
		col, // 列号
		error, // error的具体信息
	});
	// 错误堆栈信息
	console.warn(error.stack);
});

// 捕获 promise 错误
window.addEventListener('unhandledrejection', event => {});

// 跨域脚本错误监控：
// 1. CDN资源头设置Access-Control-Allow-Origin: *
// 2. <script crossorigin></script>

// API 报错
// 只能写在请求库的状态码判断里

// onerror 无法捕获异步任务的错误
