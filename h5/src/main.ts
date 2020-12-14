import Vue, {DirectiveOptions, VNode} from 'vue';
import App from "./App.vue";
import router from "./router";
import 'lib-flexible'; // 移动端适配
import store from "./store";
import './other/vantComponents'; // 引入mintui组件
import "./assets/style/base.scss";
import '../src/mixins/commonMixins.ts'
import "./assets/style/common.scss";
// @ts-ignore
import VueAudio from 'vue-audio-better'
Vue.use(VueAudio)
// 点击复制
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// 弹框提示需注册全局 【避免ts规范】
import { Toast } from 'vant';
Vue.use(Toast);
import VueScroller from 'vue-scroller';
Vue.use(VueScroller)
import request from '@/utils/request';
import {showLoading, closeLoading, showToast, showMessageBox, showMessagePanel} from '@/utils/ui';

Vue.prototype.$get = request.get;
Vue.prototype.$getAsync = request.getAsync;
Vue.prototype.$post = request.post;
Vue.prototype.$postAsync = request.postAsync;

Vue.prototype.$showLoading = showLoading; // loading
Vue.prototype.$closeLoading = closeLoading; // 关闭loading
Vue.prototype.$showToast = showToast; // toast
Vue.prototype.$showMessageBox = showMessageBox; // msgbox
Vue.prototype.$showMessagePanel = showMessagePanel; // msgpanel

import {directives, filters} from '@/utils/directive&filter';
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

Vue.config.productionTip = false;
// 注册全局指令
Object.keys(directives).forEach((key: string) => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key]);
});

// 注册全局过滤器
Object.keys(filters).forEach((key: string) => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key]);
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
