import {Middleware, Context} from '@nuxt/types';
import config from '@/utils/config';

/* 首页路由重写 */
const home_rewrite: Middleware = ({isHMR, redirect, route}: Context) => {
    if (isHMR) {
        return;
    }

    // console.log(2222222222);
    // console.log(route);
    if (route.path === '/') {
       return redirect(config.homePath);
    }
};

export default home_rewrite;
