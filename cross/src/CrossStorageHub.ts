

module crossStorage {

    interface PermissionInfo {
        /**
         * 允许的源
         * @example  /\.example\.(?:com|net|cn)(?:\:\d+)?$/
         */
        origin: RegExp;
        /**
         * 允许的请求方法
         */
        allow: string[];
    }

    interface ParamsInfo {
        /**
         * 键
         */
        key: string;
        /**
         * set值
         */
        value: string;
        /**
         * 批量del
         */
        keys: string[];
    }

    interface RequestInfo {
        /**
         * 请求唯一标识
         */
        id: number;
        /**
         * 请求方法
         */
        method: 'get' | 'set' | 'del' | 'clear' | 'getAllKeys';
        /**
         * 请求参数
         */
        params: ParamsInfo;
    }

    export class CrossStorageHub {

        private static _permissions: PermissionInfo[];

        /**
         * 初始化
         * @param permissions
         */
        public static init(permissions: PermissionInfo[]): void {
            let available = true;

            // 判断localStorage是否可用
            if (!window.localStorage) available = false;

            if (!available) {
                window.parent.postMessage('unavailable', '*');
                return;
            }

            this._permissions = permissions || [];
            this._installListener();
            window.parent.postMessage('ready', '*');
        }

        /**
         * 安装窗口消息事件所需的侦听器
         * 兼容IE8及以上版本
         */
        private static _installListener(): void {
            const listener = this._listener;
            if (window.addEventListener) {
                window.addEventListener('message', listener, false);
            } else {
                window['attachEvent']('onmessage', listener);
            }
        }

        /**
         * 发送到窗口的所有请求的消息处理函数
         * 忽略任何来源与权限不匹配的消息
         * @param message
         */
        private static _listener(message: MessageEvent): void {

            let origin: string, request: RequestInfo, method: string, error: string, result: string[] | string, response: string;

            origin = message.origin;

            // 检查message.data是否为有效json
            try {
                request = JSON.parse(message.data);
            } catch (err) {
                return;
            }

            // 校验request.method数据类型
            if (!request || typeof request.method !== 'string') {
                return;
            }

            method = request.method;

            if (!method) {
                return;
            } else if (!CrossStorageHub._permitted(origin, method)) {
                error = 'Invalid permissions for ' + method;
            } else {
                try {
                    result = CrossStorageHub['_' + method](request.params);
                } catch (err) {
                    error = err.message;
                }
            }

            response = JSON.stringify({
                id: request.id,
                error: error,
                result: result
            })

            window.parent.postMessage(response, origin);
        }

        /**
         * 检测源是否合法, 方法是否符合预期
         * @param origin 
         * @param method 
         */
        private static _permitted(origin: string, method: string): boolean {
            let available: string[], match: boolean;

            available = ['get', 'set', 'del', 'clear', 'getKeys'];
            if (!this._inArray(method, available)) {
                return false;
            }

            for (let entry of this._permissions) {
                if (!(entry.origin instanceof RegExp) || !(entry.allow instanceof Array)) {
                    continue;
                }

                match = entry.origin.test(origin);
                if (match && this._inArray(method, entry.allow)) {
                    return true;
                }
            }

            return false;
        }

        /**
         * 存数据
         * @param params 
         */
        private static _set(params: ParamsInfo): void {
            window.localStorage.setItem(params.key, params.value);
        }

        /**
         * 取数据
         * @param params 
         */
        private static _get(params: ParamsInfo): string {
            let result: string;
            const storage = window.localStorage

            try {
                result = storage.getItem(params.key);
            } catch (e) {
                result = null;
            }

            return result;
        }

        /**
         * 删除在parms.keys中找到的数组中指定的所有键
         * @param params 
         */
        private static _del(params: ParamsInfo): void {
            const storage = window.localStorage;
            for (let key of params.keys) {
                storage.removeItem(key);
            }
        }

        /**
         * 清空localStorage
         * @param params 
         */
        private static _clear(params: ParamsInfo): void {
            window.localStorage.clear();
        }

        /**
         * 返回存储在localStorage中的所有键的数组。
         * @param params 
         */
        private static _getAllKeys(params: ParamsInfo): string[] {
            let keys: string[] = [];
            const storage = window.localStorage;

            for (let i = 0, len = storage.length; i < len; i++) {
                keys.push(storage.key(i));
            }

            return keys;
        }

        /**
         * 取代数组的indexOf方法，兼容IE8
         * @param value 
         * @param array 
         */
        private static _inArray(value: string, array: string[]): boolean {
            for (let val of array) {
                if (value === val) return true;
            }

            return false;
        }

    }

    export function init(permissions: PermissionInfo[]) {
        CrossStorageHub.init(permissions);
    }

}
