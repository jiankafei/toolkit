// 数学计算
const round = (numArr, sl, tl) => {
  tl = tl || sl;
  return parseInt(numArr.join('')) * Math.pow(10, tl - sl);
};
const pause = (m, n) => {
  const mArr = ('' + m).split('.'),
    nArr = ('' + n).split('.'),
    ml = mArr[1] ? mArr[1].length : 0,
    nl = nArr[1] ? nArr[1].length : 0,
    l = ml >= nl ? ml : nl;
  return {
    mArr,
    nArr,
    ml,
    nl,
    l,
  };
};
export const math = {
	// 加法
	add: (m, n) => {
    const { mArr, nArr, ml, nl, l } = pause(m, n);
		return (round(mArr, ml, l) + round(nArr, nl, l)) / Math.pow(10, l);
	},
	// 减法
	sub: (m, n) => {
		const { mArr, nArr, ml, nl, l } = pause(m, n);
		return (round(mArr, ml, l) - round(nArr, nl, l)) / Math.pow(10, l);
	},
	// 乘法
	mul: (m, n) => {
		const { mArr, nArr, ml, nl } = pause(m, n);
		return round(mArr, ml) * round(nArr, nl) / Math.pow(10, (ml + nl));
	},
	// 除法
	div: (m, n) => {
		const { mArr, nArr, ml, nl, l } = pause(m, n);
    return round(mArr, ml, l) / round(nArr, nl, l);
	},
};