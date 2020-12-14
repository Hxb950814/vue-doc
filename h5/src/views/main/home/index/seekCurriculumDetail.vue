
<template>
    <div class="pageBox">
        <div class="hbb-curriculum-top" :style="{background: pageData.topColour}">
<!--            <span>&lt;</span>-->
            <span  v-if="pageData.hasBuy === 1" style="width: 20px;height: 20px" @click="infoClick">
                <svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="height: calc(100% - 0px); width: calc(100% - 0px);"><path d="M864 844.768a2.464 2.464 0 0 1-1.504 0.704L288 844.096V726.08c0-5.824 6.016-14.944 12.096-17.44C301.664 708 456.992 640 576 640c118.752 0 274.336 68 276.864 69.088 5.216 2.08 11.136 11.168 11.136 17.024v118.656zM480.48 440.8v-104.736A112.064 112.064 0 0 1 592.256 224 112 112 0 0 1 704 336.064v104.736a112 112 0 0 1-111.744 112.064 112 112 0 0 1-111.776-112.064z m397.248 209.28c-4.992-2.176-92.64-40.384-191.008-61.056A176 176 0 0 0 768 440.8v-104.736C768 238.976 689.152 160 592.256 160c-96.928 0-175.776 78.976-175.776 176.064v104.736c0 59.136 29.344 111.456 74.112 143.36-108.16 18.72-210.752 63.488-215.552 65.6C245.952 661.76 224 694.56 224 726.144v126.4h0.544a65.536 65.536 0 0 0 64.96 56.96h572.992c28.672 0 54.304-18.752 63.808-46.72l1.696-4.96V726.08c0-31.808-22.016-64.672-50.272-76zM360.384 573.44c1.024 0 1.952 0.288 2.976 0.288a32 32 0 1 0 0-64A68.736 68.736 0 0 1 294.72 440.96v-84.256C294.72 318.848 325.504 288 363.36 288a32 32 0 0 0 0-64 132.832 132.832 0 0 0-132.64 132.736v84.256c0 32.736 12.352 62.368 32.064 85.536-62.72 19.296-117.536 49.696-127.584 55.456C112.352 592.8 96 618.688 96 644.448v91.904a32 32 0 1 0 64 0v-91.744a11.424 11.424 0 0 1 2.336-4.672 28.992 28.992 0 0 0 3.584-1.824c30.432-17.728 123.84-63.712 189.76-63.712 1.632 0 3.104-0.704 4.704-0.96" style="fill: rgb(255, 255, 255);"></path></svg>
            </span>
        </div>
        <div style="height: 0" v-wechat-title="pageData.courseName"></div>
        <div class="hbb-curriculum-header">
            <div>
                <img :src="pageData.courseImgUrl" alt="">
            </div>
            <div class="b">
                <h2>{{pageData.courseName}}</h2>
                <p>{{pageData.courseDescribe}}</p>
                <template  v-if="pageData.hasBuy === 1">
                    <p>班级名称：{{pageData.className}}</p>
                    <p>开班周期：{{pageData.startDate}} 至 {{pageData.endDate}}</p>
                </template>
            </div>
        </div>
        <div class="hbb-curriculum-bottom hbb-listen-detail-bottom">
            <van-tabs v-model="currentTab">
                <van-tab title="课程介绍">
                    <AudioIntroductionView :srcImg="pageData.courseDescribeUrl"></AudioIntroductionView>
                </van-tab>
                <van-tab title="课程目录">
                    <CourseCatalogView :hasBuy="pageData.hasBuy" :type="2" :list="pageData.courseChapterDoList"></CourseCatalogView>
                </van-tab>
            </van-tabs>
        </div>

        <!--   购买悬浮   -->
<!--        <div class="hbb-buy-footer">-->
<!--            <template v-if="!pageData.hasBuy">-->
<!--                <div class="a">-->
<!--                    <h2>¥ {{(pageData.isLimitTimeDiscount === 1 ? pageData.discountPrice : pageData.markPrice) | money }}</h2>-->
<!--                    <s v-if="pageData.isLimitTimeDiscount === 1">¥{{pageData.markPrice | money}}</s>-->
<!--                </div>-->
<!--                <div class="b">-->
<!--                    <h2>{{time_text}}</h2>-->
<!--                    <p>距离优惠结束</p>-->
<!--                </div>-->
<!--                <div class="c">-->
<!--                    <van-button color="#FFA400" @click="goBuy">立即购买</van-button>-->
<!--                </div>-->
<!--            </template>-->
<!--            <template v-else>-->
<!--                <div class="a">-->
<!--                    <p>您已购买本课程</p>-->
<!--                </div>-->
<!--                <div class="c">-->
<!--                    <van-button color="#FFA400" @click="goStudent">去学习</van-button>-->
<!--                </div>-->
<!--            </template>-->
<!--        </div>-->
        <!--   查看班主任的个人微信     -->
        <van-dialog width="280px" v-model="headTeacherState" :show-confirm-button="false">
            <div class="hbb-geren-top">
                <div class="hbb-close" @click="headTeacherState = false"><van-icon name="cross" /></div>
                <span>班主任微信号：<b @click="copyCon">{{weChartNumber}} <div class="copy"></div></b></span>
            </div>
            <div class="hbb-geren-con">
                <img :src="weChartCode" alt="">
                <p>长按二维码识别添加班主任微信</p>
            </div>
        </van-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import CourseCatalogView from './curriculumView/courseCatalog.vue';
    import AudioIntroductionView from './curriculumView/audioIntroduction.vue';
    import {appweixin} from "@/utils/wechart";
    import {tabIndexFn} from "@/utils";
    import dayjs from "dayjs";

    @Component({
        components: {
            CourseCatalogView,
            AudioIntroductionView
        }
    })
    export default class extends Vue {
        id:string = "";
        type: string = "";  //
        t: string = "0";  //
        currentTab: number = 0; // 当前标签页 0:课程介绍 1：课程目录
        countTime:number = 1000; // 距离优惠结束的多少秒
        _interval = 0;
        time_text = '0天0时0分0秒';

        headTeacherState = false; // 班主任个人微信的弹层
        weChartNumber = 'HB785135500';
        weChartCode = '';

        pageData:any = {
            courseChapterDoList: [], // 课程目录
            courseDescribe: '', // 课程描述
            courseDescribeUrl: '', // 课程描述图片
            courseImgUrl: '', // 课程封面图片
            shareTitleImgUrl: '', // 分享封面图片
            courseName: '', // 课程名称
            courseTip: '', // 试听状态
            courseTypeId: 0, // 试听状态
            discountEndTime: '',  // 优惠结束时间
            discountPrice: 0,  // 折后价
            discountTimeType: 0, // 优惠期限类型 0：永久 1：范围
            hasBuy: 0, // 0 未买  1：已购买
            isLimitTimeDiscount: 0, //  优惠期限
            markPrice: 0, // 市场价
            className: '',
            startDate: '',
            endDate: '',
            topColour: '' // 顶部颜色
        }
        userId = 0;

        mounted() {
            this.id = String(this.$route.query.id);
            this.type = String(this.$route.query.type);
            this.t = String(this.$route.query.t) || '';
            if(this.t === '0') {
                this.currentTab = 0;
            } else {
                this.currentTab = 1;
            }
            this.getQueryNoListenCourseInfo();
            if(this.pageData.hasBuy) return;
            this.countdown();
        }

        getQueryNoListenCourseInfo() {
            const requestObj = {
                courseTypeId: this.id,
                recommendUserId: this.userId
            }
            let url = HomeModule.getUId ? location.href + '&abcde=' + HomeModule.getUId : location.href;
            HomeModule.getQueryNoListenCourseInfo(requestObj).then((res:any) => {
                const data = res?.data;
                this.pageData.courseChapterDoList = res?.data.courseChapterDoList || [];
                this.pageData.courseDescribe = res?.data.courseDescribe || '';
                this.pageData.courseDescribeUrl = res?.data.courseDescribeUrl  || '';
                this.pageData.courseImgUrl = res?.data.courseImgUrl || '';
                this.pageData.shareTitleImgUrl = res?.data.shareTitleImgUrl || '';
                this.pageData.courseName = res?.data.courseName  || '';
                this.pageData.courseTip = res?.data.courseTip || '';
                this.pageData.courseTypeId = res?.data.courseTypeId  || 0;
                this.pageData.discountEndTime = res?.data.discountEndTime || '';
                this.pageData.discountPrice = res?.data.discountPrice  || 0;
                this.pageData.discountTimeType = res?.data.discountTimeType || 0;
                this.pageData.hasBuy = res?.data.hasBuy  || 0;
                this.pageData.isLimitTimeDiscount = res?.data.isLimitTimeDiscount || 0;
                this.pageData.markPrice = res?.data.markPrice  || 0;
                this.pageData.topColour = res?.data.topColour || '#50d0ff';
                this.pageData.className = res?.data.className || '';
                this.pageData.startDate = res?.data.startDate ? dayjs(res?.data.startDate).format("YYYY-MM-DD") : '';
                this.pageData.endDate = res?.data.endDate ? dayjs(res?.data.endDate).format("YYYY-MM-DD") : '';
                this.countTime =  this.pageData.discountEndTime ? (new Date(this.pageData.discountEndTime).getTime() -  new Date().getTime())/1000 : this.pageData.discountEndTime
                // 处理体验问题
                this.$nextTick(() => {
                    tabIndexFn('van-collapse-item__title');
                });
                appweixin.onMenuShare({
                    title: this.pageData.courseName,
                    desc: this.pageData.courseDescribe,
                    link: url,
                    show: location.href,
                    imgUrl: this.pageData.shareTitleImgUrl
                });
            })
        }

        infoClick() {
            // 查看班主任的个人微信
            let resquestObj  = {
                courseTypeId: this.pageData.courseTypeId
            }
            HomeModule.getQueryMyClassListByCourseTypeId(resquestObj).then((res:any) => {
                this.weChartNumber = res?.data.wechatNo;
                this.weChartCode = res?.data.wechatCode;
                this.headTeacherState = true;
            });

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

        countdown() {
            const that = this
            that._interval = setInterval(() => {
                if(that.countTime == 0) {
                    // 计时结束，清除缓存
                    clearInterval(that._interval)
                } else {
                    that.countTime--;
                    let day = parseInt(String(that.countTime / 60 / 60 / 24));
                    let hr = parseInt(String(that.countTime / 60 / 60 % 24));
                    let min = parseInt(String(that.countTime / 60 % 60));
                    let sec = parseInt(String(that.countTime % 60));
                    day = Number(day > 9 ? day : '0' + day);
                    hr =  Number(hr > 9 ? hr : '0' + hr);
                    min =  Number(min > 9 ? min : '0' + min);
                    sec =  Number(sec > 9 ? sec : '0' + sec);
                    that.time_text = `${day}天${hr}时${min}分${sec}秒`;
                }
            }, 1000);
        }

        goBuy() {
            this.$router.push({
                path: '/home/orderInfo',
                query:{
                    id: this.id
                }
            })
        }

        goStudent() {
            this.$router.push({
                path: '/knowledge'
            })
        }

        //当离开页面时，清除倒计时
        beforeDestroy() {
            clearInterval(this._interval)
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background: #F6F6F6;
        .hbb-curriculum-top{
            display: flex;
            width: 100%;
            height: 200px;
            background: #50d0ff;
            justify-content: flex-end;
            padding: 20px 30px;
            color: #fff;
            font-size: 26px;
        }
        .hbb-curriculum-header{
            display: flex;
            width: 100%;
            padding: 30px 40px;
            background: #fff;
            border-radius: 30px 30px 0 0;
            margin-top: -20px;
            div{
                img{
                    margin-top: -80px;
                    width: 160px;
                    height: 180px;
                    border-radius: 15px;
                }
                &.b{
                    margin-left: 20px;
                    h2{
                        margin-top: -80px;
                        font-size: 30px;
                        color: #fff;
                        margin-bottom: 30px;
                        @include ellipsis(1)
                    }
                    p{
                        font-size: 26px;
                    }
                }
            }
        }
        .hbb-curriculum-bottom{
            margin-top: 20px;
        }
        .hbb-buy-footer{
            position: fixed;
            width: 100%;
            left: 0;
            bottom: 0;
            height: 110px;
            padding: 0 30px;
            background: rgba(255,255,255,.8);
            display: flex;
            border-top: 2px solid #eee;
            justify-content: space-between;
            align-items: center;
            div{
                &.a{
                    h2{
                        color: $color-main;
                        font-size: 36px;
                    }
                    s{
                        color: $color-gray;
                        font-size: 24px;
                    }
                    p{
                        color: $color-gray;
                        font-size: 30px;
                    }
                }
                &.b{
                    h2{
                        color: $color-ff9600;
                        font-size: 26px;
                        font-weight: normal;
                    }
                    s{
                        color: $color-666;
                        font-size: 24px;
                    }
                }
                &.c{
                    .van-button{
                        width: 220px;
                        height: 80px;
                        border-radius: 40px;
                        font-size: 28px;
                    }
                }
            }
        }
        .hbb-geren-top{
            display: flex;
            width: 100%;
            height: 160px;
            background: url(../../../../assets/images/gerenBG.jpg);

            font-size: 30px;
            span{
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;
            }
            b{
                color: #0a8dff;
                display: flex;
                align-items: center;
                .copy{
                    width: 30px;
                    height: 30px;
                    background-color: #0a8dff;
                    margin-left: 10px;
                    -webkit-mask: url(../../../../assets/images/copy.svg) center center / contain no-repeat;
                }
            }
        }
        .hbb-geren-con{
            display: flex;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            text-align: center;
            margin: 40px 0;
            *{
                width: 400px;
                margin: 10px auto;
                color: $color-gray;
                font-size: 26px;
            }
        }
    }
    .hbb-look-top{
        position: absolute;
        right: 12%;
        top: 10px;
        border-radius: 16px;
        background-color: #ff2c27;
        width: 64px;
        height: 28px;
        display: flex;
        align-items: center;
        fonst-size: 26px;
        color: #fff;
        justify-content: center;
    }
</style>
