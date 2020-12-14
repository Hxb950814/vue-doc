<template>
    <div class="hbb-order-page">
        <h2>订单详情</h2>
        <div class="box">
            <div class="group">
                <img :src="pageData.courseImgUrl" alt="">
                <div class="right">
                    <h2 class="ellipsis">{{pageData.productName}}</h2>
                    <p class="ellipsis">{{pageData.courseDescribe}}</p>
                    <div class="tab">
                        <span>{{['初级', '进阶', '小白', '其他'][pageData.courseLevel]}}</span>
                    </div>
                    <div class="bottom">
                        <b>¥{{pageData.totalAmount | money}}</b>
                    </div>
                </div>
            </div>
            <div class="info">
                <p>订单编号：{{pageData.orderNo}}</p>
                <p>订单状态：<span>{{pageData.status === 1 ? '已完成' : '已退费'}}</span></p>
                <p>购买时间：{{pageData.createTime}}</p>
                <p>支付方式：{{pageData.passagewayId === 3 ? '微信支付' : '支付宝支付'}}</p>
            </div>
            <div class="moreInfo">
                <p>
                    <span>商品金额：</span>
                    <span class="a">¥ {{pageData.totalAmount | money}}</span>
                </p>
                <p>
                    <span>优惠金额：</span>
                    <span class="b">¥ {{pageData.discountAmount | money}}</span>
                </p>
                <p>
                    <span>实付款：</span>
                    <span class="c">¥ {{pageData.amount | money}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal.ts";

    @Component({})
    export default class extends Vue {
        id:string = '';

        pageData:any = {
            courseImgUrl: '',
            amount: 0,
            courseLevel: '',
            createTime: '',
            orderNo: '',
            orderId: 0,
            orderType: 1,
            passagewayId: 3,
            productName: '',
            status: '',
            totalAmount: 0,
            discountAmount: 0,
            courseDescribe: ''
        }

        mounted() {
            this.id = String(this.$route.query.id);
            PersonalModule.getOrderInfo(this.id).then((res:any) => {
                this.pageData.courseImgUrl = res?.data.courseImgUrl;
                this.pageData.amount = res?.data.amount;
                this.pageData.courseLevel = res?.data.courseLevel;
                this.pageData.orderNo = res?.data.orderNo;
                this.pageData.createTime = res?.data.createTime;
                this.pageData.courseDescribe = res?.data.courseDescribe;

                this.pageData.orderId = res?.data.orderId;
                this.pageData.orderType = res?.data.orderType;
                this.pageData.passagewayId = res?.data.passagewayId;
                this.pageData.productName = res?.data.productName;
                this.pageData.status = res?.data.status;
                this.pageData.totalAmount = res?.data.totalAmount;
                this.pageData.discountAmount = res?.data.discountAmount;
            })

        }

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
        h2{
            background-color: #f6f6f6;
            font-size: 24px;
            color: #333;
            display: flex;
            width: 100%;
            height: 75px;
            font-weight: normal;
            padding: 0 30px;
            align-items: center;
        }
        .box{

            display: flex;
            width: 100%;
            flex-direction: column;
            .group{
                display: flex;
                width: 100%;
                margin-top: 25px;
                padding: 0 30px;
                position: relative;
                img{
                    width: 170px;
                    height: 200px;
                    border-radius: 20px;
                    &.c{
                        width: 120px;
                        position: absolute;
                        top: 20px;
                        right: 0;
                        height: 120px;
                    }
                }
                .right{
                    display: flex;
                    flex-direction: column;
                    padding:10px 20px;
                    h2{
                        font-size: 30px;
                        height: auto;
                        color: $base-font-color;
                        margin-bottom: 10px;
                        background: none;
                        padding: 0;
                        @include ellipsis(1);
                    }

                    .tab{
                        width: 100%;
                        margin-top: 10px;
                        span{
                            padding:5px 20px;
                            margin-right: 10px;
                            border-radius: 30px;
                            font-size: 22px;
                            color: $color-ff9600;
                            background-color:#f6f6f6;
                        }
                    }
                    .bottom{
                        display: flex;
                        width: 100%;
                        align-items: center;
                        margin-top: 10px;
                        *{
                            margin-right: 20px;
                            font-size: 26px;
                            color: #666;
                        }
                        b{
                            color: $color-gray;
                            font-size: 32px;
                            font-weight: normal;
                        }
                        span{
                            padding:5px 20px;
                            margin-right: 10px;
                            border-radius: 30px;
                            font-size: 22px;
                            color: $color-ff9600;
                            background-color:#f6f6f6;
                        }
                    }

                }
                p{
                    font-size: 24px;
                    color: #666;
                    margin-top: 10px;
                    &:nth-of-type(1){
                        margin-top: 0;
                    }
                }
            }
            .info{
                display: flex;
                width: 100%;
                flex-direction: column;
                padding: 0 30px;
                margin-top: 20px;
                border-bottom: 2px solid #ddd;
                padding-bottom: 30px;
                p{
                    display: flex;
                    height: 50px;
                    width: 100%;
                    align-items: center;
                    color: #666;
                    font-size: 26px;
                    span{
                        height: 38px;
                        display: flex;
                        border: 2px solid #ddd;
                        font-size: 24px;
                        color: #999999;
                        border-radius: 20px;
                        justify-content: center;
                        align-items: center;
                        padding: 0 16px;
                    }
                }
            }
        }
        .moreInfo{
            display: flex;
            width: 100%;
            flex-direction: column;
            padding: 0 30px;
            margin-top: 20px;
            p{
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                color: #333;
                font-size: 26px;
                margin-top: 20px;
                span{

                    &.a{
                        color: #666;
                        fons-size:28px;
                    }
                    &.b{
                        color: #999;
                        fons-size:26px;
                    }
                    &.c{
                        color: $color-main;
                        font-size:32px;
                        font-weight: bold;
                    }
                }
            }
        }
    }
</style>
