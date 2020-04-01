var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var example;
(function (example) {
    var CrossStorageSDK = /** @class */ (function () {
        function CrossStorageSDK() {
        }
        CrossStorageSDK.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this._installListener();
                            _this._installCrossStorageIframe();
                            _this._callbacks['ready'] = function () { return resolve(); };
                            _this._callbacks['unavailable'] = function () { return reject(); };
                        })];
                });
            });
        };
        /**
         * 安装cross-storage-iframe
         */
        CrossStorageSDK._installCrossStorageIframe = function () {
            var iframe = document.createElement('iframe');
            iframe.frameBorder = iframe.width = iframe.height = '0';
            iframe.name = 'cross-storage';
            iframe.src = this._storageSrc;
            document.body.appendChild(iframe);
        };
        /**
         * 安装窗口消息事件所需的侦听器
         * 兼容IE8及以上版本
         */
        CrossStorageSDK._installListener = function () {
            var listener = this._listener;
            if (window.addEventListener) {
                window.addEventListener('message', listener, false);
            }
            else {
                window['attachEvent']('onmessage', listener);
            }
        };
        /**
         * 处理窗口消息事件
         * @param message
         */
        CrossStorageSDK._listener = function (message) {
            var response;
            // 忽略其他源发送的消息
            if (message.origin !== CrossStorageSDK._storageOrign)
                return;
            if (message.data === 'unavailable') {
                CrossStorageSDK._callbacks['unavailable']();
                return;
            }
            if (message.data === 'ready') {
                if (!CrossStorageSDK._ready) {
                    CrossStorageSDK._ready = true;
                    CrossStorageSDK._callbacks['ready']();
                }
                return;
            }
            // 检查message.data是否为有效json
            try {
                response = JSON.parse(message.data);
            }
            catch (err) {
                return;
            }
            CrossStorageSDK._callbacks[response.id] && CrossStorageSDK._callbacks[response.id](response);
        };
        CrossStorageSDK.get = function (key) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var id = new Date().getTime();
                var request = {
                    id: id,
                    method: 'get',
                    params: {
                        key: key
                    }
                };
                _this._callbacks[id] = function (response) {
                    response.error ? reject(response.error) : resolve(response.result);
                };
                _this._sendRequest(request);
            });
        };
        CrossStorageSDK.set = function (key, value) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var id = new Date().getTime();
                var request = {
                    id: id,
                    method: 'set',
                    params: {
                        key: key,
                        value: value
                    }
                };
                _this._callbacks[id] = function (response) {
                    response.error ? reject(response.error) : resolve(response.result);
                };
                _this._sendRequest(request);
            });
        };
        CrossStorageSDK.del = function () {
            var _this = this;
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                var id = new Date().getTime();
                var request = {
                    id: id,
                    method: 'del',
                    params: {
                        keys: keys
                    }
                };
                _this._callbacks[id] = function (response) {
                    response.error ? reject(response.error) : resolve(response.result);
                };
                _this._sendRequest(request);
            });
        };
        CrossStorageSDK.getAllKeys = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var id = new Date().getTime();
                var request = {
                    id: id,
                    method: 'getAllKeys',
                    params: {}
                };
                _this._callbacks[id] = function (response) {
                    response.error ? reject(response.error) : resolve(response.result);
                };
                _this._sendRequest(request);
            });
        };
        CrossStorageSDK.clear = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var id = new Date().getTime();
                var request = {
                    id: id,
                    method: 'set',
                    params: {}
                };
                _this._callbacks[id] = function (response) {
                    response.error ? reject(response.error) : resolve(response.result);
                };
                _this._sendRequest(request);
            });
        };
        CrossStorageSDK._sendRequest = function (request) {
            window.frames[0].postMessage(JSON.stringify(request), this._storageOrign);
        };
        CrossStorageSDK._storageSrc = "https://www.example.com/cross-storage-iframe.html";
        CrossStorageSDK._storageOrign = "https://www.example.com";
        CrossStorageSDK._ready = false;
        CrossStorageSDK._callbacks = {};
        return CrossStorageSDK;
    }());
    // 导出
    example.sdk = CrossStorageSDK;
})(example || (example = {}));
