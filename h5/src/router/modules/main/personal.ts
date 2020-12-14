// @ts-ignore
const Main = () => import('@/views/main/personal') // 用户 view
const PersonalView = () => import('@/views/main/personal/index/index.vue') // 首页

const SettingsView = () => import('@/views/main/personal/settings/index.vue') // 个人设置页面
const InfoView = () => import('@/views/main/personal/settings/contentView/info.vue') // 个人信息页面
const PhoneView = () => import('@/views/main/personal/settings/contentView/phone.vue') // 绑定手机页面
const AboutView = () => import('@/views/main/personal/settings/contentView/about.vue') // 关于页面
const HelpView = () => import('@/views/main/personal/settings/contentView/help.vue') // 帮助中心
const HelpViewList = () => import('@/views/main/personal/settings/contentView/helpView/list.vue') // 帮助中心
const AddressView = () => import('@/views/main/personal/settings/contentView/address.vue') // 我的地址
const EditAddressView = () => import('@/views/main/personal/settings/contentView/editAddress.vue') // 我的地址 - 编辑

const FeedbackView = () => import('@/views/main/personal/settings/contentView/feedback.vue') // 意见反馈

const WalletView = () => import('@/views/main/personal/index/wallet/index.vue') // 我的钱包
const WithWalletView = () => import('@/views/main/personal/index/wallet/withdraw.vue') // 我的钱包 - 提现
const WalletRecordView = () => import('@/views/main/personal/index/wallet/detail.vue') // 我的钱包 - 资金记录
const WalletRecordingView = () => import('@/views/main/personal/index/wallet/recording.vue') // 我的钱包 - 提现记录

const MeowCoinMoreView = () => import('@/views/main/personal/index/meowCoin/more.vue') // 我的喵币[更多]
const ExchangeView = () => import('@/views/main/personal/index/meowCoin/exchange.vue') // 兑换物品页面
const ExchangeOrderView = () => import('@/views/main/personal/index/meowCoin/exchangeOrder.vue') // 兑换物品页面

const CouponView = () => import('@/views/main/personal/index/coupon/index.vue') // 我的优惠券
const NewsView = () => import('@/views/main/personal/index/news/index.vue') // 消息页面
const AnnouncementView = () => import('@/views/main/personal/index/news/announcement.vue') // 消息-公告
const NewDetailView = () => import('@/views/main/personal/index/news/newDetail.vue') // 消息-公告详情
const CourseView = () => import('@/views/main/personal/index/news/course.vue') // 消息-课程
const OrderNewsView = () => import('@/views/main/personal/index/news/order.vue') // 消息-订单
const IntegralView = () => import('@/views/main/personal/index/news/integral.vue') // 消息-积分商品
const FeedbackNewsView = () => import('@/views/main/personal/index/news/feedback.vue') // 消息-反馈通知

const OrderView = () => import('@/views/main/personal/index/order/index.vue') // 我的订单
const OrderDetailView = () => import('@/views/main/personal/index/order/detail.vue') // 我的订单

const InviteView = () => import('@/views/main/personal/index/invite/index.vue') // 邀请好友
const MyFriendView = () => import('@/views/main/personal/index/invite/myFriend.vue') // 我的好友

const ClockInView = () => import('@/views/main/personal/clockIn/everyDay.vue') // 每日打卡
const MyIntegralView = () => import('@/views/main/personal/integral/index.vue') // 我的积分
const MyIntegralViewDetail = () => import('@/views/main/personal/integral/detail.vue') // 我的积分明细

const userModule = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                redirect: '/personal',
                name: 'personal'
            },
            {
                path: '/personal', // 我的
                name: 'personal',
                component: PersonalView,
                meta: {
                    title: '我的',
                    auth: false
                }
            },
            {
                path: '/personal/settings', // 个人设置页面
                name: 'settings',
                component: SettingsView,
                meta: {
                    title: '个人资料',
                    auth: false
                }
            },
            {
                path: '/personal/info', // 个人信息页面
                name: 'info',
                component: InfoView,
                meta: {
                    title: '个人信息',
                    auth: true
                }
            },
            {
                path: '/personal/phone', // 个人信息页面
                name: 'phone',
                component: PhoneView,
                meta: {
                    title: '绑定手机',
                    auth: true
                }
            },
            {
                path: '/personal/order', // 我的订单页面
                name: 'order',
                component: OrderView,
                meta: {
                    title: '我的订单',
                    auth: true
                }
            },
            {
                path: '/personal/orderDetail',
                name: 'orderDetail',
                component: OrderDetailView,
                meta: {
                    title: '订单详情',
                    auth: true
                }
            },
            {
                path: '/personal/about',
                name: 'about',
                component: AboutView,
                meta: {
                    title: '关于软件',
                    auth: false
                }
            },
            {
                path: '/personal/help',
                name: 'help',
                component: HelpView,
                meta: {
                    title: '问题分类列表',
                    auth: false
                }
            },
            {
                path: '/personal/help/list',
                name: 'help/list',
                component: HelpViewList,
                meta: {
                    title: '问题列表',
                    auth: false
                }
            },

            {
                path: '/personal/feedback',
                name: 'feedback',
                component: FeedbackView,
                meta: {
                    title: '意见反馈',
                    auth: true
                }
            },
            {
                path: '/personal/address',
                name: 'address',
                component: AddressView,
                meta: {
                    title: '我的地址',
                    auth: false
                }
            },
            {
                path: '/personal/editAddress',
                name: 'editAddress',
                component: EditAddressView,
                meta: {
                    title: '编辑我的地址',
                    auth: false
                }
            },
            {
                path: '/personal/wallet',
                name: 'wallet',
                component: WalletView,
                meta: {
                    title: '我的钱包',
                    auth: false
                }
            },
            {
                path: '/personal/withdraw',
                name: 'withdraw',
                component: WithWalletView,
                meta: {
                    title: '提现',
                    auth: false
                }
            },
            {
                path: '/personal/wallet/record',
                name: 'walletRecord',
                component: WalletRecordView,
                meta: {
                    title: '资金记录',
                    auth: false
                }
            },
            {
                path: '/personal/wallet/recording',
                name: 'walletRecording',
                component: WalletRecordingView,
                meta: {
                    title: '提现金额记录',
                    auth: false
                }
            },
            {
                path: '/personal/shop',
                name: 'shop',
                component: MeowCoinMoreView,
                meta: {
                    title: '积分商城',
                    auth: false
                }
            },
            {
                path: '/personal/exchange',
                name: 'exchange',
                component: ExchangeView,
                meta: {
                    title: '兑换商品',
                    auth: false
                }
            },
            {
                path: '/personal/exchangeOrder',
                name: 'exchangeOrder',
                component: ExchangeOrderView,
                meta: {
                    title: '兑换订单',
                    auth: false
                }
            },
            {
                path: '/personal/coupon',
                name: 'coupon',
                component: CouponView,
                meta: {
                    title: '我的优惠券',
                    auth: false
                }
            },
            {
                path: '/personal/invite',
                name: 'invite',
                component: InviteView,
                meta: {
                    title: '邀请好友',
                    auth: false
                }
            },
            {
                path: '/personal/myFriend',
                name: 'myFriend',
                component: MyFriendView,
                meta: {
                    title: '我的好友',
                    auth: false
                }
            },

            {
                path: '/personal/news',
                name: 'news',
                component: NewsView,
                meta: {
                    title: '消息中心',
                    auth: false
                }
            },
            {
                path: '/personal/announcement',
                name: 'announcement',
                component: AnnouncementView,
                meta: {
                    title: '公告消息',
                    auth: false
                }
            },
            {
                path: '/personal/newDetail',
                name: 'personal/newDetail',
                component: NewDetailView,
                meta: {
                    title: '公告消息详情',
                    auth: false
                }
            },

            {
                path: '/personal/course',
                name: 'course',
                component: CourseView,
                meta: {
                    title: '课程消息',
                    auth: false
                }
            },
            {
                path: '/personal/orderNews',
                name: 'orderNews',
                component: OrderNewsView,
                meta: {
                    title: '订单消息',
                    auth: false
                }
            },
            {
                path: '/personal/integral',
                name: 'integral',
                component: IntegralView,
                meta: {
                    title: '积分消息',
                    auth: false
                }
            },
            {
                path: '/personal/feedbackNews',
                name: 'feedbackNews',
                component: FeedbackNewsView,
                meta: {
                    title: '反馈消息',
                    auth: false
                }
            },
            {
                path: '/personal/clockIn',
                name: 'clockIn',
                component: ClockInView,
                meta: {
                    title: '每日打卡',
                    auth: false
                }
            },
            {
                path: '/personal/myIntegral',
                name: 'myIntegral',
                component: MyIntegralView,
                meta: {
                    title: '我的积分',
                    auth: false
                }
            },
            {
                path: '/personal/myIntegralDetail',
                name: 'myIntegralDetail',
                component: MyIntegralViewDetail,
                meta: {
                    title: '积分明细',
                    auth: false
                }
            }
        ]
    }
]
export default userModule
