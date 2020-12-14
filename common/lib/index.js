"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var string = __importStar(require("./utils/string"));
exports.string = string;
var number = __importStar(require("./utils/number"));
exports.number = number;
var time = __importStar(require("./utils/time"));
exports.time = time;
var validate = __importStar(require("./utils/validate"));
exports.validate = validate;
var browser = __importStar(require("./utils/browser"));
exports.browser = browser;
var jsbridge = __importStar(require("./utils/jsbridge"));
exports.jsbridge = jsbridge;
var format = __importStar(require("./utils/format"));
exports.format = format;
//
var future = __importStar(require("./future"));
exports.future = future;
