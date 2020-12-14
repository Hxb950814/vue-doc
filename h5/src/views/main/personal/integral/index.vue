<template>
    <div class="pageBox">
        <div class="hbb-my-integral">
            <div class="p-top">
                <div class="top">
                    <div>
                        <img :src="head" alt="">
                        <span>可用积分：{{pointBalance}}</span>
                    </div>
                    <div @click="goDetail">
                        积分明细
                        <van-icon name="arrow" color="#fff"/>
                    </div>
                </div>
                <div class="p-nav">
                    <div @click="goTabPage(1)">
                        <img src="@assets/images/jf-1.png" alt="">
                        <p>兑换优惠券</p>
                    </div>
                    <div @click="goTabPage(2)">
                        <img src="@assets/images/jf-2.png" alt="">
                        <p>兑换实物</p>
                    </div>
                    <div @click="goTabPage(3)">
                        <img src="@assets/images/jf-3.png" alt="">
                        <p>听书解锁</p>
                    </div>
                    <div @click="goTabPage(4)">
                        <img src="@assets/images/jf-4.png" alt="">
                        <p>积分抽奖</p>
                    </div>
                </div>
            </div>
            <div class="p-content">
                <div class="p-day">
                    <div class="t">
                        <div @click="ruleState = true">
                            日常打卡
                            <svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="margin-left:5px;height: 20px; width: 20px;"><path d="M512 128c212 0 384 172 384 384s-172 384-384 384-384-172-384-384 172-384 384-384m0-64C264.8 64 64 264.8 64 512s200.8 448 448 448 448-200.8 448-448S759.2 64 512 64z m32 704h-64v-64h64v64z m11.2-203.2l-5.6 4.8c-3.2 2.4-5.6 8-5.6 12.8v58.4h-64v-58.4c0-24.8 11.2-48 29.6-63.2l5.6-4.8c56-44.8 83.2-68 83.2-108C598.4 358.4 560 320 512 320c-49.6 0-86.4 36.8-86.4 86.4h-64C361.6 322.4 428 256 512 256c83.2 0 150.4 67.2 150.4 150.4 0 72.8-49.6 112.8-107.2 158.4z" style="fill: rgb(187, 187, 187);"></path></svg>
                        </div>
                        <div>
                            已连续打卡：<b>{{clockInRecord}}天</b>
                        </div>
                    </div>
                    <div class="n">
                        <ClockInNav :list="clockInList" :day="currentDay" :month="currentMonth" :year="currentYear" @clockInEvent="clockInEvent"></ClockInNav>
                    </div>

                    <p class="current-month">{{currentMonth}}月</p>
                </div>
            </div>
            <!-- 轮播图 -->
            <div class="hbb-swiper-box hbb-swiper-box1" v-if="bannerList.length > 0">
                <BannerSlide :dataList="bannerList" class="slider" mode="4" :pagination="true"></BannerSlide>
            </div>
            <!-- 赚取积分 -->
            <div class="hbb-zuan-box">
                <h2>赚取积分</h2>
                <div class="group" v-for="(item,index) in scoreTaskList" :key="index" @click="zuanClick(item, index)">
                    <div class="t">
                        <div class="one">
                            <img :src="item.taskImg" alt="">
                            <div>
                                <h3>{{item.taskName}}</h3>
                                <p>{{item.taskAbstract}}<van-icon name="arrow-down" color="#ff2f2f"/></p>
                            </div>
                        </div>

                        <div :class="item.taskStatus === 2 ? 'two two1' : 'two'" @click.stop="goPage(item, index)">
                            <template v-if="item.taskStatus === 0">
                                <span v-if="item.taskTypeId === 6">去绑定</span>
                                <span v-if="item.taskTypeId === 9">去购买</span>
                                <span v-if="item.taskTypeId === 10">去听书</span>
                                <span v-if="item.taskTypeId === 7">去收藏</span>
                                <span v-if="item.taskTypeId === 8">去阅读</span>
                                <span v-if="item.taskTypeId === 1">去邀请</span>
                            </template>
                            <template v-if="item.taskStatus === 1">
                                <span @click="addTaskUserScore(item)">+{{item.oneScore || 0}}积分</span>
                            </template>
                            <template v-if="item.taskStatus === 2">
                                <span>已领取</span>
                            </template>

                        </div>
                    </div>
                    <div class="b" v-if="currentTab === index">
                        {{item.description}}
                    </div>
                </div>
                <div class="hbb-noData" v-if="scoreTaskList.length === 0">
                    暂无数据
                </div>
            </div>

            <!-- 补卡-->
            <van-dialog v-model="showBuClock" title="补打卡提示" :show-confirm-button="false">
                <div class="modal-con">
                    <p>补打卡需花费5积分</p>
                    <div class="hbb-footer-btn">
                        <div @click="showBuClock = false">
                            取消
                        </div>
                        <div  @click="showBuClock = false">
                            补打卡
                        </div>
                    </div>
                </div>
            </van-dialog>
            <van-dialog width="90%" v-model="ruleState">
                <div class="hbb-rule-con">
                    <pre>{{description}}</pre>
                </div>
            </van-dialog>
            <!-- 预缓存 打卡-->
            <img src="https://rs.tanxingk.com/images/checkin_img.png" style="display: none">
            <img src="https://rs.tanxingk.com/images/checkin_light_img.png" style="display: none">
            <div v-if="showSignSuccess" class="animation-mask">
                <div class="sun" />
                <div class="flower" />
                <p class="tips">
                    打卡成功<span>+{{score}}积分</span>
                </p>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import BannerSlide from "@components/banner/banner-slide.vue";
    import ClockInNav from "../clockIn/component/clockInNav.vue";
    import {PersonalModule} from "@/store/modules/user/personal";

    @Component({
        components:{
            BannerSlide,
            ClockInNav
        }
    })
    export default class extends Vue {

        head = '';
        showSignSuccess = false; // 打卡弹层是否启动
        ruleState = false;
        score = 0; // 打卡积分展示
        showBuClock = false; // 补卡弹层

        bannerList:any[] = [];// 打卡广告图
        clockInList:any[] = []; // 月份nav
        clockInRecord = 0; // 已经连续打卡多少天
        description = ''; // 打卡规则
        continuityDay = 0; // 连续多少天的打卡奖励
        maxScore  = ''; // 未完成连续多少天的打卡奖励的最高积分
        currentYear = 0; // 当前年份
        currentMonth = 0; // 展示当前月份
        currentDay = 0; // 当日

        currentTab = -1; // 当前任务的展开项目
        pointBalance = 0; // 当前用户可用积分

        scoreTaskList:any[] = [];// 积分任务列表

        mounted() {
            this.head = HomeModule.getHead;
            this.init()
        }

        init() {
            this.getScoreTaskList();
            this.getScoreByUserId();
            PersonalModule.getScoreBannerList().then((res:any) => {
                this.bannerList = res?.data || [];
            });
            PersonalModule.getScoreByUserId().then((res:any) => {
                this.pointBalance = res?.data?.pointBalance || 0;
            })
            PersonalModule.getClockInMain().then((res:any) => {
                this.clockInList = res?.data?.list || [];
                let arr = this.clockInList.filter((x:any) => x.isNowDate === '1');
                this.currentMonth = arr[0].month;
                this.currentDay = Number(arr[0].day);
                this.currentYear = Number(arr[0].year);
                this.clockInRecord = res?.data?.clockInRecord.continuityDay || 0;
                this.continuityDay  = res?.data?.pointRecord ? res?.data?.pointRecord.continuityDay : res?.data?.clockInExtraSettingjl.continuityDay;
                this.maxScore = res?.data?.pointRecord ? res?.data?.pointRecord.maxScore : res?.data?.clockInExtraSettingjl.maxScore;
                this.description = res?.data?.oldclockInSetting.description || '';
                // 判断是否进行了打卡
                this.score = res?.data?.score;
                if (res?.data?.sign !== 'hasSign') {
                    this.showSignSuccess = true;
                    setTimeout(() => {
                        this.showSignSuccess = false;
                    }, 5000);
                }
            });
        }

        getScoreByUserId() {
            // 获取用户可用积分
            PersonalModule.getScoreByUserId().then((res:any) => {
                this.pointBalance = res?.data?.pointBalance || 0;
            })
        }



        getScoreTaskList() {
            // 获取任务列表
            PersonalModule.getScoreTaskList().then((res:any) => {
                this.scoreTaskList =  res?.data || [];
            })
        }

        zuanClick(item:any, index:number) {
            if(this.currentTab === index) {
                this.currentTab = -1;
            } else {
                this.currentTab = index;
            };
        }

        goTabPage(t:number) {
            // 顶部导航的跳转
            switch (t) {
                case 1:
                    this.$router.push({
                        path: '/personal/shop'
                    })
                    break;
                case 2:
                    this.$router.push({
                        path: '/personal/shop'
                    })
                    break;
                case 3:
                    this.$router.push({
                        path: '/home/listenToBooks'
                    })
                    break;
                case 4:
                    this.$toast('功能研发中');
                    break;
                default:
                    break;

            }
        }

        addTaskUserScore(item:any) {
            // 领取积分
            let requestObj = {
                taskUserScoreRecordId: item.scoreId
            };
            PersonalModule.addTaskUserScore(requestObj).then((res:any) => {
                this.$toast('领取积分成功');
                this.getScoreByUserId();
                this.getScoreTaskList();
            })
        }

        goPage(item:any, index:number) {
            // 去做任务
            if(item.taskStatus === 1) {
                this.$toast("+" + item.oneScore + '积分');
                return false;
            }
            if(item.taskStatus === 2) {
                return false;
            }
            let goPath = '';
            switch (item.taskTypeId) {
                case 6:
                    goPath = '/personal/phone';
                    break;
                case 8:
                    goPath = '/knowledge/article';
                    break;
                case 9:
                    if(item.courseTypeId === 0) return false;
                    goPath = '/home/curriculum?id=' + item.courseTypeId;
                    break;
                case 5:
                    goPath = '/personal/invite';
                    break;
                case 1:
                    goPath = '/personal/invite';
                    break;
                case 7:
                    goPath = '/knowledge/article';
                    break;
                case 10:
                    goPath = '/home/listenToBooks';
                    break;
                default:
                    break;

            }
            this.$router.push({
                path: goPath
            });
        }

        goDetail() {
            // 去积分明细页面
            this.$router.push({
                path: '/personal/myIntegralDetail'
            });
        }

        clockInEvent(res:any) {
            this.showBuClock = true;
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background: #f6f6f6;
    }
    .hbb-my-integral{
        display: flex;
        width: 100%;
        flex-direction: column;
        .p-top{
            display: flex;
            width: 100%;
            position: relative;
            height: 360px;
            flex-direction: column;
            padding:40px 10px 30px 30px;
            background:linear-gradient(to right, #0085ff 0%, #00afff 100%);
            .top{
                display: flex;
                width: 100%;
                justify-content: space-between;
                height: 80px;
                div{
                    display: flex;
                    align-items: center;

                    font-size: 26px;
                    color: #fff;
                    img{
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        border-radius: 50%;
                    }
                    &:nth-of-type(2){
                        font-size: 24px;
                    }
                }
            }
            .p-nav{
                display: flex;
                width: 100%;
                justify-content: space-between;
                padding:0 40px 0 30px;
                margin: 30px 0;
                div{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                    color: #fff;
                    font-size: 26px;
                    img{
                        width: 56px;
                        height: 56px;
                        margin: 10px auto;
                    }
                }
            }
        }

        .p-content{
            display: flex;
            width:100%;
            padding:15px 30px;
            flex-direction: column;
            position: relative;
            z-index: 5;
            margin-top: -40px;
            .p-day{
                display: flex;
                width: 100%;
                flex-direction: column;
                background: #fff;
                margin-top: -20px;
                padding: 30px 0;
                border-radius: 12px;

                .t{
                    display: flex;
                    width: 100%;
                    padding: 0 30px;
                    justify-content: space-between;
                    div{
                        display: flex;
                        align-items: center;
                        img{
                            width: 40px;
                        }
                        font-weight: bold;
                        font-size: 26px;
                        color: #333;
                        &:nth-of-type(2){
                            color: #666;
                            font-size: 24px;
                            font-weight: normal;
                            b{
                                color: #ff2f2f;
                            }
                        }
                    }
                }
                .n{
                    display: flex;
                    width: 100%;
                    margin: 40px 0;
                }
            }
            .current-month{
                display: flex;
                width: 100%;
                margin-top: 10px;
                font-size: 26px;
                 color: #666;
                justify-content: center;
            }
        }
        .hbb-swiper-box1 {
            display: flex;
            width: 100%;
            height: 140px !important;
            padding: 0 30px;
            margin: 20px 0;
            .slider {
                height: 100%;
                width: 100%;
                border-radius: 20px;
                overflow: hidden;
            }
        }
        .hbb-zuan-box{
            display: flex;
            width: 100%;
            flex-direction: column;
            background: #fff;
            padding: 20px 0 0 0;
            h2{
                font-size: 28px;
                padding: 0 30px;
                margin-bottom: 20px;
            }
            .group{
                display: flex;
                width: 100%;
                border-top: 2px solid #ddd;
                flex-direction: column;

                .t{
                    display: flex;
                    width: 100%;
                    align-items: center;
                    height: 120px;
                    padding: 0 30px;
                    justify-content: space-between;
                    .one{
                        display: flex;
                        align-items: center;

                        img{
                            width: 76px;
                            height: 76px;
                            margin-right: 20px;
                            border-radius: 50%;
                        }
                        h3{
                            margin: 0;
                            font-size: 26px;
                        }
                        p{
                            display: flex;
                            align-items: center;
                            color: #ff2f2f;
                            font-weight: bold;
                            font-size: 24px;
                        }
                    }
                    .two{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #ff9600;
                        &.two1{
                            background: rgb(205, 205, 205);
                        }
                        width: 128px;
                        height: 52px;
                        font-size: 24px;
                        color: #fff;
                        border-radius: 30px;
                    }
                }
                .b{
                    background-color: #f6f6f6;
                    font-size: 24px;
                    padding: 20px 20px 20px 50px;
                }
            }
        }
        .hbb-rule-con{
            display: flex;
            width: 100%;
            color: #666;
            min-height:100px;
            padding: 30px;
            pre{
                white-space:pre-wrap;
                white-space:-moz-pre-wrap;
                white-space:-o-pre-wrap;
                word-wrap:break-word;
                color: #666;
                font-size: 26px;
            }
        }
        .animation-mask{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5000;
            background-color: rgba(0,0,0, .5);
            .sun{
                position: fixed;
                z-index: 5001;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 750px;
                height: 750px;
                background: url(#{$cdn-path}/images/checkin_light_img.png) top/ 100% 100% no-repeat;
                display: flex;
                animation: animRotate 5s linear infinite;
            }
            .flower{
                position: fixed;
                z-index: 5002;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 300px;
                height: 300px;
                background: url(#{$cdn-path}/images/checkin_img.png) top/ 100% 100% no-repeat;
            }
            @keyframes animRotate {
                from{
                    transform: rotate(0deg);
                }
                to{
                    transform: rotate(360deg);
                }
            }
            .tips{
                text-align: center;
                position: absolute;
                z-index: 5005;
                top: 50%;
                bottom: 0;
                margin: auto;
                transform: translateY(200px);
                width: 100%;
                font-weight: bold;
                font-size: 36px;
                color: #fff;
                >span{
                    font-size: 36px;
                    color: #fff;
                }
            }
        }
    }

</style>
