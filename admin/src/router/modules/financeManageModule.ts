import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '07'; // 大id

/* 财务模块的路由 */
export default [
    redirectMake('/finance_manage', '/finance_manage/index'),
    {
        path: '/finance_manage',
        component: Layout,
        meta: {
            title: '财务模块'
        },
        children: [{
            meta: {
                groupId,
                id: '07',
                title: '财务中心'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/finance-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '营收概况'
            },
            path: 'revenue/index', // 欢迎页
            component: () => import('@/views/finance-manage/revenue/index.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '收入管理'
            },
            path: 'income/index', // 欢迎页
            component: () => import('@/views/finance-manage/income/index.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '奖励管理'
            },
            path: 'reward/index', // 欢迎页
            component: () => import('@/views/finance-manage/reward/index.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '支付设置'
            },
            path: 'settings/pay/index', // 欢迎页
            component: () => import('@/views/finance-manage/settings/pay/index.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '查看'
            },
            path: 'settings/pay/detail', // 欢迎页
            component: () => import('@/views/finance-manage/settings/pay/detail.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '提现设置'
            },
            path: 'settings/withdraw/index', // 欢迎页
            component: () => import('@/views/finance-manage/settings/withdraw/index.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '提现设置'
            },
            path: 'settings/withdraw/checkInfo', // 欢迎页
            component: () => import('@/views/finance-manage/settings/withdraw/checkInfo.vue')
        }, {
            meta: {
                groupId,
                id: '07',
                title: '课程订单'
            },
            path: 'courseOrder/index', // 欢迎页
            component: () => import('@/views/finance-manage/courseOrder/index.vue')
        }]
    }
];
