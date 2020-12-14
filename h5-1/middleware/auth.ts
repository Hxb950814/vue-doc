import {Middleware, Context} from '@nuxt/types';
import Cookies from 'js-cookie';
import {getTokenFromCookies} from '@/utils';
import {postAsync} from '@/utils/request';

const auth: Middleware = async (context: Context) => {
    // console.log('cookies:', context.app.$cookies);
    // console.log(context.req.headers);
    const {req, store, route, isServer, redirect, app} = context;
    let token = '';
    if (process.server) {
        token = getTokenFromCookies(req?.headers?.cookie || '');
    } else {
        token = Cookies.get('token') || '';
    }
    const path = isServer ? req.originalUrl : route.fullPath;
    let redirectURL = '';
    if (path) {
        redirectURL = '/auth/login?to=' + encodeURIComponent(path);
    }
    // console.log('token', process.server);
    // console.log('token', token);
    // 需要进行权限判断的页面开头
    if (!token) {
        redirect(redirectURL);
    } else {
        // 检查token是否有效
        const [_, resp] = await postAsync('/user/validateToken', {
            type: 0
        });
        // console.log('登录拦截', resp);
        if (resp?.code !== '000000') {
            redirect(redirectURL);
        }
    }
};

export default auth;
