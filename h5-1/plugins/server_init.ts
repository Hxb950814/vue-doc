import Vue, { DirectiveOptions } from 'vue';
import Vant, { Toast, Dialog } from 'vant';
import {directives, filters} from '@/utils/directive&filter';
import TkNavBar from '@/components/TkNavBar.vue';

Vue.use(Vant);

/* 注入一些东西 */
Vue.mixin({
    components: {
        TkNavBar
    }
});

/* 注入一些函数 */
Vue.prototype.$showToast = (message: string, duration = 3000) => {
    Toast({
        message,
        duration
    });
};

Vue.prototype.$showLoading = (message?: string) => {
    // eslint-disabled-next-line
    Toast.loading({
        duration: 0, // 持续展示 toast
        message: message || '加载中...',
        forbidClick: true
    });
};

Vue.prototype.$closeLoading = () => {
    Toast.clear();
};

Vue.prototype.$showMessageBox = (title: string, message: string, cancelButtonText?: string, sureButtonText?: string) => {
    const showSureButton = sureButtonText !== '' && sureButtonText !== undefined;
    return Dialog.alert({
        className: 'my-dialog',
        title: title || '标题',
        message: message || '内容',
        cancelButtonText: cancelButtonText || (showSureButton ? '取消' : '确定'),
        cancelButtonColor: '#666',
        confirmButtonColor: '#ff4438',
        showCancelButton: true,
        showConfirmButton: showSureButton,
        confirmButtonText: sureButtonText || '确定'
    });
};

/* 注入指令 */
Object.keys(directives).forEach((key: string) => {
    Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key]);
});

// 注册全局过滤器
Object.keys(filters).forEach((key: string) => {
    Vue.filter(key, (filters as { [key: string ]: Function })[key]);
});
