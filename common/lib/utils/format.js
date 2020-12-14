"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var time_1 = require("./time");
exports.formatTime = time_1.formatTime;
function formatPhone(phone, formatType) {
    if (formatType === void 0) { formatType = 1; }
    return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
}
exports.formatPhone = formatPhone;
