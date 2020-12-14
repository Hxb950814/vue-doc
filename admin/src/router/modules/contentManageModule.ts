import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '04'; // 大id

/* K豆模块的路由 */
export default [
    redirectMake('/content_manage', '/content_manage/index'),
    {
        path: '/content_manage',
        component: Layout,
        meta: {
            title: '内容模块'
        },
        children: [{
            meta: {
                groupId,
                id: '04',
                title: '内容中心'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/content-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '040101',
                title: '公告管理'
            },
            path: 'announcement/list',
            component: () => import('@/views/content-manage/announcement/list.vue')
        }, {
            meta: {
                groupId,
                id: '04010101',
                title: '添加公告'
            },
            path: 'announcement/add',
            component: () => import('@/views/content-manage/announcement/add.vue')
        }, {
            meta: {
                groupId,
                id: '04010102',
                title: '查看公告'
            },
            path: 'announcement/edit',
            component: () => import('@/views/content-manage/announcement/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040201',
                title: '文章管理'
            },
            path: 'article/list',
            component: () => import('@/views/content-manage/article/list.vue')
        },
        {
            meta: {
                groupId,
                id: '04010101',
                title: '添加文章'
            },
            path: 'article/add',
            component: () => import('@/views/content-manage/article/add.vue')
        }, {
            meta: {
                groupId,
                id: '04020101',
                title: '查看文章'
            },
            path: 'article/edit',
            component: () => import('@/views/content-manage/article/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '新股申购'
            },
            path: 'makeNew/newShares',
            component: () => import('@/views/content-manage/makeNew/newShares/list.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '新股申购添加'
            },
            path: 'makeNew/newShares/add',
            component: () => import('@/views/content-manage/makeNew/newShares/add.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '新股申购查看'
            },
            path: 'makeNew/newShares/edit',
            component: () => import('@/views/content-manage/makeNew/newShares/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '新债申购'
            },
            path: 'makeNew/newDebt',
            component: () => import('@/views/content-manage/makeNew/newDebt/list.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '新债申购添加'
            },
            path: 'makeNew/newDebt/add',
            component: () => import('@/views/content-manage/makeNew/newDebt/add.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '新债申购查看'
            },
            path: 'makeNew/newDebt/edit',
            component: () => import('@/views/content-manage/makeNew/newDebt/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '版本管理'
            },
            path: 'version/list',
            component: () => import('@/views/content-manage/version/list.vue')
        }, {
                meta: {
                groupId,
                id: '040301',
                title: '问题列表'
            },
            path: 'help/problem',
            component: () => import('@/views/content-manage/help/problem/list.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '问题列表添加'
            },
            path: 'help/problem/add',
            component: () => import('@/views/content-manage/help/problem/add.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '问题列表查看'
            },
            path: 'help/problem/edit',
            component: () => import('@/views/content-manage/help/problem/edit.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '问题分类'
            },
            path: 'help/classification',
            component: () => import('@/views/content-manage/help/classification/list.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '问题分类添加'
            },
            path: 'classification/add',
            component: () => import('@/views/content-manage/help/classification/add.vue')
        }, {
            meta: {
                groupId,
                id: '040301',
                title: '问题分类查看'
            },
            path: 'classification/edit',
            component: () => import('@/views/content-manage/help/classification/edit.vue')
        }, {
        meta: {
            groupId,
            id: '040301',
            title: '意见反馈'
        },
        path: 'suggestions/list',
        component: () => import('@/views/content-manage/suggestions/list.vue')
    }]
    }
];
