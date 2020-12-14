const app = {
    state: {
        moduleId: '1' // 模块id
    },
    mutations: {
        SET_MODULE_ID: (state: any, moduleId: string) => {
            state.moduleId = moduleId;
        }
    },
    actions: {
    }
};

export default app;
