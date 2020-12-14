export const state = () => ({
    userName: '', // 用户名
    userPortrait: '', // 头像
    userLogined: false, // 是否登录
    userSigned: false, // 是否已经签到
    userPhone: '' // 手机号
});

export const mutations = {
    setUserName(state: any, userName: string) {
        state.userName = userName;
    },
    setUserLogined(state: any, userLogined: boolean) {
        state.userLogined = userLogined;
    },
    setUserPortrait(state: any, userPortrait: string) {
        state.userPortrait = userPortrait;
    },
    setUserSigned(state: any, userSigned: string) {
        state.userSigned = userSigned;
    },
    setPhone(state: any, userPhone: string) {
        state.userPhone = userPhone;
    },
    exitLogin(state: any) {
        state.userLogined = false;
        state.userPortrait = '';
    }
};

export const actions = () => ({
});
