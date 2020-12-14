
/* 数字和金额操作 */

/** number */
function dotNum (num:any) {
    let sq = 0;
    try {
        sq = num.toString().split('.')[1].length;
    } catch (e) {
    }
    return sq;
}

/**
 * 加函数
 */

export function bcadd(num1:any, num2: any) {
    const sq1 = dotNum(num1);
        const sq2 = dotNum(num2);
        const m = 10 ** Math.max(sq1, sq2);
    return (num1 * m + num2 * m) / m;
}

/**
 * 减函数
 */
export function bcsub(arg1: any, arg2: any) {
    const r1 = dotNum(arg1);
        const r2 = dotNum(arg2);
        const m = 10 ** Math.max(r1, r2);
    return ((arg1 * m - arg2 * m) / m);
}

/**
 * 乘函数
 */
export function bcmul(arg1: any, arg2: any) {
    let m = 0;
        const s1 = arg1.toString();
        const s2 = arg2.toString();
    m += dotNum(arg1);
    m += dotNum(arg2);
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / 10 ** m);
}

/**
 * 除函数
 */
export function bcdiv(arg1: any, arg2: any) {
    const t1 = dotNum(arg1);
        const t2 = dotNum(arg2);
        const r1 = Number(arg1.toString().replace('.', ''));
        const r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * 10 ** (t2 - t1);
}

/**
 * 给数字补n个0
 */
export function padZero(num: string | number, total = 0, atBegin = false) {
    let i = 0;
    let zeros = '';
    while (i < total) {
        i++;
        zeros += '0';
    }
    return atBegin ? zeros + num : num + zeros;
}

/**
 * formatMoney，格式化后的金额字符串
 * formatMoney(102345.332, 2) 返回'102,345.44'
 */
export function formatMoney(numIn: number|string, digitIn = 3, cut = false) {
    let num = Number(numIn);
    let digit = parseInt(String(digitIn));
    if (isNaN(num)) {
        return '0';
    }
    const flag = num < 0 ? '-' : ''; // 负数标志
    num = Math.abs(num);
    digit = (digit <= 3 && digit >= 0) ? Math.floor(digit) : 3;// 保留位数  0 - 3 //默认3位
    const powNum = 10 ** digit;

    // console.log(num, powNum)
    num = bcmul(num, powNum);
    // console.log(num, powNum)

    if (!cut) { // 舍弃
        num = Math.floor(num);// 去掉小数点后面的位数
    } else {
        num = Math.floor(Number(num.toFixed(0))); // 四舍五入 再取整
    }

    const numstr = '' + num / powNum;

    const l = numstr.split('.')[0].split('').reverse();
    let r = numstr.split('.')[1];
    if (r === undefined) {
        r = '';
    }
    r = (r + '000').substr(0, digit);
    let t = '';
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    return flag + t.split('').reverse().join('') + (r === '' ? '' : ('.' + r));
}

/**
 * formatMoneyZhCN，格式化为中文金额字符串
 */
export function formatMoneyZhCN(numIn: string|number) {
    const nums = Number(numIn) || 0;
    const y = Math.floor(nums / 1e8);
    const t = Math.floor((nums - y * 1e8) / 1e4);
    const fillNum = padZero(t, 4, true);
    return y + '亿' + fillNum.substr(fillNum.length - 4, 4) + '万';
}
