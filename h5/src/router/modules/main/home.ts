// @ts-ignore
const Main = () => import('@/views/main/home') // 用户 view
const HomeView = () => import('@/views/main/home/index/index.vue') // 首页
const ListenToBooksView = () => import('@/views/main/home/homeTopNav/listenToBooks.vue') // 每日听书
const FraudPreventionView = () => import('@/views/main/home/homeTopNav/fraudPrevention.vue') // 防诈骗查询
const NewGuideView = () => import('@/views/main/home/homeTopNav/newGuide.vue') // 打新指南
const NewGuideDetailView = () => import('@/views/main/home/homeTopNav/guideDetail/detail.vue') // 打新指南详情

const ListenDetailView = () => import('@/views/main/home/homeTopNav/listen/detail.vue') // 每日听书详情
const CurriculumView = () => import('@/views/main/home/index/curriculumDetail.vue') // 课程详情 - [首页]
const SeekCurriculumView = () => import('@/views/main/home/index/seekCurriculumDetail.vue') // 课程详情 - [求知]
const AuditionView = () => import('@/views/main/home/index/curriculumView/audition.vue') // 课程音频页面
const LookVideoView = () => import('@/views/main/home/index/curriculumView/lookVideo.vue') // 课程视频页面
const OrderInfoView = () => import('@/views/main/home/index/orderInfo/index.vue') // 订单详情
const PaySuccessView = () => import('@/views/main/home/index/orderInfo/paySuccess.vue') // 订单支付成功页面

const userModule = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                component: HomeView,
            },

            {
                path: '/home',
                name: 'home',
                component: HomeView,
                meta: {
                    title: '首页',
                    auth: false
                }
            },
            {
                path: '/home/listenToBooks',
                name: 'listenToBooks',
                component: ListenToBooksView,
                meta: {
                    title: '每日听书',
                    auth: false
                }
            },
            {
                path: '/home/listenDetail',
                name: 'listenDetail',
                component: ListenDetailView,
                meta: {
                    title: '听书详情',
                    auth: true
                }
            },
            {
                path: '/home/fraudPrevention',
                name: 'fraudPrevention',
                component: FraudPreventionView,
                meta: {
                    title: '防诈骗查询',
                    auth: false
                }
            },
            {
                path: '/home/newGuide',
                name: 'newGuide',
                component: NewGuideView,
                meta: {
                    title: '打新指南',
                    auth: false
                }
            },
            {
                path: '/home/curriculum',
                name: 'curriculum',
                component: CurriculumView,
                meta: {
                    title: '课程详情',
                    auth: true
                }
            },
            {
                path: '/home/seekCurriculum',
                name: 'seekCurriculum',
                component: SeekCurriculumView,
                meta: {
                    title: '课程详情',
                    auth: true
                }
            },

            {
                path: '/home/guideDetail',
                name: 'guideDetail',
                component: NewGuideDetailView,
                meta: {
                    title: '打新指南详情',
                    auth: false
                }
            },
            {
                path: '/home/orderInfo',
                name: 'orderInfo',
                component: OrderInfoView,
                meta: {
                    title: '订单详情',
                    auth: true
                }
            },
            {
                path: '/home/orderInfo/paySuccess',
                name: 'orderInfo/paySuccess',
                component: PaySuccessView,
                meta: {
                    title: '订单支付成功',
                    auth: false
                }
            },
            {
                path: '/home/audition',
                name: 'audition',
                component: AuditionView,
                meta: {
                    title: '音频页面',
                    auth: false
                }
            },
            {
                path: '/home/lookVideo',
                name: 'lookVideo',
                component: LookVideoView,
                meta: {
                    title: '视频页面',
                    auth: false
                }
            }


        ]
    }
]
export default userModule
