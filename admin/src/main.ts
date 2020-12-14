import Vue, { DirectiveOptions } from 'vue';
import Viewer from 'v-viewer';

import ElementUI from 'element-ui';
import request from '@/utils/request';

import {showLoading, closeLoading, showToast, showMessageBox, showMessagePanel} from '@/utils/ui';
import {directives, filters} from '@/utils/directive&filter';
import '@/assets/styles/index.scss';

import App from '@/App.vue';

import 'viewerjs/dist/viewer.css';

import store from '@/store';
import router from '@/router';
import './utils/global.ts';
Vue.use(Viewer);
/* 排除CDN的引入 */
if (!window.ELEMENT) {
    // @ts-ignore
    Vue.use(ElementUI);
}

Vue.config.productionTip = false;

Vue.prototype.$get = request.get;
Vue.prototype.$getAsync = request.getAsync;
Vue.prototype.$post = request.post;
Vue.prototype.$postAsync = request.postAsync;

Vue.prototype.$showLoading = showLoading; // loading
Vue.prototype.$closeLoading = closeLoading; // 关闭loading
Vue.prototype.$showToast = showToast; // toast
Vue.prototype.$showMessageBox = showMessageBox; // msgbox
Vue.prototype.$showMessagePanel = showMessagePanel; // msgpanel

// 注册全局指令
Object.keys(directives).forEach((key: string) => {
    Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key]);
});

// 注册全局过滤器
Object.keys(filters).forEach((key: string) => {
    Vue.filter(key, (filters as { [key: string ]: Function })[key]);
});

// eslint-disable-next-line no-undef
// console.log('%cversion: ' + BUILD_VERSION, 'background-color:rgb(9,122,187);border-radius:3px;color:#fff;padding:2px 5px');

new Vue({
    router,
    store,
    render: (h: any) => h(App)
}).$mount('#app');
