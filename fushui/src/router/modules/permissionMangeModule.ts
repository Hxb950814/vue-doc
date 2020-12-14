import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '09'; // 大id

/* 权限模块的路由 */
export default [
    redirectMake('/permission_manage', '/permission_manage/index'),
    {
        path: '/permission_manage',
        component: Layout,
        meta: {
            title: '权限模块'
        },
        children: [{
            meta: {
                groupId,
                id: '09',
                title: '权限模块'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/permission-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '090101',
                title: '账号管理'
            },
            path: 'accounts/list', // 账号管理
            component: () => import('@/views/permission-manage/accounts/list.vue')
        }, {
            meta: {
                groupId,
                id: '09010101',
                title: '新增账号'
            },
            path: 'accounts/add', // 新增账号
            component: () => import('@/views/permission-manage/accounts/add.vue')
        }, {
            meta: {
                groupId,
                id: '09010102',
                title: '查看账号'
            },
            path: 'accounts/edit', // 查看账号
            component: () => import('@/views/permission-manage/accounts/edit.vue')
        }, {
            meta: {
                groupId,
                id: '09010103',
                title: '编辑权限'
            },
            path: 'accounts/permission_setting', // 编辑权限
            component: () => import('@/views/permission-manage/accounts/permissionSetting.vue')
        }, {
            meta: {
                groupId,
                id: '09010104',
                title: '添加权限字段'
            },
            path: 'accounts/permission_menu_add', // 添加权限字段
            component: () => import('@/views/permission-manage/accounts/permissionMenuAdd.vue')
        }]
    }
];
