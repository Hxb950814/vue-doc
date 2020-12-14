<template>
    <div>
        <div class="hbb-listen-box pageBox">
            <div @click="goMyIntegral" :class="isChange ? 'isChange hbb-jifen-box' : 'hbb-jifen-box'">
                <img :src="head" alt="">
                <p>积分：<b>{{pointBalance}}</b></p>
            </div>
            <div ref="hbb" class="img-box">
                <img src="@assets/images/pic1.jpg" alt="">
            </div>
            <div class="list">
            <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="1" @getData="getData"
            >
                        <div class="group" v-for="(item,index) in dataList" :key="index" @click="goDetail(item)">
                            <div class="top">
                                <div class="left">
                                    <img :src="item.courseImgUrl" alt="">
                                    <span><b></b></span>
                                </div>
                                <div class="right">
                                    <h2>{{item.courseName}}</h2>
                                    <p>作者：{{item.author}}</p>
                                    <van-rate v-model="item.start" :size="15" color="#ffd21e" readonly />
                                    <p class="b">已听完 <b>{{item.hasNum}}/{{item.totalNum}}</b></p>
                                </div>
                            </div>
                            <div class="bottom" v-if="item.courseDescribe">
                                <span></span>
                               {{item.courseDescribe}}
                            </div>
                        </div>
            </VueScroller>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import dataListMixins from '@/mixins/dataListMixins';
    import VueScroller from "@/components/vantScroll/scrollVue.vue";
    import {PersonalModule} from "@/store/modules/user/personal";
    import {HomeModule} from "@/store/modules/user/home";

    @Component({
        components:{
            VueScroller
        }
    })
    export default class  extends dataListMixins {

        dataList:any = [];

        head = '';
        requestObj = {};

        pointBalance = 0; // 当前可用积分

        isChange:boolean = false; // 滚动高度实付大于当前元素距离顶部的距离

        created() {
            this.requestObj = {
                page: 1
            }
        }

        mounted() {
            var _this =this

            this.head = HomeModule.getHead;
            PersonalModule.getScoreByUserId().then((res:any) => {
                this.pointBalance = res?.data?.pointBalance || 0;
            })
            this.$nextTick(() => {
                //  浏览器滚动事件不能自己手动加参数。。
                window.addEventListener('scroll', this.handleScroll, true)
            });
        }


        handleScroll () {
            let val = Math.abs(-(this.$refs.hbb as any).getBoundingClientRect().top);
            if (val >= (this.$refs.hbb as any).offsetHeight) {
                this.isChange = true;
            } else {
                this.isChange = false;
            }
        }

        getData(res: any) {
            this.dataList = res;
        }

        goDetail(item:any) {
            // 去详情页面
            this.$router.push({
                path: '/home/listenDetail',
                query: {
                    id: item.courseListenId
                }
            });
        }

        goMyIntegral() {
            // 去我的积分页面
            this.$router.push({
                path: '/personal/myIntegral'
            });
        }

        destroyed () {
            window.removeEventListener('scroll', this.handleScroll, true);
        }
    }
</script>

<style lang="scss" scoped>
.hbb-listen-box{
    display: flex;
    width: 100%;
    flex-direction: column;
    .img-box{
        display: flex;
        width: 100%;
        position: relative;
        z-index: 11;
        img{
            width: 100%;
            height: 300px;
        }
    }
    .list{
        display: flex;
        width: 100%;
        padding: 0 30px;
        margin-top: 60px;
        position: relative;
        height: calc(100vh - 300px);
        flex-direction: column;
        .group{
            display: flex;
            width: 100%;
            flex-direction: column;
            margin-bottom: 80px;
            &:last-child{
                padding-bottom: 100px;
            }
            .top{
                display: flex;
                width: 100%;
                height: 260px;
                .left{
                    width: 180px;
                    height: 100%;
                    border-radius: 12px;
                    box-shadow: rgb(221, 221, 221) 0px 0px 8px;
                    overflow: hidden;
                    position: relative;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    span{
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        z-index: 5;
                        width: 48px;
                        height: 48px;
                        background: #0000004d;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        b{
                            display: flex;
                            width: 20px;
                            height: 20px;
                            background-color: #fff;
                            -webkit-mask: url(../../../../assets/images/y-zhan.svg) center center / contain no-repeat;
                        }
                    }
                }
                .right{
                    width: calc(100% - 180px);
                    height: 100%;
                    position: relative;
                    padding-left: 30px;
                    h2{
                       color: $base-font-color;
                        font-size: 30px;
                        @include ellipsis(2);
                    }

                    p{
                        margin: 10px 0;
                        color: $color-gray;
                        font-size: 26px;
                        &.b{
                            position: absolute;
                            left: 30px;
                            bottom: -6px;
                            border-color: #eee;
                            border-style: solid;
                            border-width: 0px 0px 6px;
                            letter-spacing: 3px;
                            b{
                               font-size: 30px;
                                color: $base-font-color;
                            }
                        }
                    }
                }
            }
            .bottom{
                display: flex;
                width: 100%;
                padding: 16px 30px;
                background: #f2f2f2;
                margin-top: 30px;
                font-size: 26px;
                color: $color-gray;
                position: relative;
                border-radius: 8px;
                @include ellipsis(2);
                span{
                    position: absolute;
                    top: -15px;
                    left: 72px;
                    @include triangle(20px,#f2f2f2, top);
                }
            }
        }
    }
    .hbb-noData{
        display: flex;
        width: 100%;
        margin: 40px 0;
        justify-content: center;
        color: #bbb;
        font-size: 26px;
    }
}
.hbb-jifen-box{
    display: flex;
    position: fixed;
    top: 20px;
    border-radius: 40px 0px 0px 40px;
    background-color: #fff;
    width: 220px;
    height: 60px;
    align-items: center;
    right: 0px;
    z-index: 99;
    opacity: 0.8;
    &.isChange{
        background: #ffdb00;
        opacity: 1;
    }
    img{
        width: 40px;
        margin: 0 10px;
        border-radius: 50%;
    }
    p{
        font-size: 24px;
        margin-left: 10px;
        color: #666;
        b{
            color:#ff9600;
        }
    }
}
</style>
