<template>
    <div class="pageBox hbb-order-page">
        <div class="box">
            <div class="hbb-content">
                <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="4" @getData="getData"
                >
                    <div class="group" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
                        <div class="right">
                            <div style="width: 90%">
                                <h2 class="ellipsis">{{item.title}}</h2>
                                <p class="ellipsis">{{item.publishTime}}</p>
                            </div>
                            <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
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
        dataList:any = [];

        requestObj = {};

        created() {
            this.requestObj = {
                page: 1,
                messageType:  String(this.$route.query.id)
            }
        }

        getData(res: any) {
            this.dataList = res;
        }

        goDetail(item:any) {
            // 去详情页面
            this.$router.push({
                path: '/personal/newDetail',
                query: {
                    id: item.afficheId
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-order-page{
        background: #f6f6f6;
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
            justify-content: space-between;
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
                align-items: center;
                background: #fff;
                border-radius: 8px;
                .imgBox{
                    width: 72px;
                    height: 72px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius:10px;
                    }
                    position: relative;
                    span{
                        display: flex;
                        width: 20px;
                        height: 20px;
                        background: #ff2c27;
                        border-radius: 50%;
                        position: absolute;
                        right: -5px;
                        top: -5px;
                        z-index: 5;
                    }


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
                    padding:10px 20px;
                    width: 100%;
                    align-items: center;
                    justify-content: space-between;
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
                    @include ellipsis(1)
                }
            }
        }
    }
    .hbb-content{
        height: 100vh;
    }
</style>
