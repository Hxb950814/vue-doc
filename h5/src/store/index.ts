// 作为Actions的所有子模块挂载实例的根目录
// const {get， getAsync， post， postAsync} = request；
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

// @ts-ignore vuex的持久化管理 根据模块和指定需要存储的进行存储
const vuexPersisted = new createPersistedState({
  key: "vuexPersistedData",
  storage: window.localStorage,
  reducer: state => ({
    Home: {
        token: state.Home.token,
        openId: state.Home.openId,
        nickName: state.Home.nickName,
        head: state.Home.head,
        studentNo: state.Home.studentNo,
        uId: state.Home.uId
    }
  })
});
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
  plugins: [vuexPersisted]
});
