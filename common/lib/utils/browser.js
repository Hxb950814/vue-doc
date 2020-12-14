"use strict";
/* 浏览器方面 */
Object.defineProperty(exports, "__esModule", { value: true });
/* 是否是微信 */
function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    return !!ua.match(/micromessenger/i);
}
exports.isWeixin = isWeixin;
/* 是否是安卓 */
function isAndroid() {
    var ua = window.navigator.userAgent.toLowerCase();
    // eslint-disable-next-line no-useless-escape
    return !!ua.match(/(android);?[\s\/]+([\d.]+)?/);
}
exports.isAndroid = isAndroid;
/* 是否是IOS */
function isIOS() {
    var ua = window.navigator.userAgent.toLowerCase();
    var ipad = !!ua.match(/(ipad).*os\s([\d_]+)/);
    var iphone = !!ua.match(/(iphone\sos)\s([\d_]+)/);
    return ipad || iphone;
}
exports.isIOS = isIOS;
/* 是否是桌面浏览器 */
function isDesktop() {
    return navigator.platform === 'Win32' ||
        navigator.platform === 'X11' ||
        navigator.platform === 'Mac' ||
        navigator.platform === 'Linux';
}
exports.isDesktop = isDesktop;
/* 是否是IE(Edge12-17)浏览器 */
function isIE() {
    return 'ActiveXObject' in window;
}
exports.isIE = isIE;
function ieVersion() {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isIE = userAgent.includes('compatible') && userAgent.includes('MSIE'); // 判断是否IE<11浏览器
    var isEdge = userAgent.includes('Edge') && !isIE; // 判断是否IE的Edge浏览器
    var isIE11 = userAgent.includes('Trident') && userAgent.includes('rv:11.0');
    if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(userAgent);
        var fIEVersion = parseInt(RegExp.$1);
        if (fIEVersion === 7) {
            return 7;
        }
        else if (fIEVersion === 8) {
            return 8;
        }
        else if (fIEVersion === 9) {
            return 9;
        }
        else if (fIEVersion === 10) {
            return 10;
        }
        else {
            return 6; // IE版本<=7
        }
    }
    else if (isEdge) {
        return 'edge'; // edge
    }
    else if (isIE11) {
        return 11; // IE11
    }
    else {
        return -1; // 不是ie浏览器
    }
}
exports.ieVersion = ieVersion;
