<template>
    <div class="hbb-meowCoin-page">
        <div class="top">
            <van-tabs v-model="couponCurrent" @change="onChange">
                <van-tab
                        v-for="(item, index) in navList"
                        :key="index"
                        :title="item.title"
                >
                </van-tab>
            </van-tabs>
        </div>

        <div class="hbb-coupon">
            <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="8" @getData="getData"
            >
                <div :class="item.couponStatus === 0 ? 'group use': 'group'" v-for="(item,index) in dataList" :key="index">
                    <div class="a">
                    <span>
                        <b>¥</b>{{item.coupon_amount}}
                    </span>
                    </div>
                    <div class="b">
                        <p>{{item.coupon_name}}</p>
                        <p>仅限{{item.course_name}}</p>
                        <p>到期时间：{{item.end_time}}</p>
                    </div>
                </div>
            </VueScroller>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import VueScroller from "@/components/vantScroll/scrollVue.vue";
    import {log} from "lodash-decorators/utils";
    import dayjs from "dayjs";

    @Component({
        components:{
            VueScroller
        }
    })
    export default class extends Vue {
        couponCurrent = 0;
        navList:any[] = [
            {
                id:1,
                title: '未使用'
            },
            {
                id:2,
                title: '已使用'
            },
            {
                id:3,
                title: '已过期'
            }
        ];


        dataList:any[] = [];
        requestObj = {};

        created() {
            this.requestObj = {
                page: 1,
                couponStatus: this.couponCurrent
            }
        }


        getData(res: any) {
            this.dataList = res;
            this.dataList.forEach((x:any) => {
                x.end_time = x.end_time ? dayjs(x.end_time).format("YYYY年MM月DD日") : '';
            });
        }


        onChange() {
            this.requestObj = {
                page: 1,
                couponStatus: this.couponCurrent
            };
            (this.$refs.myScroll as any).allOrderList(this.requestObj);
        }
    }
</script>

<style lang="scss">
.hbb-meowCoin-page{
    .top{
        width: 100%;
        margin-top: 30px;
        border-bottom: 2px solid #eee;
         .van-tabs--line .van-tabs__wrap {
                    height:60px !important;
                    border-bottom: 1px solid #eee !important;
                }
        .van-tabs {
            width: 100%;
            height: 60px !important;
            .van-tab {
                width: 122px !important;
                padding: 0 !important;
                height: 60px !important;
                font-size: 28px !important;
                color: $base-font-color !important;
                margin-right: 30px;


                .van-tab__text--ellipsis {
                    overflow: inherit !important;
                }

                &.van-tab--active {
                    color: $color-main !important;
                }
            }

            .van-tabs__line {
                width: 112px !important;
                height: 4px !important;
            }
        }

        .van-tabs__content {
            margin-top: 20px;
        }
    }
      .hbb-coupon{
            display: flex;
            width: 100%;
            flex-direction: column;
            padding: 30px;
          ._v-container{
              background: #fff !important;
              top: 110px !important;
              height: calc(100vh - 110px) !important;
          }
            .group{
                display: flex;
                width: 100%;
                height: 180px;
                align-items: center;
                margin-bottom: 20px;
                border-radius: 10px;

                &.use{
                    background: linear-gradient(to right, #ffdbbb 0%, #ffcf9c 100%);
                    .a,p{
                        color: #844a30;
                    }
                }
                background: linear-gradient(to right, #eee 0%, #ddd 100%);
                div{
                    &.a{
                        width: 30%;
                        color: #bbb;
                        font-size: 56px;
                        font-weight: bold;
                        text-align: center;
                        span{
                            position: relative;
                            b{
                                font-size: 26px;
                                position: absolute;
                                left: -15px;
                                top:8px;
                                font-weight: normal;
                            }
                        }

                    }
                    &.b{
                        width: 60%;
                        text-align: left;
                        color: #999;
                        font-size: 24px;
                        p{
                            &:nth-of-type(1){
                                font-size: 30px;
                                font-weight: bold;
                                margin-bottom: 20px;
                            }
                        }
                    }
                    &.c{
                        width: 10%;
                        text-align: center;
                        span{
                            display: flex;
                            width: 40px;
                            height: 40px;
                            justify-content: center;
                            align-items: center;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            &.active{
                                border:none;
                                background: #0ca2ff;
                            }

                        }
                    }
                }
            }
        }
}
</style>
