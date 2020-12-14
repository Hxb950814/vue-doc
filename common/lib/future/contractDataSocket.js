"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* 从数据源获取数据2 */
var pako_1 = __importDefault(require("pako"));
var await_to_js_1 = __importDefault(require("await-to-js"));
var operate_1 = require("./operate");
var ContractDataSocket = /** @class */ (function () {
    function ContractDataSocket(listener) {
        this.uid = 0;
        this.ws = null;
        this.messageListeners = [];
        if (!('WebSocket' in window)) {
            console.error('您的浏览器不支持websocket');
        }
        if (listener) {
            this.addListener(listener);
        }
        this.uid = ++ContractDataSocket.COUNT;
    }
    /* 开始 */
    ContractDataSocket.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var path;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = 'cquote.tanxingk.com/api/ws';
                        return [4 /*yield*/, await_to_js_1.default(new Promise(function (resolve, reject) {
                                _this.ws = new WebSocket(location.protocol === 'https:' ? 'wss://' + path : 'ws://' + path); // 这里是走代理
                                _this.ws.onopen = function (ev) {
                                    resolve('success');
                                };
                                _this.ws.onmessage = function (ev) {
                                    var _a;
                                    // 只有状态为open才能处理数据
                                    if (((_a = _this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
                                        var reader_1 = new FileReader();
                                        // const dateNow = +new Date();
                                        reader_1.onload = function (event) {
                                            _this.messageListeners.forEach(function (fn) {
                                                var targetData = {};
                                                var err_code = 0;
                                                try {
                                                    var output = pako_1.default.ungzip(reader_1.result);
                                                    var strData = String.fromCharCode.apply(null, new Uint16Array(output));
                                                    var resultStr = decodeURIComponent(strData);
                                                    var respData = JSON.parse(resultStr);
                                                    // console.log('解析', respData);
                                                    if (respData.data) {
                                                        targetData = respData.data;
                                                        if (Array.isArray(targetData)) {
                                                            targetData = targetData.map(function (item) { return operate_1.getSituationData(item); });
                                                        }
                                                        else {
                                                            targetData = operate_1.getSituationData(targetData);
                                                        }
                                                    }
                                                    else {
                                                        targetData = {};
                                                    }
                                                    err_code = +respData.err_code || 0;
                                                }
                                                catch (e) {
                                                    console.log('ws数据解析错误', e);
                                                }
                                                //  console.log('获得数据', targetData);
                                                // console.log('获得code', err_code, targetData);
                                                fn(err_code, targetData);
                                            });
                                        };
                                        reader_1.readAsBinaryString(ev.data);
                                    }
                                };
                                _this.ws.onerror = function (ev) {
                                    console.log(ev);
                                    reject(new Error('connect error'));
                                };
                            }))];
                    case 1: // todo : path
                    // eslint-disable-next-line no-undef
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContractDataSocket.prototype.getUniqueId = function () {
        return this.uid;
    };
    /* 发送消息 */
    ContractDataSocket.prototype.sendMessage = function (data) {
        var _a;
        if (this.ws && ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
            var dataS = JSON.stringify(data);
            console.log('发送ws数据', dataS);
            this.ws.send(dataS);
        }
        else {
            // todo
        }
    };
    /* 订阅合约消息 */
    ContractDataSocket.prototype.sendContractTickMessage = function (code) {
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'sub_tick',
            data: {
                code: code
            }
        });
    };
    /* 取消订阅合约消息 */
    ContractDataSocket.prototype.sendCancelContractTickMessage = function (code) {
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'unsub_tick',
            data: {
                code: code
            }
        });
    };
    /* 订阅合约组的消息 */
    ContractDataSocket.prototype.sendContractTickGroupMessage = function (codes) {
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'sub_group_tick',
            data: {
                codes: codes
            }
        });
    };
    /* 取消订阅合约组消息 */
    ContractDataSocket.prototype.sendCancelContractTickGroupMessage = function (codes) {
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'unsub_group_tick',
            data: {
                codes: codes
            }
        });
    };
    ContractDataSocket.prototype.addListener = function (fn) {
        if (typeof fn !== 'function') {
            return;
        }
        this.messageListeners.push(fn);
    };
    ContractDataSocket.prototype.removeListener = function (fn) {
        if (typeof fn !== 'function') {
            return;
        }
        var findIndex = this.messageListeners.findIndex(function (item) {
            return item === fn;
        });
        if (findIndex >= 0) {
            this.messageListeners.splice(findIndex, 1);
        }
    };
    ContractDataSocket.prototype.close = function () {
        var _this = this;
        if (this.ws) {
            this.ws.send('close');
            window.setTimeout(function () {
                _this.ws && _this.ws.close();
                _this.ws = null;
            }, 0);
        }
    };
    ContractDataSocket.prototype.destroy = function () {
        if (this.ws) {
            this.close();
            this.ws = null;
        }
        this.messageListeners.length = 0;
    };
    ContractDataSocket.COUNT = 0;
    return ContractDataSocket;
}());
exports.default = ContractDataSocket;
