import {getFromCookies} from '@/utils';

let storeInstance: any = null;

export const state = () => ({
});

export const getters = {
    token: (state: any) => state.user.token,
    path: (state: any) => state.app.path,
    isInApp: (state: any) => state.app.isInApp
};

export const mutations = {};

export const actions = {
    nuxtServerInit(store: any, app: any) {
        storeInstance = store;
        const {commit} = store;
        const {req, res, redirect} = app;
        const token = getFromCookies(req.headers.cookie, 'token');
        const platform = getFromCookies(req.headers.cookie, 'platform');
        commit('app/setRedirect', redirect);
        commit('app/setPath', req.originalUrl);
        // console.log('服务端设置设置redirect:', redirect);
        if (req.headers.cookie) {
            // console.log('得到token', token);
            commit('user/setToken', token);
        }

        if (String(platform) === '1' || String(platform) === '2') {
            // console.log('1是否在app', true);
            commit('app/setIsInApp', true);
        }
    }
};

/* 获得实例 */
export function getStoreInstance() {
    return storeInstance;
}
