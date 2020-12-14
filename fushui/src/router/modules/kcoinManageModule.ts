import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '04'; // 大id

/* K豆模块的路由 */
export default [
    redirectMake('/kcoin_manage', '/kcoin_manage/index'),
    {
        path: '/kcoin_manage',
        component: Layout,
        meta: {
            title: 'K豆模块'
        },
        children: [{
            meta: {
                groupId,
                id: '04',
                title: 'K豆中心'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/kcoin-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '040101',
                title: 'K豆产品'
            },
            path: 'products/list', // K豆产品
            component: () => import('@/views/kcoin-manage/products/list.vue')
        }, {
            meta: {
                groupId,
                id: '04010101',
                title: '添加K豆产品'
            },
            path: 'products/add', // 添加K豆产品
            component: () => import('@/views/kcoin-manage/products/add.vue')
        }, {
            meta: {
                groupId,
                id: '04010102',
                title: '查看K豆产品'
            },
            path: 'products/edit', // 查看K豆产品
            component: () => import('@/views/kcoin-manage/products/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040201',
                title: 'K豆订单'
            },
            path: 'orders/list', // K豆订单
            component: () => import('@/views/kcoin-manage/orders/list.vue')
        }, {
            meta: {
                groupId,
                id: '04020101',
                title: '查看K豆订单'
            },
            path: 'orders/edit', // 查看K豆订单
            component: () => import('@/views/kcoin-manage/orders/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: 'K豆记录'
            },
            path: 'records/list', // K豆记录
            component: () => import('@/views/kcoin-manage/records/list.vue')
        }, {
            meta: {
                groupId,
                id: '040401',
                title: 'K豆比例设置'
            },
            path: 'ratio_settings/list', // K豆比例设置
            component: () => import('@/views/kcoin-manage/settings/ratioSettingsList.vue')
        }, {
            meta: {
                groupId,
                id: '040402',
                title: '通道设置'
            },
            path: 'channel_settings/list', // 通道设置
            component: () => import('@/views/kcoin-manage/settings/channelSettingsList.vue')
        }, {
            meta: {
                groupId,
                id: '04040201',
                title: '添加通道'
            },
            path: 'channel_settings/add', // 添加通道
            component: () => import('@/views/kcoin-manage/settings/addChannel.vue')
        }, {
            meta: {
                groupId,
                id: '04040202',
                title: '查看通道'
            },
            path: 'channel_settings/edit', // 查看通道
            component: () => import('@/views/kcoin-manage/settings/editChannel.vue')
        }, {
            meta: {
                groupId,
                id: '040501',
                title: '签到数据统计'
            },
            path: 'checkin_manage/data', // 签到数据统计
            component: () => import('@/views/kcoin-manage/checkin/data/index.vue')
        }, {
            meta: {
                groupId,
                id: '040504',
                title: '签到设置'
            },
            path: 'checkin_setting/list', // 签到设置
            component: () => import('@/views/kcoin-manage/checkin/setting/index.vue')
        }, {
            meta: {
                groupId,
                id: '040503',
                title: '用户签到统计'
            },
            path: 'checkin_analysis/list', // 用户签到统计
            component: () => import('@/views/kcoin-manage/checkin/analysis/list.vue')
        }, {
            meta: {
                groupId,
                id: '040502',
                title: '签到记录'
            },
            path: 'checkin_record/list', // 签到记录
            component: () => import('@/views/kcoin-manage/checkin/record/list.vue')
        }]
    }
];
