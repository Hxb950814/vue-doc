import { Middleware, Context } from '@nuxt/types';
import Cookies from 'js-cookie';
import { getFromCookies } from '@/utils';
import { postAsync } from '@/utils/request';

const auth: Middleware = async (context: Context) => {
    const { req, store, route, redirect, app } = context;
    let token = '';
    if (process.server) {
        token = getFromCookies(req?.headers?.cookie || '', 'token');
    } else {
        token = Cookies.get('token') || '';
    }
    const path = process.server ? req.originalUrl : route.fullPath;
    let redirectURL = '';
    if (path) {
        redirectURL = '/auth/login?to=' + encodeURIComponent(path);
    }

    // 需要进行权限判断的页面开头
    if (!token) {
        redirect(redirectURL);
    } else {
        // 检查token是否有效
        const [_, resp] = await postAsync('/user/validateToken', {
            type: 2
        });
        if (resp?.code !== '000000') {
            redirect(redirectURL);
        }
    }
};

export default auth;
