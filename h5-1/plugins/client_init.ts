import JsBridge from '@common/src/utils/jsbridge';
import config from '@/utils/config';

/* 加入eruda 调试 */
if (window.eruda) {
    window.eruda.init();
}

/* 初始化jsbridge */
JsBridge.getInstance().onReady(() => {
    // console.log('检测到jsbridge 加载成功，可以进行安全交互了');
});

document.addEventListener('DOMContentLoaded', () => {
    /* 注入ruda */
    if (!config.useEruda || window.eruda) {
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    script.onload = () => {
        window.eruda.init();
    };
    document.body.appendChild(script);

    /* 注入分享 */
});
