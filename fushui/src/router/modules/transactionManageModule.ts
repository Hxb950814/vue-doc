import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '07'; // 大id

/* K豆模块的路由 */
export default [
    redirectMake('/transaction_manage', '/transaction_manage/index'),
    {
        path: '/transaction_manage',
        component: Layout,
        meta: {
            title: '交易模块'
        },
        children: [{
            meta: {
                groupId,
                id: '07',
                title: '交易中心'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/transaction-manage/index.vue')
        }, {
                meta: {
                    groupId,
                    id: '070101',
                    title: '交易日历'
                },
                path: 'time/calendar', // 交易日历
                component: () => import('@/views/transaction-manage/time/calendar.vue')
            }, {
            meta: {
                groupId,
                id: '070201',
                title: '挂单订单'
            },
            path: 'pendingOrder/index', // 挂单订单
            component: () => import('@/views/transaction-manage/pendingOrder/index.vue')
        }, {
            meta: {
                groupId,
                id: '070301',
                title: '委托订单'
            },
            path: 'commissionOrder/index', // 委托订单
            component: () => import('@/views/transaction-manage/commissionOrder/index.vue')
        }, {
            meta: {
                groupId,
                id: '070401',
                title: '成交订单'
            },
            path: 'dealOrder/index', // 成交订单
            component: () => import('@/views/transaction-manage/dealOrder/index.vue')
        },
            {
                meta: {
                    groupId,
                    id: '070501',
                    title: '未触发列表'
                },
                path: 'cloudConditionsOrder/index/index', // 交易日历
                component: () => import('@/views/transaction-manage/cloudConditionsOrder/index/index.vue')
            }, {
                meta: {
                    groupId,
                    id: '070502',
                    title: '已触发列表'
                },
                path: 'cloudConditionsOrder/triggered/triggered', // 交易日历
                component: () => import('@/views/transaction-manage/cloudConditionsOrder/triggered/triggered.vue')
            }, {
                meta: {
                    groupId,
                    id: '070503',
                    title: '已失效列表'
                },
                path: 'cloudConditionsOrder/invalid/invalid', // 交易日历
                component: () => import('@/views/transaction-manage/cloudConditionsOrder/invalid/invalid.vue')
            }]
    }
];
