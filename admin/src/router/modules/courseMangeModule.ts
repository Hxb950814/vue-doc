import {redirectMake} from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '05'; // 大id

/* 权限模块的路由 */
export default [
    redirectMake('/course_manage', '/course_manage/index'),
    {
        path: '/course_manage',
        component: Layout,
        meta: {
            title: '课程模块'
        },
        children: [{
            meta: {
                groupId,
                id: '06',
                title: '课程模块'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/course-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '股票课程小节'
            },
            path: 'stock/subsectionList',
            component: () => import('@/views/course-manage/stock/subsectionList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '股票课程小节添加'
            },
            path: 'stock/subsectionAdd',
            component: () => import('@/views/course-manage/stock/subsectionAdd.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '股票课程小节查看'
            },
            path: 'stock/subsectionEdit',
            component: () => import('@/views/course-manage/stock/subsectionEdit.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '股票课程类目'
            },
            path: 'stock/tableOfContentsList',
            component: () => import('@/views/course-manage/stock/tableOfContentsList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '股票课程类目添加'
            },
            path: 'stock/tableOfContentsAdd',
            component: () => import('@/views/course-manage/stock/tableOfContentsAdd.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '股票课程类目查看'
            },
            path: 'stock/tableOfContentsEdit',
            component: () => import('@/views/course-manage/stock/tableOfContentsEdit.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '基金课程小节'
            },
            path: 'fund/subsectionList',
            component: () => import('@/views/course-manage/fund/subsectionList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '基金课程目录'
            },
            path: 'fund/tableOfContentsList',
            component: () => import('@/views/course-manage/fund/tableOfContentsList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '保险课程小节'
            },
            path: 'Insurance/subsectionList',
            component: () => import('@/views/course-manage/Insurance/subsectionList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '保险课程目录'
            },
            path: 'Insurance/tableOfContentsList',
            component: () => import('@/views/course-manage/Insurance/tableOfContentsList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '听书课程'
            },
            path: 'listenToBooks/add',
            component: () => import('@/views/course-manage/listenToBooks/add.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '听书课程'
            },
            path: 'listenToBooks/edit',
            component: () => import('@/views/course-manage/listenToBooks/edit.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '听书课程'
            },
            path: 'listenToBooks/list',
            component: () => import('@/views/course-manage/listenToBooks/list.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '小白课程'
            },
            path: 'noob/subsectionList',
            component: () => import('@/views/course-manage/noob/subsectionList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '小白课程'
            },
            path: 'noob/tableOfContentsList',
            component: () => import('@/views/course-manage/noob/tableOfContentsList.vue')
        }, {
            meta: {
                groupId,
                title: '其他课程'
            },
            path: 'other/subsectionList',
            component: () => import('@/views/course-manage/other/subsectionList.vue')
        }, {
            meta: {
                groupId,
                id: '6',
                title: '其他课程'
            },
            path: 'other/tableOfContentsList',
            component: () => import('@/views/course-manage/other/tableOfContentsList.vue')
        }, {
            meta: {
                groupId,
                id: '060101',
                title: '课程设置'
            },
            path: 'setting/list',
            component: () => import('@/views/course-manage/setting/list.vue')
        }, {
            meta: {
                groupId,
                id: '03020101',
                title: '课程设置查看'
            },
            path: 'setting/edit', // 添加Banner
            component: () => import('@/views/course-manage/setting/edit.vue')
        }]
    }
];
