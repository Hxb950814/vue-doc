import { redirectMake } from '../tools';
import Layout from '@/views/layout/Layout.vue';
const groupId = '03'; // 大id

/* 运营模块的路由 */
export default [
    redirectMake('/image_manage', '/image_manage/index'),
    {
        path: '/image_manage',
        component: Layout,
        meta: {
            title: 'ICON管理'
        },
        children: [{
            meta: {
                groupId,
                id: '03',
                title: 'ICON管理中心'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/image-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '030201',
                title: 'banner管理'
            },
            path: 'pictures/list', // 图片管理
            component: () => import('@/views/image-manage/pictures/list.vue')
        }, {
            meta: {
                groupId,
                id: '03020101',
                title: '添加Banner'
            },
            path: 'pictures/add', // 添加Banner
            component: () => import('@/views/image-manage/pictures/add.vue')
        }, {
            meta: {
                groupId,
                id: '03020102',
                title: '查看Banner'
            },
            path: 'pictures/edit', // 查看Banner
            component: () => import('@/views/image-manage/pictures/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: '主页ICON'
            },
            path: 'icons/homeIcon',
            component: () => import('@/views/image-manage/icons/homeIcon/index.vue')
        },
        {
            meta: {
                groupId,
                id: '03030101',
                title: '添加主页Icon'
            },
            path: 'icons/add', // 添加Icon
            component: () => import('@/views/image-manage/icons/add.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: '求知ICON'
            },
            path: 'icons/knowledgeIcon', // Icon管理
            component: () => import('@/views/image-manage/icons/knowledgeIcon/index.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: '工具ICON'
            },
            path: 'icons/toolsIcon',
            component: () => import('@/views/image-manage/icons/toolsIcon/index.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: '互动ICON'
            },
            path: 'icons/interactiveIcon', // Icon管理
            component: () => import('@/views/image-manage/icons/interactiveIcon/index.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: '汇总ICON'
            },
            path: 'icons/summaryIcon',
            component: () => import('@/views/image-manage/icons/summaryIcon/index.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: '资产ICON'
            },
            path: 'icons/assetsIcon', // Icon管理
            component: () => import('@/views/image-manage/icons/assetsIcon/index.vue')
        }, {
            meta: {
                groupId,
                id: '03030102',
                title: '查看Icon'
            },
            path: 'icons/edit', // 查看Icon
            component: () => import('@/views/image-manage/icons/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030401',
                title: '公告管理'
            },
            path: 'notices/list', // 公告管理
            component: () => import('@/views/image-manage/notices/list.vue')
        }, {
            meta: {
                groupId,
                id: '03040101',
                title: '添加公告'
            },
            path: 'notices/add', // 添加公告
            component: () => import('@/views/image-manage/notices/add.vue')
        }, {
            meta: {
                groupId,
                id: '03040102',
                title: '查看公告'
            },
            path: 'notices/edit', // 查看公告
            component: () => import('@/views/image-manage/notices/edit.vue')
        },
        //     {
        //     meta: {
        //         groupId,
        //         id: '030401',
        //         title: '底部图标'
        //     },
        //     path: 'footer/list', // 公告管理
        //     component: () => import('@/views/image-manage/footer/list.vue')
        // },
            {
            meta: {
                groupId,
                id: '030801',
                title: '界面管理ID'
            },
            path: 'page_id/list', // 查看页面id
            component: () => import('@/views/image-manage/page-id/list.vue')
        }, {
            meta: {
                groupId,
                id: '03080101',
                title: '添加页面ID'
            },
            path: 'page_id/add', // 添加页面ID
            component: () => import('@/views/image-manage/page-id/add.vue')
        }, {
            meta: {
                groupId,
                id: '03080102',
                title: '查看页面ID'
            },
            path: 'page_id/edit', // 添加页面ID
            component: () => import('@/views/image-manage/page-id/edit.vue')
        }]
    }
];
