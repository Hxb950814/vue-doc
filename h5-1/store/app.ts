export const state = () => ({
    redirect: null, //
    path: '', // 当前url
    isInApp: false // 是否是app内网页
});

export const mutations = {
    setRedirect(state: any, redirect: any) {
        state.redirect = redirect;
    },
    setPath(state: any, path: string) {
        state.path = path;
    },
    setIsInApp(state: any, isIn: boolean) {
        state.isInApp = isIn;
    }
};

export const actions = {};
