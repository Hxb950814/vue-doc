import Cookie from 'js-cookie';
import VueRouter from 'vue-router';
import {isWeixin} from '@common/src/utils/browser';
import pageMaps from '@/utils/pageMaps';

import {postAsync} from '@/utils/request';
import config from '@/utils/config';

/* 复制，兼容IE9+, safari 10+ */
export function copyText(text: string, cb?: ()=>void) {
    const copyTextarea = document.createElement('TEXTAREA') as HTMLTextAreaElement;
    copyTextarea.setAttribute('style', 'position: fixed;bottom: 0;right: 0;z-index: -1000;opacity:0;user-select: none;width:1PX;height:1PX');
    copyTextarea.setAttribute('id', '_copyInput');
    copyTextarea.setAttribute('description', '复制功能专用');
    document.body.appendChild(copyTextarea);
    copyTextarea.value = String(text);
    copyTextarea.select(); // 选择对象
    document.execCommand('Copy'); // 执行浏览器复制命令
    setTimeout(() => {
        document.body.removeChild(copyTextarea);
    }, 0);
    if (cb) {
        cb();
    }
    return Promise.resolve();
}

export async function checkAuth(toPath?: string) {
    const redirectPath = toPath || (window.location.pathname + window.location.search);
    const token = Cookie.get('token');
    if (!token) {
        window.location.href = '/auth/login?to=' + encodeURIComponent(redirectPath);
        return false;
    }
    const [_, resp] = await postAsync('/user/validateToken', {type: 0});
    if (resp?.code !== '000000') {
        window.location.href = '/auth/login?delkey=1&to=' + encodeURIComponent(redirectPath);
        return false;
    }
    return true;
}

/* 根据参数跳转 */
export async function jumpToPageUrl(data: any, router: VueRouter) {
    // debugger
    const power = String(data.power || 0); // 0 无权限, 1登录, 2登录平台+登录期货账号
    const urlType = String(data.urlType); // 1内部链接 2外部链接 0无连接
    if (urlType !== '1' && urlType !== '2') {
        // console.log('urlType不正确, 当前值：', data.urlType);
        return;
    }
    const urlReal = urlType === '1' ? pageMaps[data.pageId] || '' : data.url;
    // console.log('urlReal', urlReal);
    if (!urlReal) {
        console.log('pageId不正确或者未实现对应的页面：', data.pageId);
        return;
    }

    // 检查权限
    if (power === '1') { // 需要登录
        const token = Cookie.get('token');
        if (!token) {
            window.location.href = '/auth/login?to=' + encodeURIComponent(urlReal);
            return;
        }
        const [_, resp] = await postAsync('/user/validateToken', {type: 0});
        if (resp?.code === '000000') {
            // todo
        } else {
            window.location.href = '/auth/login?delkey=1&to=' + encodeURIComponent('');
            return;
        }
    }
    if (urlType === '1') { // 内部链接
        if (data.pageKey) {
            router.push(`${urlReal}?${data.pageKey}=${data.pageValue}`);
        } else {
            router.push(urlReal);
        }
    } else { // 外部链接
        window.location.href = data.url;
    }
}

/* 获得token 服务端专用 */
export function getTokenFromCookies(cookies?: string) {
    if (cookies) { // 服务端
        const serviceCookie: any = {};
        cookies.split(';').forEach(function (val) {
            const parts = val.split('=');
            serviceCookie[parts[0].trim()] = (parts[1] || '').trim();
        });
        return serviceCookie.token || '';
    } // 浏览器端
    return '';
}

/* 获得token 服务端专用 */
export function getFromCookies(cookies: string, key: string) {
    if (cookies) { // 服务端
        const serviceCookie: any = {};
        cookies.split(';').forEach(function (val) {
            const parts = val.split('=');
            serviceCookie[parts[0].trim()] = (parts[1] || '').trim();
        });
        return serviceCookie[key] || '';
    } // 浏览器端
    return '';
}

/* 分享的函数, 在客户端使用 */
export function setShareConfig(dataShareIn?: {
    title?: string,
    desc?: string,
    url?: string,
    imgUrl?: string
}) {
    // 目前只在微信上使用，非微信平台不请求数据
    // todo 后期加入app平台
    if (!isWeixin()) {
        return;
    }
    console.log('检测到微信环境，设置分享数据');
    (async () => {
        // 请求信息
        const dataShare = Object.assign({}, dataShareIn || {}, {
            title: config.shareTitle,
            desc: config.shareDesc,
            url: window.location.origin, // 默认的分享地址是首页
            imgUrl: config.shareImageUrl
        });
        const [_, resp] = await postAsync('/operate/getShareInfo', {
            url: encodeURIComponent(window.location.href)
        });
        if (resp?.code === '000000') {
            const data = resp?.data || {};
            window.wx.config({
                debug: false, // 为true时，就是调试模式，会弹出一些信息，正确、错误都会弹。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，
                // 必填，把要使用的方法名放到这个数组中。
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareQZone'
                ]
            });
            const shareData = {
                title: dataShare.title, // 分享标题
                desc: dataShare.desc, // 分享标题
                link: dataShare.url || window.location.href, // 分享链接
                imgUrl: dataShare.imgUrl
            };
            window.wx.ready(() => {
                window.wx.onMenuShareTimeline({
                    ...shareData
                });
                window.wx.onMenuShareAppMessage({
                    ...shareData
                });
                window.wx.onMenuShareQQ({
                    ...shareData
                });
                window.wx.onMenuShareQZone({
                    ...shareData
                });
            });
        }
    })();
}
