import { redirectMake } from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '06'; // 大id

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
                title: '全部会员'
            },
            path: 'allMembers/list',
            component: () => import('@/views/user-manage/allMembers/list.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '全部会员详情'
            },
            path: 'allMembers/detail',
            component: () => import('@/views/user-manage/allMembers/detail.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '学习会员'
            },
            path: 'learningMember/list',
            component: () => import('@/views/user-manage/learningMember/list.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '学习会员详情'
            },
            path: 'learningMember/detail',
            component: () => import('@/views/user-manage/learningMember/detail.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '认证会员'
            },
            path: 'certificationMember/list',
            component: () => import('@/views/user-manage/certificationMember/list.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '认证会员详情'
            },
            path: 'certificationMember/detail',
            component: () => import('@/views/user-manage/certificationMember/detail.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '锁定会员'
            },
            path: 'lockingMember/list',
            component: () => import('@/views/user-manage/lockingMember/list.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '锁定会员详情'
            },
            path: 'lockingMember/detail',
            component: () => import('@/views/user-manage/lockingMember/detail.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '会员班级'
            },
            path: 'memberClass/list',
            component: () => import('@/views/user-manage/memberClass/list.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '会员班级创建'
            },
            path: 'memberClass/add',
            component: () => import('@/views/user-manage/memberClass/add.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '会员班级详情'
            },
            path: 'memberClass/detail',
            component: () => import('@/views/user-manage/memberClass/detail.vue')
        },
        {
            meta: {
                groupId,
                id: '050101',
                title: '查看规则'
            },
            path: 'memberClass/lookRule',
            component: () => import('@/views/user-manage/memberClass/lookRule.vue')
        }, {
            meta: {
                groupId,
                id: '050101',
                title: '会员管控'
            },
            path: 'memberControl/list',
            component: () => import('@/views/user-manage/memberControl/list.vue')
        }]
    }
];
