<template>
    <div class="pageBox hbb-order-page">
        <div class="box">
            <div class="hbb-content">
                <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="5" @getData="getData"
                >
                    <div class="group" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
                        <div class="right">
                            <div class="a">
                                <p class="ellipsis">{{item.createTime}}</p>
                                <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
                            </div>
                            <div class="b">
                                <span>
                                    订单编号：{{setSubString(JSON.parse(item.content).orderNo)}}
                                </span>
                                <span>
                                    购买课程：{{JSON.parse(item.content).courseName}}
                                </span>
                                <span>
                                    支付金额：{{JSON.parse(item.content).amount}}
                                </span>
                                <span>
                                    支付通道：{{JSON.parse(item.content).paymentType}}
                                </span>
                            </div>
                        </div>
                    </div>
                </VueScroller>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import VueScroller from "@/components/vantScroll/scrollVue.vue";
    import { getSubString } from "@/utils/index.ts"
    @Component({
        components:{
            VueScroller
        }
    })
    export default class extends Vue {
        dataList:any = [];

        requestObj = {};

        created() {
            this.requestObj = {
                page: 1,
                messageType:  String(this.$route.query.id)
            }
        }

        setSubString(str:any){
            return getSubString(str)
        }

        getData(res: any) {
            this.dataList = res;
        }

        goDetail(item:any) {
            // 去详情页面
            this.$router.push({
                path: '/personal/orderDetail',
                query:{
                    id: item.messageId
                }
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
                        border-bottom: 2px solid #eee;
                        padding-bottom: 10px;
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
    .hbb-content{
        height: 100vh;
    }
</style>
