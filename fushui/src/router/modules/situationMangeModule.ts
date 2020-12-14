import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '06'; // 大id

/* 权限模块的路由 */
export default [
    redirectMake('/situation_manage', '/situation_manage/index'),
    {
        path: '/situation_manage',
        component: Layout,
        meta: {
            title: '行情模块'
        },
        children: [{
            meta: {
                groupId,
                id: '06',
                title: '行情模块'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/situation-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '交易所展示'
            },
            path: 'source/list', // 交易所展示
            component: () => import('@/views/situation-manage/source/list.vue')
        }, {
            meta: {
                groupId,
                id: '06010101',
                title: '添加行情来源'
            },
            path: 'source/add', // 添加行情来源
            component: () => import('@/views/situation-manage/source/add.vue')
        }, {
            meta: {
                groupId,
                id: '06010102',
                title: '查看行情来源'
            },
            path: 'source/detail', // 查看行情来源
            component: () => import('@/views/situation-manage/source/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060201',
                title: '行情种类'
            },
            path: 'type/list', // 行情种类
            component: () => import('@/views/situation-manage/type/list.vue')
        }, {
            meta: {
                groupId,
                id: '06020101',
                title: '添加行情种类'
            },
            path: 'type/add', // 添加行情种类
            component: () => import('@/views/situation-manage/type/add.vue')
        }, {
            meta: {
                groupId,
                id: '06020102',
                title: '查看行情种类'
            },
            path: 'type/detail', // 查看行情种类
            component: () => import('@/views/situation-manage/type/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060301',
                title: '行情合约'
            },
            path: 'contract/list/list', // 行情合约
            component: () => import('@/views/situation-manage/contract/list/list.vue')
        }, {
            meta: {
                groupId,
                id: '06030101',
                title: '添加合约'
            },
            path: 'contract/list/add', // 添加合约
            component: () => import('@/views/situation-manage/contract/list/add.vue')
        }, {
            meta: {
                groupId,
                id: '06030102',
                title: '查看合约'
            },
            path: 'contract/list/detail', // 查看合约
            component: () => import('@/views/situation-manage/contract/list/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060302',
                title: '延展合约'
            },
            path: 'contract/stretch/list', // 延展合约
            component: () => import('@/views/situation-manage/contract/stretch/list.vue')
        }, {
            meta: {
                groupId,
                id: '06030201',
                title: '添加延展合约'
            },
            path: 'contract/stretch/add', // 添加合约
            component: () => import('@/views/situation-manage/contract/stretch/add.vue')
        }, {
            meta: {
                groupId,
                id: '06030202',
                title: '查看延展合约'
            },
            path: 'contract/stretch/detail', // 查看合约
            component: () => import('@/views/situation-manage/contract/stretch/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060303',
                title: '品种指数'
            },
            path: 'contract/variety/list', // 品种指数
            component: () => import('@/views/situation-manage/contract/variety/list.vue')
        }, {
            meta: {
                groupId,
                id: '06030301',
                title: '添加品种指数'
            },
            path: 'contract/variety/add', // 添加合约
            component: () => import('@/views/situation-manage/contract/variety/add.vue')
        }, {
            meta: {
                groupId,
                id: '06030302',
                title: '查看品种指数'
            },
            path: 'contract/variety/detail', // 查看合约
            component: () => import('@/views/situation-manage/contract/variety/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060401',
                title: '行情指数'
            },
            path: 'index/list', // 行情指数
            component: () => import('@/views/situation-manage/index/list.vue')
        }, {
            meta: {
                groupId,
                id: '06040101',
                title: '添加行情指数'
            },
            path: 'index/add', // 添加行情指数
            component: () => import('@/views/situation-manage/index/add.vue')
        }, {
            meta: {
                groupId,
                id: '06040102',
                title: '查看行情指数'
            },
            path: 'index/detail', // 查看行情指数
            component: () => import('@/views/situation-manage/index/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060501',
                title: '持仓数据'
            },
            path: 'position/list', // 持仓数据
            component: () => import('@/views/situation-manage/position/list.vue')
        }, {
            meta: {
                groupId,
                id: '06050102',
                title: '查看持仓数据'
            },
            path: 'position/detail', // 查看持仓数据
            component: () => import('@/views/situation-manage/position/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060601',
                title: '行情抬头'
            },
            path: 'settings/quotation_title/list', // 行情抬头列表
            component: () => import('@/views/situation-manage/settings/quotation-title/list.vue')
        }, {
            meta: {
                groupId,
                id: '06060101',
                title: '添加行情抬头'
            },
            path: 'settings/quotation_title/add', // 添加行情抬头
            component: () => import('@/views/situation-manage/settings/quotation-title/add.vue')
        }, {
            meta: {
                groupId,
                id: '06060102',
                title: '查看行情抬头'
            },
            path: 'settings/quotation_title/detail', // 查看行情抬头
            component: () => import('@/views/situation-manage/settings/quotation-title/detail.vue')
        }, {
            meta: {
                groupId,
                id: '060602',
                title: 'K线图表'
            },
            path: 'settings/kline_chart/list', // K线图表
            component: () => import('@/views/situation-manage/settings/kline-chart/list.vue')
        }, {
            meta: {
                groupId,
                id: '06060201',
                title: '添加图表'
            },
            path: 'settings/kline_chart/add', // K线图表
            component: () => import('@/views/situation-manage/settings/kline-chart/add.vue')
        }, {
            meta: {
                groupId,
                id: '06060202',
                title: '查看图表'
            },
            path: 'settings/kline_chart/detail', // K线图表
            component: () => import('@/views/situation-manage/settings/kline-chart/detail.vue')
        }, {
            meta: {
                groupId,
                id: '06070101',
                title: '预警信息'
            },
            path: 'warning/list', // 预警信息
            component: () => import('@/views/situation-manage/warning/list.vue')
        }]
    }
];
