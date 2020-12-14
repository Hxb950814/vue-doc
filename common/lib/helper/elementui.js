"use strict";
/* elemnt ui 扩展工具 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* 2或4个时间联动 */
var dayjs_1 = __importDefault(require("dayjs"));
function yesterdayStart(val) {
    return dayjs_1.default(val).subtract(1, 'day').hour(0).minute(0).second(0).valueOf(); // 昨天的的00:00:00
}
function yesterdayEnd(val) {
    return dayjs_1.default(val).subtract(1, 'day').hour(23).minute(59).second(59).valueOf(); // 昨天的的23:59:59
}
function todayStart(val) {
    return dayjs_1.default(val).hour(0).minute(0).second(0).valueOf(); // 今天的00:00:00
}
function todayEnd(val) {
    return dayjs_1.default(val).hour(23).minute(59).second(59).valueOf(); // 今天的23:59:59
}
function makeDatetimePickerRelationLimit(dataObj, keysArr, options) {
    if (typeof dataObj !== 'object') {
        throw new TypeError('时间联动校验函数第一个参数必须是一个对象');
    }
    if (!Array.isArray(keysArr)) {
        throw new TypeError('时间联动校验函数第二个参数必须是字符串数组');
    }
    if (!(keysArr.length === 4 || keysArr.length === 2)) {
        throw new Error('时间联动校验函数必须是长度为2或4的字符串数组');
    }
    for (var i in keysArr) {
        if (keysArr.hasOwnProperty(i)) {
            if (dataObj[keysArr[i]] === undefined) {
                throw new Error('时间联动校验函数第2个参数的成员必须有被声明为非undefined');
            }
        }
    }
    var newOptions = Object.assign({
        overlap: true // 时间是否允许重叠
    }, options || {});
    var key1 = keysArr[0];
    var key2 = keysArr[1];
    var key3 = keysArr[2];
    var key4 = keysArr[3];
    if (keysArr.length === 2) {
        return [
            function (time) {
                var ret = false;
                var timeStamp = time.getTime(); // 当前时间戳
                var timeVal = dataObj[key2]; // 另外一个时间
                if (timeVal) {
                    ret = ret || timeStamp > (newOptions.overlap ? todayStart(timeVal) : yesterdayStart(timeVal));
                }
                return ret;
            },
            function (time) {
                var ret = false;
                var timeStamp = time.getTime();
                var timeVal = dataObj[key1];
                if (timeVal) {
                    ret = ret || timeStamp < (newOptions.overlap ? yesterdayEnd(timeVal) : todayEnd(timeVal));
                }
                return ret;
            }
        ];
    }
    return [
        function (time) {
            var ret = false;
            var timeStamp = time.getTime();
            if (dataObj[key4]) {
                ret = ret || timeStamp > todayStart(dataObj[key4]);
            }
            if (dataObj[key3]) {
                ret = ret || timeStamp > todayStart(dataObj[key3]);
            }
            if (dataObj[key2]) {
                ret = ret || timeStamp > todayStart(dataObj[key2]);
            }
            return ret;
        },
        function (time) {
            var ret = false;
            var timeStamp = time.getTime();
            if (dataObj[key4]) {
                ret = ret || timeStamp > todayStart(dataObj[key4]);
            }
            if (dataObj[key3]) {
                ret = ret || timeStamp > todayStart(dataObj[key3]);
            }
            if (dataObj[key1]) {
                ret = ret || timeStamp < todayStart(dataObj[key1]);
            }
            return ret;
        },
        function (time) {
            var ret = false;
            var timeStamp = time.getTime();
            if (dataObj[key1]) {
                ret = ret || timeStamp < todayStart(dataObj[key1]);
            }
            if (dataObj[key2]) {
                ret = ret || timeStamp < todayStart(dataObj[key2]);
            }
            if (dataObj[key4]) {
                ret = ret || timeStamp > todayStart(dataObj[key4]);
            }
            return ret;
        },
        function (time) {
            var ret = false;
            var timeStamp = time.getTime();
            if (dataObj[key1]) {
                ret = ret || timeStamp < todayStart(dataObj[key1]);
            }
            if (dataObj[key2]) {
                ret = ret || timeStamp < todayStart(dataObj[key2]);
            }
            if (dataObj[key3]) {
                return time.getTime() < todayStart(dataObj[key3]);
            }
            return ret;
        }
    ];
}
exports.makeDatetimePickerRelationLimit = makeDatetimePickerRelationLimit;
