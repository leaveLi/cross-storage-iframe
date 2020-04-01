
module example {
    interface ParamsInfo {
        /**
         * 键
         */
        key?: string;
        /**
         * set值
         */
        value?: string;
        /**
         * 批量del
         */
        keys?: string[];
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

    interface ResponseInfo {
        /**
         * 请求唯一标识
         */
        id: number;
        /**
         * 错误信息
         */
        error: string;
        /**
         * 请求结果
         */
        result: string;
    }

    class CrossStorageSDK {

        private static readonly _storageSrc: string = "https://www.example.com/cross-storage-iframe.html";
        private static readonly _storageOrign: string = "https://www.example.com";
        private static _ready: boolean = false;
        private static _callbacks: { [key: string]: (response?: ResponseInfo) => Promise<string> | void } = {};

        public static async init(): Promise<void> {
            return new Promise((resolve, reject) => {
                this._installListener();
                this._installCrossStorageIframe();
                this._callbacks['ready'] = () => resolve();
                this._callbacks['unavailable'] = () => reject();
            })
        }

        /**
         * 安装cross-storage-iframe
         */
        private static _installCrossStorageIframe(): void {
            let iframe = document.createElement('iframe');
            iframe.frameBorder = iframe.width = iframe.height = '0';
            iframe.name = 'cross-storage';
            iframe.src = this._storageSrc;
            document.body.appendChild(iframe);
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
         * 处理窗口消息事件
         * @param message 
         */
        private static _listener(message: MessageEvent): void {

            let response: ResponseInfo;

            // 忽略其他源发送的消息
            if (message.origin !== CrossStorageSDK._storageOrign) return;

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
            } catch (err) {
                return;
            }

            CrossStorageSDK._callbacks[response.id] && CrossStorageSDK._callbacks[response.id](response)
        }

        public static get(key: string): Promise<string> {
            return new Promise((resolve, reject) => {
                let id = new Date().getTime();
                let request: RequestInfo = {
                    id: id,
                    method: 'get',
                    params: {
                        key: key
                    }
                }

                this._callbacks[id] = (response: ResponseInfo) => {
                    response.error ? reject(response.error) : resolve(response.result);
                }

                this._sendRequest(request);
            });
        }

        public static set(key: string, value: string): Promise<string> {
            return new Promise((resolve, reject) => {
                let id = new Date().getTime();
                let request: RequestInfo = {
                    id: id,
                    method: 'set',
                    params: {
                        key: key,
                        value: value
                    }
                }

                this._callbacks[id] = (response: ResponseInfo) => {
                    response.error ? reject(response.error) : resolve(response.result);
                }

                this._sendRequest(request);
            });
        }

        public static del(...keys: string[]): Promise<string> {
            return new Promise((resolve, reject) => {
                let id = new Date().getTime();
                let request: RequestInfo = {
                    id: id,
                    method: 'del',
                    params: {
                        keys: keys
                    }
                }

                this._callbacks[id] = (response: ResponseInfo) => {
                    response.error ? reject(response.error) : resolve(response.result);
                }

                this._sendRequest(request);
            });
        }

        public static getAllKeys(): Promise<string> {
            return new Promise((resolve, reject) => {
                let id = new Date().getTime();
                let request: RequestInfo = {
                    id: id,
                    method: 'getAllKeys',
                    params: {}
                }

                this._callbacks[id] = (response: ResponseInfo) => {
                    response.error ? reject(response.error) : resolve(response.result);
                }

                this._sendRequest(request);
            });
        }

        public static clear(): Promise<string> {
            return new Promise((resolve, reject) => {
                let id = new Date().getTime();
                let request: RequestInfo = {
                    id: id,
                    method: 'set',
                    params: {}
                }

                this._callbacks[id] = (response: ResponseInfo) => {
                    response.error ? reject(response.error) : resolve(response.result);
                }

                this._sendRequest(request);
            });
        }

        private static _sendRequest(request: RequestInfo): void {
            window.frames[0].postMessage(JSON.stringify(request), this._storageOrign);
        }
    }

    // 导出
    export let sdk = CrossStorageSDK;
}
