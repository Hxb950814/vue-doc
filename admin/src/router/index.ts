import Vue from 'vue';
import Router, {Route} from 'vue-router';

import homeModule from './modules/homeModule'; // 基本模块
import imageManageModule from './modules/imageManageModule'; // 运营模块
import contentManageModule from './modules/contentManageModule'; // K豆模块
import userManageModule from './modules/userManageModule'; // 用户
import permissionMangeModule from './modules/permissionMangeModule'; // 权限模块
import courseMangeModule from './modules/courseMangeModule';
import financeManageModule from './modules/financeManageModule'; // 时间模块
import marketingManageModule from './modules/marketingManageModule'; // 营销模块
import debugModule from './modules/debugModule';
import store from '@/store';

if (!window.VueRouter) {
    Vue.use(Router);
}

const constantRouterMap = [
    ...imageManageModule,
    ...contentManageModule,
    ...userManageModule,
    ...permissionMangeModule,
    ...courseMangeModule,
    ...homeModule,
    ...financeManageModule,
    ...marketingManageModule,
    ...debugModule,
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '*',
        component: () => import('../views/404.vue')
    }
];

const router = new Router({
    mode: 'history', // 线上用history模式
    base: '/',
    scrollBehavior: () => ({
        x: 0,
        y: 0
    }),
    routes: constantRouterMap
});

const whiteList = [
    '/login',
    '/debugger/apiDebug'
];

router.beforeEach((to: Route, from: Route, next: any) => {
    const permission = store.getters.permissionList; // 权限列表
    if (!store.getters.token) { // 先判断是否登录
        if (whiteList.includes(to.path)) { // 白名单
            to.meta.permission = true;
            next();
            return;
        }
        store.commit('SET_MODULE_ID', '');
        next('/login');
        return;
    } // 再判断是否有权限

    // 权限控制
    // if (to.meta.id !== undefined && !permission.includes(String(to.meta.id))) { // 无权限
    //     to.meta.permission = false; // 设置权限
    // } else {
    //     to.meta.permission = true;
    // }

    // console.log(permission);
    store.commit('SET_MODULE_ID', String(to.meta.groupId)); // 主动设置moduleId
    next();
});

export default router;
