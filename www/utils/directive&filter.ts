import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';

/* 自定义指令 + 自定义过滤器 */
// import {commits} from '~/store';

/* 自定义指令的类型 */
enum USER_DIRECTIVE_TYPE{
    TITLE = 'title'
}

/* 自定义过滤器类型 */
enum USER_FILTER_TYPE{
    MONEY = 'money', // 千分位
    MONEY_INTEGER = 'moneyInteger', // 整数千分位
    MOBILE_MASK = 'mobileMask'
}

const filters: any = {};

filters[USER_FILTER_TYPE.MONEY] = (val: string) => {
    let value = Number(val);
    if (isNaN(value)) {
        value = 0;
    }
    let isNeg = '';
    if (value < 0) {
        isNeg = '-';
        value = Math.abs(value);
    }
    let value2 = String(value);
    const pos = value2.indexOf('.');
    if (pos > 0) {
        value2 = (value2 + '00').slice(0, value2.indexOf('.') + 3);
    } else {
        value2 = (value2 + '.00');
    }
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    return isNeg + value2.replace(/^(\d+)((\.\d+)?)$/, (s: any, s1: any, s2: any) => s1.replace(re, '$&,') + s2);
};

filters[USER_FILTER_TYPE.MONEY_INTEGER] = (val: string) => {
    let value = Number(val);
    if (isNaN(value)) {
        value = 0;
    }
    let isNeg = '';
    if (value < 0) {
        isNeg = '-';
        value = Math.abs(value);
    }
    value = Math.floor(value);
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    return isNeg + String(value).replace(/^(\d+)((\.\d+)?)$/, (s: any, s1: any, s2: any) => s1.replace(re, '$&,') + s2);
};

filters[USER_FILTER_TYPE.MOBILE_MASK] = (val: string) => {
    if (!val) {
        return val;
    }
    return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
};

const directives: any = {};
// directives[USER_DIRECTIVE_TYPE.TITLE] = {
//     bind(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
//         // store.commit('setPageTitle', binding.expression);
//     }
// };

export { directives, filters };
