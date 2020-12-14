<template>
    <div class="pageBox hbb-order-page">
        <div class="box">
            <div class="group" v-for="(item, index) in newsList" :key="index" @click="goDetail(item)">
                <div class="right">
                    <div class="a">
                        <h2 class="ellipsis">兑换成功</h2>
                        <p class="ellipsis">2020-09-27 10:00:00</p>
                    </div>
                    <div class="b">
                        您于2020-09-27 10:00:00兑换的100元优惠券，以发放至您的账户，本次兑换使用1000喵币。
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        isRead = true;
        newsList:any[] =[
            {title: '平台公告', desc: '国庆节放假公告'},
            {title: '课程通知', desc: '您所在班级：基金小白课1班，请联系班主任办理学习事项'},
            {title: '订单通知', desc: '暂无订单消息'},
            {title: '积分商城', desc: '你成功兑换了100元优惠券'},
            {title: '反馈通知', desc: '你的信息有新的反馈'}
        ];

        goDetail(item:any) {
            // 去详情页面
            this.$router.push({
                path: '/personal/orderDetail'
            })
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-order-page{
        background: #f6f6f6;
        .box{
            padding: 0 30px;
            display: flex;
            width: 100%;
            flex-direction: column;
            .group{
                display: flex;
                width: 100%;
                margin-top: 25px;
                position: relative;
                align-items: center;
                background: #fff;
                border-radius: 8px;
                .right{
                    padding:10px 20px;
                    width: 100%;
                    .a{
                        width: 100%;
                        justify-content: space-between;
                        align-items: center;
                        display: flex;
                        padding-bottom: 10px;
                        h2{
                            font-size: 30px;
                            font-weight: normal;
                            color: #333;
                        }
                    }
                    .b{
                        margin-top: 10px;
                        width: 100%;
                        font-size: 26px;
                        span{
                            float: left;
                            width: 50%;
                            margin-top: 10px;
                        }
                    }
                }
                p{
                    font-size: 24px;
                    color: #666;
                    margin-top: 10px;
                    @include ellipsis(1)
                }
            }
        }
    }
</style>
