declare module crossStorage {
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
    class CrossStorageHub {
        private static _permissions;
        /**
         * 初始化
         * @param permissions
         */
        static init(permissions: PermissionInfo[]): void;
        /**
         * 安装窗口消息事件所需的侦听器
         * 兼容IE8及以上版本
         */
        private static _installListener;
        /**
         * 发送到窗口的所有请求的消息处理函数
         * 忽略任何来源与权限不匹配的消息
         * @param message
         */
        private static _listener;
        /**
         * 检测源是否合法, 方法是否符合预期
         * @param origin
         * @param method
         */
        private static _permitted;
        /**
         * 存数据
         * @param params
         */
        private static _set;
        /**
         * 取数据
         * @param params
         */
        private static _get;
        /**
         * 删除在parms.keys中找到的数组中指定的所有键
         * @param params
         */
        private static _del;
        /**
         * 清空localStorage
         * @param params
         */
        private static _clear;
        /**
         * 返回存储在localStorage中的所有键的数组。
         * @param params
         */
        private static _getAllKeys;
        /**
         * 取代数组的indexOf方法，兼容IE8
         * @param value
         * @param array
         */
        private static _inArray;
    }
    function init(permissions: PermissionInfo[]): void;
}
