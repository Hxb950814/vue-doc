<template>
    <div class="hbb-clock-page">
        <div class="title">
            {{currentMonth}}月
        </div>
        <ClockInNav :list="clockInList" :day="currentDay" :month="currentMonth" :year="currentYear" @clockInEvent="clockInEvent"></ClockInNav>
        <div class="tip">
            已连续打卡：<b>{{clockInRecord}}天</b>
        </div>
        <!-- 打卡轮播图 -->
        <div class="img-jiang">
            <img src="@assets/images/jiangli.jpg" alt="">
            <div class="con">
                <p><span v-if="clockInRecord < continuityDay">未完成
                </span>连续<span v-if="clockInRecord >= continuityDay">打卡</span>{{continuityDay}}天
                    <span v-if="clockInRecord >= continuityDay">奖励</span></p>
                <h2><small  v-if="clockInRecord < continuityDay">最高</small>{{maxScore}}<small>积分</small></h2>
            </div>
        </div>
        <!-- 轮播图 -->
        <div class="hbb-swiper-box hbb-swiper-box1" v-if="bannerList.length > 0">
            <BannerSlide :dataList="bannerList" class="slider" mode="3" :pagination="true"></BannerSlide>
        </div>
        <div class="rule-box">
            <h2>
                <span></span>
                打卡规则
                <span></span>
            </h2>
            <div class="con">
                <pre>{{description}}</pre>
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
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import BannerSlide from "@components/banner/banner-slide.vue";
    import ClockInNav from "./component/clockInNav.vue";
    import {PersonalModule} from "@/store/modules/user/personal";

    @Component({
        components:{
            BannerSlide,
            ClockInNav
        }
    })
    export default class extends Vue {
        bannerList:any[] = [];// 打卡广告图
        clockInList:any[] = []; // 月份nav
        clockInRecord = 0; // 已经连续打卡多少天
        description = ''; // 打卡规则
        continuityDay = 0; // 连续多少天的打卡奖励
        maxScore  = ''; // 未完成连续多少天的打卡奖励的最高积分
        currentYear = 0; // 当前年份
        currentMonth = 0; // 展示当前月份
        currentDay = 0; // 当日

        showSignSuccess = false; // 打卡弹层是否启动
        score = 0; // 打卡积分展示
        showBuClock = false; // 补卡弹层

        mounted() {
            this.init();
        }

        init() {
            PersonalModule.getClockInMainBannerList().then((res:any) => {
                this.bannerList = res?.data || [];
            });
            PersonalModule.getScoreBannerList().then((res:any) => {
                this.clockInList = res?.data || [];
            });
            PersonalModule.getClockInMain().then((res:any) => {
                this.clockInList = res?.data?.list || [];
                let arr = this.clockInList.filter((x:any) => x.isNowDate === '1');
                this.currentMonth = arr[0].month;
                this.currentDay = Number(arr[0].day);
                this.currentYear = Number(arr[0].year);
                this.clockInRecord = res?.data?.clockInRecord.continuityDay || 0;
                this.continuityDay  = res?.data?.pointRecord ? res?.data?.pointRecord.continuityDay : res?.data?.clockInExtraSettingjl.continuityDay;
                this.maxScore = res?.data?.pointRecord ? res?.data?.pointRecord.amount : res?.data?.clockInExtraSettingjl.maxScore;
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

        clockInEvent(res:any) {
            this.showBuClock = true;
        }
    }
</script>

<style lang="scss" scoped>
.hbb-clock-page{
    display: flex;
    flex-direction: column;
    width: 100%;
    .title{
        display: flex;
        width: 100%;
        justify-content: center;
        height: 90px;
        align-items: center;
        font-size: 28px;
        color: #666;
    }
    .tip{
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 30px 0;
        font-size: 26px;
        color: #666;
        b{
            color: #ff2f2f;
        }
    }
    .img-jiang{
        display: flex;
        width: 100%;
        padding: 0 30px;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        flex-direction: column;
        div{
            display: flex;
            position: absolute;
            flex-direction: column;
            text-align: center;
            padding-top: 50px;
            width: calc(100% - 30px);
            justify-content: center;
            p{
                width: calc(100% - 30px);
                font-size: 28px;
                color: #fff;
                margin-bottom: 10px;
            }
            h2{
                width: calc(100% - 30px);
                font-size: 70px;
                color: #fff;
                small{
                    font-size: 26px;
                    padding-bottom: 20px;
                }
            }
        }
        img{
            width: 100%;
            border-radius: 12px;
        }
    }
    .hbb-swiper-box1 {
        display: flex;
        width: 100%;
        height: 140px;
        margin: 20px 0;
        padding: 0 30px;
        .slider {
            height: 100%;
            width: 100%;
            border-radius: 20px;
            overflow: hidden;
        }
    }
    .rule-box{
        display: flex;
        width: 100%;
        margin-top: 20px;
        flex-direction: column;
        h2{
            display: flex;
            width: 100%;
            margin: 10px 0;
            align-items: center;
            justify-content: center;
            span{
                width: 60px;
                height: 2px;
                background: #ccc;
                &:nth-of-type(1){
                    margin-right: 20px;
                }
                &:nth-of-type(2){
                    margin-left: 20px;
                }
            }
        }
        .con{
            margin-top: 30px;
            display: flex;
            width: 100%;
            font-size: 28px;
            color: #666;
            padding: 0 30px;
            pre{
                white-space:pre-wrap;
                white-space:-moz-pre-wrap;
                white-space:-o-pre-wrap;
                word-wrap:break-word;
                color: #666;
            }
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
    .modal-con{
        display: flex;
        width: 100%;
        flex-direction: column;
        p{
            justify-content: center;
            padding: 40px 30px;
            text-align: center;
            font-size: 30px;
            color: #333;
        }
        .hbb-footer-btn{
            display: flex;
            border-top:2px solid #ddd;
            width: 100%;
            height: 80px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            div{
                width: 50%;
                text-align: center;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                color: #ff2f2f;
                &:nth-of-type(1){
                    border-right: 2px solid #ddd;
                    color: #666;
                }
            }
        }
    }
}
</style>
