<template>
    <div class="hbb-order-page">
        <h2>我的订单</h2>
        <div class="box hbb-scoller-content">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp"  html-nodata="没有更多数据"
                          @init="mescrollInit"
            >
            <div class="group" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
                <img :src="item.courseImgUrl" alt="">
                <div class="right">
                    <h2 class="ellipsis">{{item.productName}}</h2>
                    <div class="bottom">
                        <b>¥{{item.amount | money}}</b><span>{{['初级', '进阶', '小白', '其他'][item.courseLevel]}}</span>
                    </div>
                    <p class="ellipsis">购买时间：{{item.createTime}}</p>
                    <p class="ellipsis" style="display:flex;align-items:center">订单编号：<span class="ellipsis" style="width: 70%;overflow: hidden">{{item.orderNo}}</span></p>
                </div>
                <img class="c" src="@assets/images/ywc.png" alt="" v-if="item.status === 1">
                <img class="c" src="@assets/images/ytf.png" alt="" v-if="item.status === -1">
            </div>
            </mescroll-vue>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal.ts";
    import dataListMixins from "@/mixins/dataListMixins";

    @Component({})
    export default class  extends dataListMixins {
        dataList:any[] = [];

        mounted() {
            this.getData(1);
        }

        async getData(page: number) {
            PersonalModule.getOrderList(page).then((res:any) => {
                this.page = page;
                const data = res?.data || {};
                if (this.page === 1) {
                    this.dataList = [];
                }
                this.dataList = this.dataList.concat(data?.result);
                this.handleRefresh(true, data.totalPage > data.pageNo);
            }).catch((err:string) => {
                // this.$toast(err);
                this.handleRefresh(false);
            });
        }

        goDetail(item:any) {
            // 去详情页面
            this.$router.push({
                path: '/personal/orderDetail',
                query: {
                    id: String(item.orderId)
                }
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
        padding: 0 30px;
        display: flex;
        width: 100%;
        flex-direction: column;
        .group{
            display: flex;
            width: 100%;
            margin-top: 25px;
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
                    margin-bottom: 10px;
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
                    *{
                        margin-right: 20px;
                        font-size: 26px;
                        color: #666;
                    }
                    b{
                        color: $color-main;
                        font-size: 32px;
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
                @include ellipsis(1);
            }

            .ellipsis{
                @include ellipsis(1);
            }
        }
    }
}
</style>
