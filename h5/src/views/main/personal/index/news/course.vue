<template>
    <div class="pageBox hbb-order-page">
        <div class="box">
            <div class="hbb-content">
                <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="5" @getData="getData"
                >
                    <div class="group" v-for="(item, index) in dataList" :key="index" @click="changeRow(item)">
                        <div class="right">
                            <div style="width: 100%">
                                <h2>{{item.title}}</h2>
                                <p class="ellipsis">{{item.createTime}}</p>
                                <div class="bottom" v-if="currentId === item.messageId">
                                    <p>班主任：<span>{{JSON.parse(item.content).teacher}}</span></p>
                                    <p>微信号：<span> <b @click.stop="copyCon">{{JSON.parse(item.content).wechatNo}} <div class="copy"></div></b></span></p>
                                    <img :src="JSON.parse(item.content).wechatCode" alt="">
                                </div>
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

    @Component({
        components:{
            VueScroller
        }
    })
    export default class extends Vue {
        weChartNumber = 'HB785135500';
        dataList:any = [];
        currentId = 0;
        requestObj = {};

        created() {
            this.requestObj = {
                page: 1,
                messageType:  String(this.$route.query.id)
            }
        }

        getData(res: any) {
            this.dataList = res;
            if(this.dataList.length > 0) {
                this.currentId = this.dataList[0].messageId;
            }

        }

        changeRow(item:any) {
            if(this.currentId === item.messageId) {
                this.currentId = 0;
            } else {
                this.currentId = item.messageId;
            }
        }

        copyCon() {
            // 点击复制
            let that = this;
            this.$copyText(this.weChartNumber).then(function (e) {
                that.$toast('复制成功')
            }, function (e) {
                that.$toast('复制失败')
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
                cursor: default;
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
                        @include ellipsis(2);
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
                        flex-direction: column;
                        border-top: 2px solid #eee;
                        margin-top: 10px;
                        img{
                            width: 220px;
                            margin-top: 10px;
                        }
                        p{
                            span{
                                color:#0a8dff;
                                font-size: 26px;
                            }
                            b{
                                color: #0a8dff;
                                font-size: 26px;
                                display: flex;
                                align-items: center;
                                .copy{
                                    width: 30px;
                                    height: 30px;
                                    background-color: #0a8dff;
                                    margin-left: 10px;
                                    -webkit-mask: url(../../../../../assets/images/copy.svg) center center / contain no-repeat;
                                }
                            }
                        }
                    }

                }
                p{
                    display: flex;
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
