<template>
    <div class="takeout-box">
        <scroller
            delegate-id="myScroller"
            :on-refresh="refresh"
            :on-infinite="infinite"
            ref="myscroller"
            no-data-text="已经到底了哦~"
            class="scroller-box"
        >
            <slot></slot>
        </scroller>
    </div>
</template>

<script>
    import {HomeModule} from "@/store/modules/user/home";
    import {KnowledgeModule} from "@/store/modules/user/knowledge";
    import {PersonalModule} from "@/store/modules/user/personal";


    export default {
        name: "scrollVue",
        props:{
            requestObj: {
                type: Object,
                default: {}
            },
            pageMode: {
                type: String,
                default: '1'
            }

        },
        data() {
            return {
                list: [],
                page: 1, //当前页
                total: 1 //当前页
            };
        },
        mounted() {
            this.allOrderList();

        },
        methods: {
            //获取初始数据
            allOrderList(res) {
                let that = this;
                let fn;
                switch (this.pageMode) {
                    case '1':
                        // 听书列表
                        fn = HomeModule.getQueryListenCourseListPage;
                        break;
                    case '2':
                        // 问题分类列表
                        fn = KnowledgeModule.getQueryQuestionTypeListPage;
                        break;
                    case '3':
                        // 问题列表
                        fn = KnowledgeModule.getQueryQuestionListPage;
                        break;
                    case '4':
                        // 公告消息列表
                        fn = PersonalModule.getAfficheList;
                        break;
                    case '5':
                        // 非公告消息列表
                        fn = PersonalModule.queryMessageNoticeList;
                        break;
                    case '6':
                        // 提现列表
                        fn = PersonalModule.getWithdrawList;
                        break;
                    case '7':
                        // 兑换记录列表
                        fn = PersonalModule.getUserGoodsOrderListPage;
                        break;
                    case '8':
                        // 优惠券列表
                        fn = PersonalModule.getUserCouponListPage;
                        break;
                    case '9':
                        // 商品优惠券列表
                        fn = HomeModule.getUserCoupon;
                        break;
                    default:
                        break;
                };
                let obj;
                if(res) {
                    obj = res;
                } else {
                    obj = this.requestObj;
                }
                fn(obj).then(res => {
                    let dataRes = res.data;
                    if (that.requestObj.page === 1) {
                        that.list = [];
                    }
                    that.total = dataRes.totalPage;
                    that.list = that.list.concat(dataRes.result);
                    that.$emit('getData', this.list)
                });
            },
            // 下拉刷新
            refresh() {
                this.requestObj.page = 1;
                setTimeout(
                    function() {
                        this.allOrderList();
                        console.log("我是上拉加载");
                        this.$refs.myscroller.finishPullToRefresh(); //刷新完毕关闭刷新的转圈圈
                    }.bind(this),
                    700
                );
            },
            // 上拉加载
            infinite(done) {
                if (this.requestObj.page >= this.total) {
                    //若当前页码大于或等于总页码，则不再加载数据，提示没有更多数据
                    this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
                } else {
                    setTimeout(() => {
                        this.requestObj.page++; //下拉一次页数+1
                        this.allOrderList();
                        done(); //进行下一次加载操作
                    }, 1500);
                }
            }
        }
    };
</script>
<style lang="scss">
    .no-data-text{
        font-size: 24px !important;
    }
</style>
