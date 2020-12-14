/* 相关公式 */

/* MACD公式 */
export function macd(s: number, l: number, m: number) {
    let emaShort = -1;
    let emaLong = -1;
    let dea = 0;

    return function (closePrice: number /* 上一个 */) {
        if (emaShort === -1) { // 初始化emaShort 和 emaLong
            emaShort = closePrice;
            emaLong = closePrice;
        } else {
            emaShort = emaShort * (1 - 2.0 / (s + 1)) + closePrice * 2.0 / (s + 1);
            emaLong = emaLong * (1 - 2.0 / (l + 1)) + closePrice * 2.0 / (l + 1);
        }
        const dif = emaShort - emaLong;
        dea = dea * (1 - 2.0 / (m + 1)) + dif * 2.0 / (m + 1);
        const bar = dif - dea;
        return [dif, dea, bar];
    };
}
