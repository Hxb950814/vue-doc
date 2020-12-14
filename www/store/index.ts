import { getFromCookies } from '@/utils';
import {setFutureToken, setOriginalUrl, setRedirect, setToken} from '@/utils/server_var';
import { postAsync } from '@/utils/request';

let storeInstance: any = null;

export const state = () => ({
});

export const getters = {
    /* pc和 node 同构 */
    userLogined: (state: any) => state.user.userLogined, // 是否登录
    userPortrait: (state: any) => state.user.userPortrait, // 头像
    userName: (state: any) => state.user.userName, // 用户名
    userSigned: (state: any) => state.user.userSigned, // 是否签到
    userPhone: (state: any) => state.user.userPhone // 手机号
};

export const mutations = {};

export const actions = {
    async nuxtServerInit(store: any, app: any) {
        storeInstance = store;
        const { commit } = store;
        const { req, res, redirect } = app;
        const token = getFromCookies(req.headers.cookie, 'token');
        const futureToken = getFromCookies(req.headers.cookie, 'futureToken');

        // console.log('cooT:', res);

        // 保存起来给服务端用
        setOriginalUrl(req.originalUr); // 保存起来
        setRedirect(redirect); // 保存起来
        setToken(token); // 保存起来
        setFutureToken(futureToken); // 保存起来

        if (token) {
            const [err, resp] = await postAsync('/user/queryPcUserInfoByLogin');
            if (resp?.code === '000000') {
                commit('user/setUserName', resp?.data?.realityName || '');
                commit('user/setUserLogined', true);
                commit('user/setUserPortrait', resp?.data?.photo || '');
                commit('user/setUserSigned', resp?.data?.isSign || false);
                commit('user/setPhone', resp?.data?.phone || '');
                // console.log(resp.data);
            } else {
            }
        }
    }
};

/* 获得实例 */
export function getStoreInstance() {
    return storeInstance;
}
