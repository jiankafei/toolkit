export const emojiRawCodeMap = {
  '😊': '[WX]',
  '😋': '[TS]',
  '😌': '[FK]',
  '😍': '[SS]',
  '😎': '[MJ]',
  '😏': '[GC]',
  '😚': '[QQ]',
  '😛': '[GL]',
  '😜': '[ZY]',
  '😝': '[DX]',
  '😞': '[WN]',
  '😟': '[CM]',
  '😪': '[CQ]',
  '😣': '[DK]',
  '😬': '[ZY2]',
  '😭': '[LL]',
  '😮': '[DO]',
  '😯': '[XO]',
  '😺': '[MX]',
  '😻': '[MA]',
  '😼': '[MP]',
  '😽': '[MQ]',
  '😾': '[MN]',
  '😿': '[MK]',
  '🌹': '[MG]',
  '👩‍❤️‍💋‍👩': '[QW]',
  '💕': '[AX]',
  '💖': '[XG]',
  '🙁': '[BGX]',
  '🙃': '[HH]',
  '🙄': '[PY]',
  '🙅🏼‍♀️': '[JJ]',
  '🙅🏾‍♂️': '[BX]',
  '🤗': '[ZBX]',
  '🤙': '[DH]',
  '🤡': '[XC]',
  '🤣': '[LLMM]',
  '🤤': '[TX]',
  '🤥': '[SH]',
  '🤦🏻‍♂️': '[WL]',
  '🤦🏼': '[MWN]',
  '✌': '[OK]',
  '💀': '[SW]',
  '☹️': '[SM]',
  '❓': '[YM]',
  '❗': '[JT]',
  '❤': '[AN]',
};

export const emojiCodeRawMap = {
  '[WX]': '😊',
  '[TS]': '😋',
  '[FK]': '😌',
  '[SS]': '😍',
  '[MJ]': '😎',
  '[GC]': '😏',
  '[QQ]': '😚',
  '[GL]': '😛',
  '[ZY]': '😜',
  '[DX]': '😝',
  '[WN]': '😞',
  '[CM]': '😟',
  '[CQ]': '😪',
  '[DK]': '😣',
  '[ZY2]': '😬',
  '[LL]': '😭',
  '[DO]': '😮',
  '[XO]': '😯',
  '[MX]': '😺',
  '[MA]': '😻',
  '[MP]': '😼',
  '[MQ]': '😽',
  '[MN]': '😾',
  '[MK]': '😿',
  '[MG]': '🌹',
  '[QW]': '👩‍❤️‍💋‍👩',
  '[AX]': '💕',
  '[XG]': '💖',
  '[BGX]': '🙁',
  '[HH]': '🙃',
  '[PY]': '🙄',
  '[JJ]': '🙅🏼‍♀️',
  '[BX]': '🙅🏾‍♂️',
  '[ZBX]': '🤗',
  '[DH]': '🤙',
  '[XC]': '🤡',
  '[LLMM]': '🤣',
  '[TX]': '🤤',
  '[SH]': '🤥',
  '[WL]': '🤦🏻‍♂️',
  '[NWN]': '🤦🏼',
  '[OK]': '✌',
  '[SW]': '💀',
  '[SM]': '☹️',
  '[YW]': '❓',
  '[JT]': '❗',
  '[AN]': '❤',
};

// raw to code
const emojiRawRE = /(😊|😋|😌|😍|😎|😏|😚|😛|😜|😝|😞|😟|😪|😣|😬|😭|😮|😯|😺|😻|😼|😽|😾|😿|🌹|👩‍❤️‍💋‍👩|💕|💖|🙁|🙃|🙄|🙅🏼‍♀️|🙅🏾‍♂️|🤗|🤙|🤡|🤣|🤤|🤥|🤦🏻‍♂️|🤦🏼|✌|💀|☹️|❓|❗|❤)/g;
export const fmrc = (content) => {
  emojiRawRE.lastIndex = 0;
  return content.replace(emojiRawRE, (match) => {
    return emojiRawCodeMap[match];
  });
};

// code to raw
const emojiCodeRE = /(\[WX\]|\[TS\]|\[FK\]|\[SS\]|\[MJ\]|\[GC\]|\[QQ\]|\[GL\]|\[ZY\]|\[DX\]|\[WN\]|\[CM\]|\[CQ\]|\[DK\]|\[ZY2\]|\[LL\]|\[DO\]|\[XO\]|\[MX\]|\[MA\]|\[MP\]|\[MQ\]|\[MN\]|\[MK\]|\[MG\]|\[QW\]|\[AX\]|\[XG\]|\[BGX\]|\[HH\]|\[PY\]|\[JJ\]|\[BX\]|\[ZBX\]|\[DH\]|\[XC\]|\[LLMM\]|\[TX\]|\[SH\]|\[WL\]|\[NWN\]|\[OK\]|\[SW\]|\[SM\]|\[YW\]|\[JT\]|\[AN\])/g;
export const fmcr = (content) => {
  emojiCodeRE.lastIndex = 0;
  return content.replace(emojiCodeRE, (match) => {
    return emojiCodeRawMap[match];
  });
};