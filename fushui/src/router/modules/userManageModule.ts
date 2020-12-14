import { redirectMake } from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '05'; // 大id

/* K豆模块的路由 */
export default [
    redirectMake('/user_manage', '/user_manage/index'),
    {
        path: '/user_manage',
        component: Layout,
        meta: {
            title: '用户模块'
        },
        children: [{
            meta: {
                groupId,
                id: '05',
                title: '用户模块'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/user-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '平台用户'
            },
            path: 'platforms/list', // 平台用户
            component: () => import('@/views/user-manage/platforms-user/list.vue')
        }, {
            meta: {
                groupId,
                id: '050201',
                title: '期货用户'
            },
            path: 'futures/list', // 期货用户
            component: () => import('@/views/user-manage/futures-user/list.vue')
        }, {
            meta: {
                groupId,
                id: '050301',
                title: '交易用户'
            },
            path: 'transaction/list', // 交易用户
            component: () => import('@/views/user-manage/transaction-user/list.vue')
        }, {
            meta: {
                groupId,
                id: '050401',
                title: '推荐用户'
            },
            path: 'recommend/list', // 推荐用户
            component: () => import('@/views/user-manage/recommend-user/list.vue')
        }, {
            meta: {
                groupId,
                id: '050501',
                title: '期货公司'
            },
            path: 'futures_company/list', // 期货公司
            component: () => import('@/views/user-manage/futures-company/list.vue')
        }, {
            meta: {
                groupId,
                id: '05050101',
                title: '添加期货公司'
            },
            path: 'futures_company/add', // 添加期货公司
            component: () => import('@/views/user-manage/futures-company/add.vue')
        }, {
            meta: {
                groupId,
                id: '05050102',
                title: '查看期货公司'
            },
            path: 'futures_company/detail', // 查看期货公司
            component: () => import('@/views/user-manage/futures-company/detail.vue')
        }, {
            meta: {
                groupId,
                id: '050601',
                title: '账号管理'
            },
            path: 'account_manage/list', // 查看期货公司
            component: () => import('@/views/user-manage/account-manage/list.vue')
        }, {
            meta: {
                groupId,
                id: '050601',
                title: '银行管理'
            },
            path: 'bank_manage/list', // 银行管理
            component: () => import('@/views/user-manage/bank-manage/list.vue')
        }, {
            meta: {
                groupId,
                id: '050601',
                title: '添加银行'
            },
            path: 'bank_manage/add', // 添加银行
            component: () => import('@/views/user-manage/bank-manage/add.vue')
        }, {
            meta: {
                groupId,
                id: '050601',
                title: '查看银行'
            },
            path: 'bank_manage/detail', // 查看银行
            component: () => import('@/views/user-manage/bank-manage/detail.vue')
        }]
    }
];
