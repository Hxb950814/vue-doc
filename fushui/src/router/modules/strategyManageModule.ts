import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '08'; // 大id

/* K豆模块的路由 */
export default [
    redirectMake('/strategy_manage', '/strategy_manage/index'),
    {
        path: '/strategy_manage',
        component: Layout,
        meta: {
            title: '策略模块'
        },
        children: [{
            meta: {
                groupId,
                id: '08',
                title: '行情主页'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/strategy-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '策略管理'
            },
            path: 'manage/index', // 策略管理
            component: () => import('@/views/strategy-manage/manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '08010101',
                title: '添加策略'
            },
            path: '/strategy_manage/manage/add',
            component: () => import('@/views/strategy-manage/manage/add.vue')
        }, {
            meta: {
                groupId,
                id: '08010102',
                title: '查看策略'
            },
            path: '/strategy_manage/manage/detail',
            component: () => import('@/views/strategy-manage/manage/detail.vue')
        }, {
            meta: {
                groupId,
                id: '080201',
                title: '策略运行'
            },
            path: 'running/index', // 策略运行
            component: () => import('@/views/strategy-manage/running/index.vue')
        }, {
            meta: {
                groupId,
                id: '08020101',
                title: '查看详情'
            },
            path: '/strategy_manage/running/detail',
            component: () => import('@/views/strategy-manage/running/detail.vue')
        }, {
            meta: {
                groupId,
                id: '080301',
                title: '策略终止'
            },
            path: 'termination/index', // 策略终止
            component: () => import('@/views/strategy-manage/termination/index.vue')
        }, {
            meta: {
                groupId,
                title: '查看详情'
            },
            id: '08030101',
            path: '/strategy_manage/termination/detail',
            component: () => import('@/views/strategy-manage/termination/detail.vue')
        }, {
            meta: {
                groupId,
                title: '多空组合'
            },
            id: '080401',
            path: '/strategy_manage/multIspace/index',
            component: () => import('@/views/strategy-manage/multIspace/index.vue')
        }, {
            meta: {
                groupId,
                title: '修改参数'
            },
            id: '08040101',
            path: '/strategy_manage/multIspace/changeParameters',
            component: () => import('@/views/strategy-manage/multIspace/changeParameters.vue')
        }, {
            meta: {
                groupId,
                title: '月卡记录'
            },
            id: '08040101',
            path: '/strategy_manage/multIspace/monthlyCardRecord',
            component: () => import('@/views/strategy-manage/multIspace/monthlyCardRecord.vue')
        }, {
            meta: {
                groupId,
                title: '查询记录'
            },
            id: '08040101',
            path: '/strategy_manage/multIspace/searchRecord',
            component: () => import('@/views/strategy-manage/multIspace/searchRecord.vue')
        }, {
            meta: {
                groupId,
                title: '匹配组合'
            },
            id: '08040101',
            path: '/strategy_manage/multIspace/matchingCombination',
            component: () => import('@/views/strategy-manage/multIspace/matchingCombination.vue')
        }]
    }
];
