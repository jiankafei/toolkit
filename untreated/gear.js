// 同层同步
const queue = [{
	timeout: 2000,
	callback: () => {},
}, {
	timeout: 2000,
	callback: () => {},
}];

const dispatcherSync = queue => {
  let index = 0;
  const sync = task => {
    task.callback();
    if (task.timeout) {
      setTimeout(() => {
        const task = queue[++index];
        if (task) sync(task);
      }, task.timeout);
    } else {
      const task = queue[++index];
      if (task) sync(task);
    }
  };
  const task = queue[index];
  if (task) sync(task);
};

// 同层异步，父子层同步
const queue = [{
	timeout: 2000,
	callback: () => {},
	queue: []
}, {
	timeout: 2000,
	callback: () => {},
	queue: []
}];

const dispatcherAsync = queue => {
  const sync = task => {
    task.callback();
    setTimeout(() => {
      if (Array.isArray(task.queue) && task.queue.length) {
        for (const itemTask of task.queue) {
          sync(itemTask);
        }
      }
    }, task.timeout);
  };
  if (Array.isArray(queue)) {
    for (const task of queue) {
      sync(task);
    }
  } else {
    sync(queue);
  }
};
