"use strict";
/* 校验函数 */
Object.defineProperty(exports, "__esModule", { value: true });
/* 是否是整数数字（前面可以包含0） */
function isInteger(value) {
    // eslint-disable-next-line
    return /^[0-9]+$/.test(String(value));
}
exports.isInteger = isInteger;
function isMobile(value) {
    // eslint-disable-next-line
    return /^[1][2,3,4,5,6,7,8,9,0][0-9]{9}$/.test(value);
}
exports.isMobile = isMobile;
/* 是否是身份证号 */
function isIdNumber(value) {
    // eslint-disable-next-line
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}
exports.isIdNumber = isIdNumber;
/* 是否是邮箱 */
function isEmail(value) {
    // eslint-disable-next-line
    return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value);
}
exports.isEmail = isEmail;
/* 是否是URL */
function isURL(value) {
    // eslint-disable-next-line
    return /^http(s)?:\/\//.test(value);
}
exports.isURL = isURL;
