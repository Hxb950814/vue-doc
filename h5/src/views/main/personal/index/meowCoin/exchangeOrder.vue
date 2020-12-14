<template>
    <div class="pageBox">
        <div class="hbb-exchange-order">
            <h2 class="top">
                兑换订单
            </h2>
            <div class="box">
                <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="7" @getData="getData"
                >
                <div class="group" v-for="(item,index) in dataList" :key="index">
                    <div class="t">
                        <div class="l" style="border: 1px solid #eee">
                            <template v-if="item.goods_image">
                                <img :src="item.goods_image" alt="" />
                            </template>
                            <template v-else>
                                <img src="@assets/images/d-o-y.png" alt="" v-if="item.goods_type === 0" />
                                <img src="@assets/images/shopdefault.png" alt="" v-if="item.goods_type === 1"  />
                            </template>
                        </div>
                        <div class="r">
                            <h2>{{item.goods_name}}</h2>
                            <p>
                                <span>{{ ['待发货', '已发货', '已完成', '已退货'][item.status] }}</span>
                                <b>{{item.logisticsCompanies}} {{item.LogisticsOrderNo}}</b>
                            </p>
                            <p class="o">订单编号：{{item.goods_order_no}}</p>
                            <p>使用积分：{{item.score}}</p>
                            <p>兑换时间：{{item.create_time}}</p>
                        </div>
                    </div>
                    <div class="b" v-if="item.goods_type === 1">
                        <h3>
                            <small></small>
                            <b>{{item.name}}</b>
                            <span>{{item.mobile}}</span>
                        </h3>
                        <p>{{item.address}}</p>
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

    @Component({
        components:{
            VueScroller
        }
    })
    export default class extends Vue {
        dataList:any[] =[];
        requestObj = {};

        created() {
            this.requestObj = {
                page: 1
            }
        }

        getData(res: any) {
            this.dataList = res;
            console.log(this.dataList)
        }
    }
</script>

<style lang="scss">
.pageBox{
    background: #f6f6f6;
    .hbb-exchange-order{
        display: flex;
        flex-direction: column;
        .top{
            height: 70px;
            font-size: 26px;
            color: #333;
            padding-left: 30px;
            line-height:70px;
        }
        .box{
            display: flex;
            width: 100%;
            background: #fff;
            flex-direction: column;
            ._v-container{
                background: #fff !important;
                top: 70px !important;
                height: calc(100vh - 70px) !important;
            }
            .group{
                display: flex;
                width: 100%;
                padding: 40px 0;
                border-bottom: 1px solid #eee;
                flex-direction: column;
                &:nth-last-child(1){
                    border-bottom: none;
                }
                .t{
                    display: flex;
                    width: 100%;
                    height: auto;
                    align-items: center;
                    .l{
                        width: 156px;
                        border: 1px solid #eee;
                        overflow: hidden;
                        img{
                            width: 99.5%;
                            height: 100%;
                        }
                    }
                    .r{
                        width: calc(100% - 156px);
                        padding-left: 20px;
                        h2{
                            padding: 0;
                            font-size: 28px;
                        }
                        span{
                            display: flex;
                            padding: 0 20px;
                            background-color: #f6f6f6;
                            border-radius:14px;
                            width: 120px;
                            margin: 10px 0;
                            height: 40px;
                            font-size: 22px;
                            margin-right: 10px;
                            color: #ff2c27;
                            justify-content: center;
                            align-items: center;
                        }
                        p{
                            display: flex;
                            align-items: center;
                            width: 100%;
                            font-size: 24px;
                            color: #999;
                            b{
                                font-weight: normal;
                            }
                           &:nth-of-type(1){
                               margin-bottom: 5px;
                           }
                        }
                    }
                }
                .b{
                    display: flex;
                    width: 100%;
                    border-radius: 12px;
                    padding: 20px 20px;
                    margin-top: 30px;
                    background-color: #f6f6f6;
                    flex-direction: column;
                    h3{
                        display: flex;
                        align-items: center;
                        margin: 0;
                        small{
                            display: flex;
                            width: 28px;
                            height: 28px;
                            background-color: #ccc;
                            -webkit-mask: url(../../../../../assets/images/dizhi.svg) center center / contain no-repeat;
                        }
                        b{
                            font-size: 28px;
                            color: #333;
                            margin: 0 20px 0 10px;
                        }
                        span{
                            font-size: 24px;
                            color: #666;
                        }
                    }
                    p{
                        display: flex;
                        width: 100%;
                        font-size: 24px;
                        color: #999;
                        margin-top: 5px;
                        padding-left: 30px;

                    }

                }
                .o{
                    padding-left: 0;
                    @include ellipsis(1);
                }
            }
        }
    }
}
</style>
