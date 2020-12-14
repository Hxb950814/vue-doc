"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../utils/string");
var type_1 = require("./type");
/* 生成数据结构体 */
function getSituationData(data, keyArr) {
    var _a;
    var _b;
    if (!data) {
        return {};
    }
    if (!keyArr) {
        keyArr = Object.keys(type_1.EnumContractDataKey);
    }
    var newData = (_a = {},
        _a[type_1.EnumContractDataKey.code] = data.Code,
        _a);
    for (var _i = 0, keyArr_1 = keyArr; _i < keyArr_1.length; _i++) {
        var key = keyArr_1[_i];
        var val = (_b = data[key]) !== null && _b !== void 0 ? _b : data[string_1.firstLetterUppercase(key)];
        switch (key) {
            case type_1.EnumContractDataKey.changeRate:
                val = ((data.ChangeValue / data.PreSettle) * 100);
                if (isNaN(val)) {
                    val = '';
                }
                else {
                    val = parseFloat(val.toFixed(2));
                }
                break;
        }
        newData[key] = val;
    }
    return newData;
}
exports.getSituationData = getSituationData;
/* 生成数据结构体，按照顺序 */
function pickSituationDataByOrder(data, keyArr) {
    var _a;
    if (!data) {
        return {};
    }
    var newData = (_a = {},
        _a[type_1.EnumContractDataKey.code] = data.code,
        _a);
    for (var i = 0; i < keyArr.length; ++i) {
        newData['value' + (i + 1)] = data[keyArr[i]];
    }
    return newData;
}
exports.pickSituationDataByOrder = pickSituationDataByOrder;
