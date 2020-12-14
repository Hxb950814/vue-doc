const user = {
    state: {
        token: '',
        userName: '',
        account: '',
        permissionList: []
    },
    mutations: {
        SET_TOKEN: (state: any, token: string) => {
            state.token = token;
        },
        SET_ACCOUNT: (state: any, account: string) => {
            state.account = account;
        },
        SET_USERNAME: (state: any, userName: string) => {
            state.userName = userName;
        },
        SET_PERMISSION_LIST: (state: any, permissionList: string[]) => {
            state.permissionList = permissionList;
        },
        REMOVE_TOKEN: (state: any, token: string) => {
            state.token = '';
        },
        REMOVE_PERMISSION_LIST: (state: any, token: string) => {
            state.permissionList = [];
        }
    },
    actions: {
        setToken({ commit }: any, data: any) {
            commit('SET_TOKEN', data.token);
        },
        setAccount({ commit }: any, data: any) {
            commit('SET_ACCOUNT', data.account);
        },
        setPermissionList({ commit }: any, data: any) {
            commit('SET_PERMISSION_LIST', data.permissionList);
        },
        setUserName({ commit }: any, data: any) {
            commit('SET_USERNAME', data.userName);
        },
        removeToken({ commit }: any, data: any) {
            commit('REMOVE_TOKEN');
        },
        removePermissionList({ commit }: any, data: any) {
            commit('REMOVE_PERMISSION_LIST');
        }
    }
};

export default user;
