"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* jsbridge */
/* 导出对象 */
var JsBridge = /** @class */ (function () {
    function JsBridge() {
        var _this = this;
        this.readyCallbackFunc = [];
        if (typeof window === 'undefined') {
            throw new TypeError('请在windows环境下执行');
        }
        // 注入, 会被平台直接调用
        window.tkJsBridge = window.tkJsBridge || {}; // 链接桥 主要是给js调用native代码
        window.tkJsBridgeLoaded = window.tkJsBridgeLoaded || false; // 链接桥是否已经准备好, 这是在native端被直接调用的
        window.tkJsBridgeCallback = window.tkJsBridgeCallback || {}; // 主要是给native调用的js代码
        if (window.tkJsBridgeLoaded) {
            /* todo */
        }
        else {
            /* 回调函数 */
            window.tkJsBridgeReady = function () {
                window.tkJsBridgeLoaded = true;
                _this.readyCallbackFunc.forEach(function (cb) { return cb(); }); // 执行
                _this.readyCallbackFunc = []; // 清空
            };
        }
    }
    JsBridge.getInstance = function () {
        if (!JsBridge.instance) {
            JsBridge.instance = new JsBridge();
        }
        return JsBridge.instance;
    };
    JsBridge.prototype.onReady = function (cb) {
        if (typeof cb !== 'function') {
            throw new TypeError('JsBridge: onReady: 函数需要接受一个函数作为参数');
        }
        /* 如果jsbridge成功了， 则可以直接调用 */
        if (!window.tkJsBridgeLoaded) {
            /* 放进函数里面保存起来，等事件触发了一次性调用 */
            this.readyCallbackFunc.push(cb);
        }
        else {
            cb();
        }
    };
    /* 调用一个native函数 */
    JsBridge.prototype.invoke = function (funName, paramText, cb) {
        if (!window.tkJsBridgeLoaded) {
            throw new TypeError('JsBridge： invoke，未初始化完成，调用失败');
        }
        if (!funName) {
            throw new TypeError('JsBridge： invoke， 函数名不能为空');
        }
        // @ts-ignore
        if (typeof window.tkJsBridge[funName] === 'function') {
            var callbackFunc_1 = '_cb' + Date.now() + ((Math.random() * 1000) | 0);
            // 注册一个函数到jsBridgeCallback,方便给就native端回调
            // @ts-ignore
            window.tkJsBridgeCallback[callbackFunc_1] = function (errCode, data) {
                if (typeof cb === 'function') {
                    cb(errCode, data);
                }
                // @ts-ignore
                delete window.tkJsBridgeCallback[callbackFunc_1]; // 执行完就删除
            };
            // @ts-ignore
            window.tkJsBridge[funName](String(paramText), 'window.tkJsBridgeCallback.' + callbackFunc_1);
        }
        else {
            throw new TypeError('JsBridge： invoke， native未定义' + funName + '函数');
        }
    };
    /* 注册一个native函数给java调用 */
    /* 请不要使用_cb开头的函数名 */
    JsBridge.prototype.register = function (funName, cb) {
        // @ts-ignore
        window.tkJsBridgeCallback[funName] = function () { return cb(); };
    };
    return JsBridge;
}());
exports.default = JsBridge;
;
