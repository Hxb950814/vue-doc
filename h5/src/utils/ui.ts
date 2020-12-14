import Vue from 'vue';
import {merge} from 'lodash';
import { Toast } from 'vant';
Vue.use(Toast);
let loadingInstance: any = null;
let loadingStartTime = 0;
let loadingTimeoutHandle = -1;

/* 显示加载层 */
export function showLoading(message?: string, duration?: number): number {
    if (loadingInstance) {
        return -1;
    }
    loadingInstance = Toast.loading({
        message: message ? message : '加载中...',
        forbidClick: true,
        duration: duration ? duration : 0 // 0 是一直展示
    });
    loadingStartTime = Date.now();
    return 0;
}

/* 关闭加载层 */
export function closeLoading(immediate: boolean = false /*是否马上关闭*/) {
    const delayTime = 200; // 延迟的关闭时间
    if (loadingInstance) {
        let diff = Date.now() - loadingStartTime - delayTime;
        if (immediate || diff >= 0) {
            if (loadingTimeoutHandle >= 0) {
                window.clearTimeout(loadingTimeoutHandle);
                loadingTimeoutHandle = -1;
            }
            Toast.clear();
            loadingInstance = null;
        } else {
            loadingTimeoutHandle = window.setTimeout(() => {
                Toast.clear();
                loadingInstance = null;
                loadingTimeoutHandle = -1;
            }, delayTime - diff);
        }
    }
}

/* 显示Tips层 */
export function showToast(message: string, delay: number = 3000) {
    Toast(message, {
        duration: delay
    });
}

/* 显示确认框 */
export function showMessageBox(title: string, boxTitle = '提示', options: any) {
    let newOptions = merge({
        customClass: 'myui-messagebox',
        cancelButtonClass: 'cancel-btn',
        confirmButtonClass: 'confirm-btn',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }, options);
    return new Promise((resolve, reject) => {
        Vue.prototype.$confirm(title, boxTitle, newOptions).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
}

/* 显示确认框 */
export function showMessagePanel(content: string, boxTitle = '提示', options: any) {
    let flagShow = true;
    let handle = -1;
    let newOptions = merge({
        message: content,
        title: boxTitle,
        delayTime: 3000,
        customClass: 'myui-messagepanel',
        showConfirmButton: false,
        showCancelButton: false,
        closeOnClickModal: false, // 不可以点击遮罩层关闭
        beforeClose: (action: any, instance: any, done: any) => {
            // 关闭了
            // console.log('被关闭');
            if(handle >= 0){
                clearTimeout(handle);
                handle = -1;
            }
            flagShow = false;
            done();
        }
    }, options);
    flagShow = true;
    Vue.prototype.$msgbox(newOptions);
    handle = window.setTimeout(() => {
        if(flagShow){
            // console.log('被关闭被清除');
            Vue.prototype.$msgbox.close();
            flagShow = false;
        }
        handle = -1;
    },newOptions.delayTime);
    return 0;
}
