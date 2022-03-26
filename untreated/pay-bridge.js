export default ({
  appid,
  nonce_str,
  prepay_id,
  time_stamp,
  pay_sign
}, done, fail, cancel) => {
  const options = {
    "appId": appid,
    "timeStamp": time_stamp,
    "package": `prepay_id=${prepay_id}`,
    "nonceStr": nonce_str,
    "signType": 'MD5',
    "paySign": pay_sign,
  };

  const onBridgeReady = () => {
    WeixinJSBridge.invoke('getBrandWCPayRequest', options, res => {
      // console.log('支付返回', res);
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        done && done();
      } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
        fail && fail();
      } else {
        cancel && cancel();
      }
    });
  };

  if (typeof WeixinJSBridge === 'undefined') {
    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
  } else {
    onBridgeReady();
  }
};
