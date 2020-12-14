"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* 时间操作 */
function formatTime(time, fmt) {
    var timeIn = new Date(time);
    var o = {
        'M+': timeIn.getMonth() + 1,
        'd+': timeIn.getDate(),
        'h+': timeIn.getHours(),
        'm+': timeIn.getMinutes(),
        's+': timeIn.getSeconds(),
        'q+': Math.floor((timeIn.getMonth() + 3) / 3),
        S: timeIn.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (timeIn.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}
exports.formatTime = formatTime;
/*
    获得今天的某个时间
    h：时
    m：分
    s：秒
* */
function getTodayTimeStamp(h, m, s) {
    var now = new Date();
    return +new Date(now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + h + ":" + m + ":" + s);
}
exports.getTodayTimeStamp = getTodayTimeStamp;
