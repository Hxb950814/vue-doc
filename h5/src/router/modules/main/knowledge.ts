// @ts-ignore
const Main = () => import('@/views/main/knowledge') // 用户 view
const KnowledgeView = () => import('@/views/main/knowledge/index/index.vue') // 首页
const LearningCircleView = () => import('@/views/main/knowledge/learningCircle/index.vue') // 学习圈子
const MyClassView = () => import('@/views/main/knowledge/index/myClass.vue') // 学习圈子
const ArticleView = () => import('@/views/main/knowledge/article/index.vue') // 文章
const ArticleDetailView = () => import('@/views/main/knowledge/article/detail.vue') // 文章内容
const MyIndexListView = () => import('@/views/main/knowledge/article/myIndexList.vue') // 我的收藏列表

const userModule = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                redirect: '/knowledge',
                name: 'knowledge'
            },
            {
                path: '/knowledge', // 求知
                name: 'knowledge',
                component: KnowledgeView,
                meta: {
                    title: '求知',
                    auth: false
                }
            },
            {
                path: '/knowledge/learningCircle', // 求知
                name: 'knowledge/learningCircle',
                component: LearningCircleView,
                meta: {
                    title: '学习圈子',
                    auth: false
                }
            },
            {
                path: '/knowledge/article', // 求知
                name: 'knowledge/article',
                component: ArticleView,
                meta: {
                    title: '文章列表',
                    auth: false
                }
            },
            {
                path: '/knowledge/articleDetail', // 求知
                name: 'knowledge/articleDetail',
                component: ArticleDetailView,
                meta: {
                    title: '文章详情',
                    auth: false
                }
            },
            {
                path: '/knowledge/MyIndexList', // 求知
                name: 'knowledge/MyIndexList',
                component: MyIndexListView,
                meta: {
                    title: '我的收藏',
                    auth: false
                }
            },
            {
                path: '/knowledge/myClass', // 求知
                name: 'knowledge/myClass',
                component: MyClassView,
                meta: {
                    title: '我的班级',
                    auth: true
                }
            }

        ]
    }
]
export default userModule
