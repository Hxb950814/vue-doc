import { redirectMake } from '../tools';
import Layout from '@/views/layout/Layout.vue';
const groupId = '03'; // 大id

/* 运营模块的路由 */
export default [
    redirectMake('/operate_manage', '/operate_manage/index'),
    {
        path: '/operate_manage',
        component: Layout,
        meta: {
            title: '运营模块'
        },
        children: [{
            meta: {
                groupId,
                id: '03',
                title: '运营中心'
            },
            path: 'index', // 欢迎页
            component: () => import('@/views/operate-manage/index.vue')
        }, {
            meta: {
                groupId,
                id: '030101',
                title: '文章管理'
            },
            path: 'articles/list', // 文章管理
            component: () => import('@/views/operate-manage/articles/list.vue')
        }, {
            meta: {
                groupId,
                id: '03010101',
                title: '添加文章'
            },
            path: 'articles/add', // 添加文章
            component: () => import('@/views/operate-manage/articles/add.vue')
        }, {
            meta: {
                groupId,
                id: '03010102',
                title: '查看文章'
            },
            path: 'articles/edit', // 查看文章
            component: () => import('@/views/operate-manage/articles/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030201',
                title: '图片管理'
            },
            path: 'pictures/list', // 图片管理
            component: () => import('@/views/operate-manage/pictures/list.vue')
        }, {
            meta: {
                groupId,
                id: '03020101',
                title: '添加Banner'
            },
            path: 'pictures/add', // 添加Banner
            component: () => import('@/views/operate-manage/pictures/add.vue')
        }, {
            meta: {
                groupId,
                id: '03020102',
                title: '查看Banner'
            },
            path: 'pictures/edit', // 查看Banner
            component: () => import('@/views/operate-manage/pictures/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030301',
                title: 'Icon管理'
            },
            path: 'icons/list', // Icon管理
            component: () => import('@/views/operate-manage/icons/list.vue')
        }, {
            meta: {
                groupId,
                id: '03030101',
                title: '添加Icon'
            },
            path: 'icons/add', // 添加Icon
            component: () => import('@/views/operate-manage/icons/add.vue')
        }, {
            meta: {
                groupId,
                id: '03030102',
                title: '查看Icon'
            },
            path: 'icons/edit', // 查看Icon
            component: () => import('@/views/operate-manage/icons/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030501',
                title: '短信记录'
            },
            path: 'sms/record/list', // 短信记录
            component: () => import('@/views/operate-manage/sms/recordList.vue')
        }, {
            meta: {
                groupId,
                id: '03050101',
                title: '查看短信记录'
            },
            path: 'sms/record/edit', // 查看短信
            component: () => import('@/views/operate-manage/sms/recordEdit.vue')
        }, {
            meta: {
                groupId,
                id: '030502',
                title: '短信场景'
            },
            path: 'sms/scene/list', // 短信场景
            component: () => import('@/views/operate-manage/sms/sceneList.vue')
        }, {
            meta: {
                groupId,
                id: '03050201',
                title: '添加短信场景'
            },
            path: 'sms/scene/add', // 查看短信
            component: () => import('@/views/operate-manage/sms/sceneAdd.vue')
        }, {
            meta: {
                groupId,
                id: '03050202',
                title: '查看短信场景'
            },
            path: 'sms/scene/edit', // 查看短信
            component: () => import('@/views/operate-manage/sms/sceneEdit.vue')
        }, {
            meta: {
                groupId,
                id: '030601',
                title: '常见问题'
            },
            path: 'common_questions/list', // 常见问题
            component: () => import('@/views/operate-manage/questions/commonList.vue')
        }, {
            meta: {
                groupId,
                id: '03060101',
                title: '添加常见问题'
            },
            path: 'common_questions/add', // 常见问题
            component: () => import('@/views/operate-manage/questions/commonAdd.vue')
        }, {
            meta: {
                groupId,
                id: '03060102',
                title: '查看常见问题'
            },
            path: 'common_questions/edit', // 查看常见问题
            component: () => import('@/views/operate-manage/questions/commonEdit.vue')
        }, {
            meta: {
                groupId,
                id: '030602',
                title: '问题分类'
            },
            path: 'questions_category/list', // 问题分类
            component: () => import('@/views/operate-manage/questions/categoryList.vue')
        }, {
            meta: {
                groupId,
                id: '03060201',
                title: '添加问题分类'
            },
            path: 'questions_category/add', // 常见问题
            component: () => import('@/views/operate-manage/questions/categoryAdd.vue')
        }, {
            meta: {
                groupId,
                id: '03060202',
                title: '查看问题分类'
            },
            path: 'questions_category/edit', // 查看常见问题
            component: () => import('@/views/operate-manage/questions/categoryEdit.vue')
        }, {
            meta: {
                groupId,
                id: '030701',
                title: '意见反馈'
            },
            path: 'suggestions/list', // 意见反馈
            component: () => import('@/views/operate-manage/suggestions/list.vue')
        }, {
            meta: {
                groupId,
                id: '03070101',
                title: '查看意见反馈'
            },
            path: 'suggestions/check', // 查看意见反馈
            component: () => import('@/views/operate-manage/suggestions/check.vue')
        }, {
            meta: {
                groupId,
                id: '03070102',
                title: '处理意见反馈'
            },
            path: 'suggestions/edit', // 处理意见反馈
            component: () => import('@/views/operate-manage/suggestions/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030401',
                title: '公告管理'
            },
            path: 'notices/list', // 公告管理
            component: () => import('@/views/operate-manage/notices/list.vue')
        }, {
            meta: {
                groupId,
                id: '03040101',
                title: '添加公告'
            },
            path: 'notices/add', // 添加公告
            component: () => import('@/views/operate-manage/notices/add.vue')
        }, {
            meta: {
                groupId,
                id: '03040102',
                title: '查看公告'
            },
            path: 'notices/edit', // 查看公告
            component: () => import('@/views/operate-manage/notices/edit.vue')
        }, {
            meta: {
                groupId,
                id: '030801',
                title: '页面ID'
            },
            path: 'page_id/list', // 查看页面id
            component: () => import('@/views/operate-manage/page-id/list.vue')
        }, {
            meta: {
                groupId,
                id: '03080101',
                title: '添加页面ID'
            },
            path: 'page_id/add', // 添加页面ID
            component: () => import('@/views/operate-manage/page-id/add.vue')
        }, {
            meta: {
                groupId,
                id: '030901',
                title: '版本管理'
            },
            path: 'version/list', // 版本管理
            component: () => import('@/views/operate-manage/version/list.vue')
        }, {
            meta: {
                groupId,
                id: '03080102',
                title: '查看页面ID'
            },
            path: 'page_id/edit', // 添加页面ID
            component: () => import('@/views/operate-manage/page-id/edit.vue')
        }, {
            meta: {
                groupId,
                id: '031001',
                title: '弹窗管理'
            },
            path: 'modal/list', // 版本管理
            component: () => import('@/views/operate-manage/modal/list.vue')
        }, {
            meta: {
                groupId,
                id: '03100101',
                title: '添加弹窗'
            },
            path: 'modal/add', // 版本管理
            component: () => import('@/views/operate-manage/modal/add.vue')
        }, {
            meta: {
                groupId,
                id: '03100102',
                title: '查看弹窗'
            },
            path: 'modal/edit', // 版本管理
            component: () => import('@/views/operate-manage/modal/edit.vue')
        }]
    }
];
