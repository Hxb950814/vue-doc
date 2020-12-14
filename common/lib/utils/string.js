"use strict";
/* string 类的操作 */
Object.defineProperty(exports, "__esModule", { value: true });
/* 首字母大写 */
function firstLetterUppercase(str) {
    if (!str) {
        return str + '';
    }
    return str[0].toUpperCase() + str.slice(1);
}
exports.firstLetterUppercase = firstLetterUppercase;
/* 首字母小写 */
function firstLetterLowercase(str) {
    if (!str) {
        return str + '';
    }
    return str[0].toLowerCase() + str.slice(1);
}
exports.firstLetterLowercase = firstLetterLowercase;
/* 字符串转驼峰命名 */
/*
*  输入 add-bbb-ccc
*  输出 aaaBbbCcc
* */
function camelCase(strIn) {
    var str = String(strIn !== null && strIn !== void 0 ? strIn : '');
    var reg = /-(\w)/g; // 子项()表示子项
    return (str[0].toLowerCase() + str.slice(1)).replace(reg, function ($0, $1) {
        return $1.toUpperCase();
    });
}
exports.camelCase = camelCase;
