import { isIE, ieVersion } from '@common/src/utils/browser';
import Vue, { DirectiveOptions } from 'vue';

import ElementUI from 'element-ui';

// if (!window.ELEMENT) {
    Vue.use(ElementUI);
// }

document.addEventListener('DOMContentLoaded', () => {
    if (isIE() && ieVersion() <= 10) {
        alert('浏览器版本太低了，请使用最新版chrome浏览器');
    }
});
