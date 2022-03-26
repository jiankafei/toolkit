export default (el) => new Promise((resolve, reject) => {
  const dropHandler = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    if (ev.target === el) {
      resolve(ev.dataTransfer.files);
    } else {
      reject();
    }
  }

  const dragEnterHandler = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    ev.dataTransfer.dragEffect = 'copy';
  };

  document.addEventListener('drop', dropHandler, false);
  document.addEventListener('dragenter', dragEnterHandler, false);
});