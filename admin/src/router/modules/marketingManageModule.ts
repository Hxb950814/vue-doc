import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '08'; // 大id

/* 营销模块的路由 */
export default [
    redirectMake('/marketing_manage', '/marketing_manage/index'),
    {
        path: '/marketing_manage',
        component: Layout,
        meta: {
            title: '营销模块'
        },
        children: [{
            meta: {
                groupId,
                id: '08',
                title: '营销主页'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/marketing-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '注册奖励'
            },
            path: 'promote-manage/registered/index', // 注册奖励
            component: () => import('@/views/marketing-manage/promote-manage/registered/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '奖励设置'
            },
            path: 'promote-manage/registered/setting', // 注册奖励
            component: () => import('@/views/marketing-manage/promote-manage/registered/setting.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '邀请奖励'
            },
            path: 'promote-manage/invitation/index', // 邀请奖励
            component: () => import('@/views/marketing-manage/promote-manage/invitation/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '奖励设置'
            },
            path: 'promote-manage/invitation/setting', // 邀请奖励
            component: () => import('@/views/marketing-manage/promote-manage/invitation/setting.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '打卡设置'
            },
            path: 'clockIn-manage/setting/index', // 打卡设置
            component: () => import('@/views/marketing-manage/clockIn-manage/setting/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '修改打卡设置'
            },
            path: 'clockIn-manage/setting/setting', // 修改打卡设置
            component: () => import('@/views/marketing-manage/clockIn-manage/setting/setting.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '打卡记录'
            },
            path: 'clockIn-manage/recording/index', // 修改打卡设置
            component: () => import('@/views/marketing-manage/clockIn-manage/recording/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '邀请记录'
            },
            path: 'promote-manage/record/index', // 邀请记录
            component: () => import('@/views/marketing-manage/promote-manage/record/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '邀请记录明细'
            },
            path: 'promote-manage/record/detail', // 邀请记录明细
            component: () => import('@/views/marketing-manage/promote-manage/record/detail.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '积分任务'
            },
            path: 'pointsMall-manage/task/index', // 积分任务
            component: () => import('@/views/marketing-manage/pointsMall-manage/task/index.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '创建任务'
            },
            path: 'pointsMall-manage/task/add', // 积分任务
            component: () => import('@/views/marketing-manage/pointsMall-manage/task/add.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '创建任务'
            },
            path: 'pointsMall-manage/task/edit', // 积分任务
            component: () => import('@/views/marketing-manage/pointsMall-manage/task/edit.vue')
        }, {
            meta: {
                groupId,
                id: '080101',
                title: '积分记录'
            },
            path: 'pointsMall-manage/recording/index', // 积分记录
            component: () => import('@/views/marketing-manage/pointsMall-manage/recording/index.vue')
        }]
    }
];
