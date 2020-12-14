const getters = {
    moduleId: (state: any) => state.app.moduleId, // moduleId
    token: (state: any) => state.user.token, // token
    userName: (state: any) => state.user.userName, // userName
    account: (state: any) => state.user.account, // account
    permissionList: (state: any) => state.user.permissionList // permissionList
};
export default getters;
