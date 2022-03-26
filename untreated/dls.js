// 保存文件
// content 可以为 ObjectURL 或者 Data URLs
export const saveFile = (content, suffix, filename) => {
  const a = document.createElement('a');
  a.href = content;
  a.download = `${filename}.${suffix}`;
  a.dispatchEvent(new MouseEvent('click'));
};
// 下载文件
export const dlFile = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject();
      }
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.send();
  });
};
// 下载并保存文件
export const dlsFile = (url, suffix, filename = '未命名') => {
  dlFile(url)
    .then(blob => {
      const content = URL.createObjectURL(new Blob([blob]));
      saveFile(content, suffix, filename);
    })
    .catch(console.warn);
};