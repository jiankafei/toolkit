// FileReader方式
window.addEventListener('dragenter', ev => {
	ev.preventDefault();
}, false);
window.addEventListener('dragover', ev => {
	ev.preventDefault();
}, false);
window.addEventListener('drop', ev => {
	const reader = new FileReader();
	reader.onload = ev => {
		document.body.insertAdjacentHTML('afterBegin', ev.target.result);
		document.body.classList.remove('empty');
	};
	reader.readAsDataURL(ev.dataTransfer.files[0]);
	ev.preventDefault();
}, false);


// 原生方法
// Base64解码
let decodedData = window.atob(encodedData);
// Base64编码
let encodedData = window.btoa(stringToEncode);
