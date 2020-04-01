declare module example {
    class CrossStorageSDK {
        private static readonly _storageSrc;
        private static readonly _storageOrign;
        private static _ready;
        private static _callbacks;
        static init(): Promise<void>;
        /**
         * 安装cross-storage-iframe
         */
        private static _installCrossStorageIframe;
        /**
         * 安装窗口消息事件所需的侦听器
         * 兼容IE8及以上版本
         */
        private static _installListener;
        /**
         * 处理窗口消息事件
         * @param message
         */
        private static _listener;
        static get(key: string): Promise<string>;
        static set(key: string, value: string): Promise<string>;
        static del(...keys: string[]): Promise<string>;
        static getAllKeys(): Promise<string>;
        static clear(): Promise<string>;
        private static _sendRequest;
    }
    let sdk: typeof CrossStorageSDK;
}
