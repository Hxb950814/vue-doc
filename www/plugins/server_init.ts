import Vue, { DirectiveOptions } from 'vue';
// import {
//     Carousel,
//     CarouselItem
// } from 'element-ui';
import ElementUI from 'element-ui';
import { directives, filters } from '@/utils/directive&filter';

import { showToast, showLoading, closeLoading } from '@/utils/ui';

// if (!window.ELEMENT) {
Vue.use(ElementUI);
// }

/* 注入一些东西 */
// Vue.mixin({
//     components: {
//         TkHeader,
//         TkFooter
//     }
// });

/* 注入一些函数 */
Vue.prototype.$showLoading = showLoading; // loading
Vue.prototype.$closeLoading = closeLoading; // 关闭loading
Vue.prototype.$showToast = showToast; // toast
// Vue.prototype.$showMessageBox = showMessageBox; // msgbox
// Vue.prototype.$showMessagePanel = showMessagePanel; // msgpanel

/* 注入指令 */
Object.keys(directives).forEach((key: string) => {
    Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key]);
});

// 注册全局过滤器
Object.keys(filters).forEach((key: string) => {
    Vue.filter(key, (filters as { [key: string ]: Function })[key]);
});
