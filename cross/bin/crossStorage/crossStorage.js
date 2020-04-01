var crossStorage;
(function (crossStorage) {
    var CrossStorageHub = /** @class */ (function () {
        function CrossStorageHub() {
        }
        /**
         * 初始化
         * @param permissions
         */
        CrossStorageHub.init = function (permissions) {
            var available = true;
            // 判断localStorage是否可用
            if (!window.localStorage)
                available = false;
            if (!available) {
                window.parent.postMessage('unavailable', '*');
                return;
            }
            this._permissions = permissions || [];
            this._installListener();
            window.parent.postMessage('ready', '*');
        };
        /**
         * 安装窗口消息事件所需的侦听器
         * 兼容IE8及以上版本
         */
        CrossStorageHub._installListener = function () {
            var listener = this._listener;
            if (window.addEventListener) {
                window.addEventListener('message', listener, false);
            }
            else {
                window['attachEvent']('onmessage', listener);
            }
        };
        /**
         * 发送到窗口的所有请求的消息处理函数
         * 忽略任何来源与权限不匹配的消息
         * @param message
         */
        CrossStorageHub._listener = function (message) {
            var origin, request, method, error, result, response;
            origin = message.origin;
            // 检查message.data是否为有效json
            try {
                request = JSON.parse(message.data);
            }
            catch (err) {
                return;
            }
            // 校验request.method数据类型
            if (!request || typeof request.method !== 'string') {
                return;
            }
            method = request.method;
            if (!method) {
                return;
            }
            else if (!CrossStorageHub._permitted(origin, method)) {
                error = 'Invalid permissions for ' + method;
            }
            else {
                try {
                    result = CrossStorageHub['_' + method](request.params);
                }
                catch (err) {
                    error = err.message;
                }
            }
            response = JSON.stringify({
                id: request.id,
                error: error,
                result: result
            });
            window.parent.postMessage(response, origin);
        };
        /**
         * 检测源是否合法, 方法是否符合预期
         * @param origin
         * @param method
         */
        CrossStorageHub._permitted = function (origin, method) {
            var available, match;
            available = ['get', 'set', 'del', 'clear', 'getKeys'];
            if (!this._inArray(method, available)) {
                return false;
            }
            for (var _i = 0, _a = this._permissions; _i < _a.length; _i++) {
                var entry = _a[_i];
                if (!(entry.origin instanceof RegExp) || !(entry.allow instanceof Array)) {
                    continue;
                }
                match = entry.origin.test(origin);
                if (match && this._inArray(method, entry.allow)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 存数据
         * @param params
         */
        CrossStorageHub._set = function (params) {
            window.localStorage.setItem(params.key, params.value);
        };
        /**
         * 取数据
         * @param params
         */
        CrossStorageHub._get = function (params) {
            var result;
            var storage = window.localStorage;
            try {
                result = storage.getItem(params.key);
            }
            catch (e) {
                result = null;
            }
            return result;
        };
        /**
         * 删除在parms.keys中找到的数组中指定的所有键
         * @param params
         */
        CrossStorageHub._del = function (params) {
            var storage = window.localStorage;
            for (var _i = 0, _a = params.keys; _i < _a.length; _i++) {
                var key = _a[_i];
                storage.removeItem(key);
            }
        };
        /**
         * 清空localStorage
         * @param params
         */
        CrossStorageHub._clear = function (params) {
            window.localStorage.clear();
        };
        /**
         * 返回存储在localStorage中的所有键的数组。
         * @param params
         */
        CrossStorageHub._getAllKeys = function (params) {
            var keys = [];
            var storage = window.localStorage;
            for (var i = 0, len = storage.length; i < len; i++) {
                keys.push(storage.key(i));
            }
            return keys;
        };
        /**
         * 取代数组的indexOf方法，兼容IE8
         * @param value
         * @param array
         */
        CrossStorageHub._inArray = function (value, array) {
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var val = array_1[_i];
                if (value === val)
                    return true;
            }
            return false;
        };
        return CrossStorageHub;
    }());
    crossStorage.CrossStorageHub = CrossStorageHub;
    function init(permissions) {
        CrossStorageHub.init(permissions);
    }
    crossStorage.init = init;
})(crossStorage || (crossStorage = {}));
