import {Middleware, Context} from '@nuxt/types';

const redirect: Middleware = async ({isHMR, redirect, route}: Context) => {
    if (isHMR) {
        return;
    }

    // 重定向
    let redirectPath = '';
    switch (route.path) {
        case '/account':
            redirectPath = '/account/deal';
            break;
    }
    redirect(redirectPath);
};

export default redirect;
