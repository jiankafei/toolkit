const sse = (url) => {
  const es = new EventSource(url);
  es.addEventListener('message', (res) => {
    console.log(res.data);
  });
  es.addEventListener('ping', (res) => {
    console.log(res.data);
  });
};
