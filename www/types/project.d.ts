import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { Toast } from 'vant';

/* 定义在原型链上面的方法 */
/* 声明 post 和 get方法 */
declare module 'vue/types/vue' {
    interface Vue {
        $showLoading: (message?: string) => {}; // 显示加载层
        $closeLoading: (immediate?: boolean) => void; // 关闭加载层
        $showToast: (message: string, duration?: number) => void; // 显示tips
        $showMessageBox: (title: string, message?: string, cancelButtonText?: string, sureButtonText?: string) => Promise<undefined>; // 显示messagebox

        // 表格数据
        $route: Route;
    }
}

declare global {
    interface Window {
        ELEMENT: {},
        VueRouter: {};
        onNuxtReady: (cb: Function) => (store: any) => void,
        wx: {
            // loading: (str: string) => void
            config: (data: object) => void,
            ready: (cb: () => void) => void,
            checkJsApi: (data: object) => void,
            onMenuShareTimeline: (data: object) => void,
            onMenuShareAppMessage: (data: object) => void,
            onMenuShareQQ: (data: object) => void,
            onMenuShareQZone: (data: object) => void
        },
        WeixinJSBridge: {
            invoke: (str: string, conf: Object, resultFunc: (result: any) => void)=>void
        },
        eruda: {
            init: () => void
        }
    }

    interface Toast {
        loading: (str: string) => void
    }

    const CONST_CQUOTE_WS_PATH: string; // ws的路径， 由nuxt.config.js定义
}
