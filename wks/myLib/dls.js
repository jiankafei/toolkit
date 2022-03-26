// 保存文件
// content 可以为 ObjectURL 或者 Data URLs
export const saveFile = (content, suffix, filename) => {
  const a = document.createElement('a');
  a.href = content;
  a.download = `${filename}.${suffix}`;
  a.dispatchEvent(new MouseEvent('click'));
};
