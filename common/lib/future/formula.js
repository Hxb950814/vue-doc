"use strict";
/* 相关公式 */
Object.defineProperty(exports, "__esModule", { value: true });
/* MACD公式 */
function macd(s, l, m) {
    var emaShort = -1;
    var emaLong = -1;
    var dea = 0;
    return function (closePrice /* 上一个 */) {
        if (emaShort === -1) { // 初始化emaShort 和 emaLong
            emaShort = closePrice;
            emaLong = closePrice;
        }
        else {
            emaShort = emaShort * (1 - 2.0 / (s + 1)) + closePrice * 2.0 / (s + 1);
            emaLong = emaLong * (1 - 2.0 / (l + 1)) + closePrice * 2.0 / (l + 1);
        }
        var dif = emaShort - emaLong;
        dea = dea * (1 - 2.0 / (m + 1)) + dif * 2.0 / (m + 1);
        var bar = dif - dea;
        return [dif, dea, bar];
    };
}
exports.macd = macd;
