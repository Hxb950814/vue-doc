<template>
    <div class="detail">
        <!-- top部分 -->
        <div   @click="goMyIntegral" :class="isChange ? 'isChange hbb-jifen-box' : 'hbb-jifen-box'">
            <img :src="head" alt="">
            <p>积分：<b>{{pointBalance}}</b></p>
        </div>
        <div style="height: 0" v-wechat-title="pageData.courseName"></div>
        <div ref="hbb" class="hbb-listen-detail-top">
            <div class="top">
                <div class="left">
                    <img :src="pageData.courseImgUrl"
                         alt="">
                </div>
                <div class="right">
                    <h2>{{pageData.courseName}}</h2>
                    <p>作者：{{pageData.author}}</p>
                    <van-rate v-model="pageData.start" :size="15" color="#ffd21e" readonly/>
                    <p class="b">已听完 <b>{{pageData.hasNum}}/{{pageData.totalNum}}</b></p>
                </div>
            </div>
            <div class="bottom">
                {{pageData.courseDescribe}}
            </div>
        </div>
        <!-- bottom部分 -->
        <div class="hbb-listen-detail-bottom">
            <van-tabs v-model="currentTab" @change="onChange">
                <van-tab title="书本小节">
                    <CourseCatalogView ref="CourseCatalogView" @paseAudioEvent="paseAudio" @showAudioEvent="showAudio" :list="pageData.courseListenSectionList" @unlockSuccessEvent="unlockSuccess"></CourseCatalogView>
                </van-tab>
                <van-tab title="书本简介">
                    <AudioIntroductionView ref="audioIntroductionView"></AudioIntroductionView>
                </van-tab>
            </van-tabs>

        </div>
        <!--   悬浮框部分   -->
        <FloatModal ref="FloatModal" @startFu="startFu" @zanFu="zant" @prevAudioEvent="prevAudioEvent" @nextAudioEvent="nextAudioEvent" :courseListenSectionId="courseListenSectionId" @finishEvent="finishEvent" v-if="floatModalState" @closeEvent="closeFloatModal"  @bookClick="bookClick"  @IntroductionEvent="Introduction"></FloatModal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import CourseCatalogView from './childrenView/courseCatalog.vue';
    import AudioIntroductionView from './childrenView/audioIntroduction.vue';
    import FloatModal from '@components/floatModal/index.vue';
    import {appweixin} from "@/utils/wechart";
    import {PersonalModule} from "@/store/modules/user/personal";
    import {funcUrlDel, getParameter} from "@/utils/index";


    @Component({
        components: {
            CourseCatalogView,
            AudioIntroductionView,
            FloatModal
        }
    })
    export default class extends Vue {
        id:string = ''; // 听书详情id
        name:string = ''; // 听书详情id
        startValue: number = 5; // 当前书的评分
        currentTab: number = 0; // 当前标签页 0:课程目录 1：音频简介
        floatModalState: boolean = false; // 悬浮弹层 是否启动
        courseListenSectionId: string = '';
        currentAudio:any = {}; // 点击当前的音频

        pageData:any = {
            courseImgUrl: '',
            author: '',
            courseDescribe: '',
            courseDescribeUrl: '',
            shareTitleImgUrl: '',
            courseListenSectionList: [],
            courseName: '',
            hasNum: '',
            totalNum: '',
            start: 0
        }

        head = '';
        pointBalance = 0; // 当前可用积分

        isChange:boolean = false; // 滚动高度实付大于当前元素距离顶部的距离

        mounted() {
            this.id = String(this.$route.query.id);
            this.getDetail();
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
            if (val >= (this.$refs.hbb as any).offsetHeight - 60) {
                this.isChange = true;
            } else {
                this.isChange = false;
            }
        }


        zant() {
            // 悬浮层控制列表暂停开始
            (this.$refs.CourseCatalogView as any).currentIndex = -1;
        }

        startFu() {
            // 悬浮层控制列表暂停开始
            (this.$refs.CourseCatalogView as any).currentIndex = (this.$refs.CourseCatalogView as any).index;
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

        getDetail() {
            // 取得详情
            let url = HomeModule.getUId ? location.href + '&abcde=' + HomeModule.getUId : location.href;
            HomeModule.getQueryListenCourseInfo(this.id).then((res:any) => {
                const data = res?.data;
                this.pageData.courseName = data.courseName;
                this.pageData.author = data.author;
                this.pageData.courseImgUrl = data.courseImgUrl;
                this.pageData.courseDescribe = data.courseDescribe;
                this.pageData.courseDescribeUrl = data.courseDescribeUrl;
                this.pageData.shareTitleImgUrl = data.shareTitleImgUrl;
                this.pageData.courseListenSectionList = data.courseListenSectionList;
                this.pageData.hasNum = data.hasNum;
                this.pageData.totalNum = data.totalNum;
                this.pageData.start = data.start;
                document.title = data.courseName;
                appweixin.onMenuShare({
                    title: this.pageData.courseName,
                    desc: this.pageData.courseDescribe,
                    link: url,
                    show: location.href,
                    imgUrl: this.pageData.shareTitleImgUrl
                });
            })
        }

        unlockSuccess() {
            // 解锁成功
            this.getDetail();
        }

        finishEvent() {
            // 监听音频已经播放完毕
            location.reload()
        }

        showAudio(res:any) {
            // 启动悬浮弹层
            this.currentAudio = res;
            this.courseListenSectionId = res.courseListenSectionId;
            if(this.floatModalState) {
                (this.$refs.FloatModal as any).pauseAudio(res);
                return false;
            }
            this.floatModalState = true;
            setTimeout(() => {
                (this.$refs.FloatModal as any).pauseAudio(res);
            },0)
        }

        paseAudio(res:any) {
            (this.$refs.FloatModal as any).paseAudio(res);
        }

        prevAudioEvent(res:any) {
            // 上一个视频
            let arr = this.pageData.courseListenSectionList.filter((x:any) => x.courseListenSectionId === res.courseListenSectionId);
            let index = this.pageData.courseListenSectionList.indexOf(arr[0]);
            if(index === 0) {
                this.$toast('已经是第一节了')
                return false;
            }
            let obj = this.pageData.courseListenSectionList[index - 1];
            this.showAudio(obj);
        }

        nextAudioEvent(res:any) {
            // 下一个视频
            let arr = this.pageData.courseListenSectionList.filter((x:any) => x.courseListenSectionId === res.courseListenSectionId);
            let index = this.pageData.courseListenSectionList.indexOf(arr[0]);
            if(index >= this.pageData.courseListenSectionList.length) {
                this.$toast('已经是最后一节了')
                return false;
            };
            let obj = this.pageData.courseListenSectionList[index + 1];
            if(obj.status === 2) {
                this.$toast('下个音频暂未解锁');
                return false;
            }
            this.showAudio(obj);
        }


        closeFloatModal() {
            // 关闭悬浮弹层 归为原始状态
            this.floatModalState = false;
            (this.$refs.CourseCatalogView as any).currentIndex = -1;
            (this.$refs.CourseCatalogView as any).id = 0;
        }

        Introduction() {
            // 悬浮层的课程介绍
            this.currentTab = 1;
        }

        bookClick() {
            // 悬浮层的课程介绍
            this.currentTab = 0;
        }

        onChange() {
            setTimeout(() => {
                (this.$refs.audioIntroductionView as any).active(this.pageData.courseDescribeUrl)
            }, 0)
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-listen-detail-top {
        display: flex;
        width: 100%;
        flex-direction: column;
        background-color: #c2a588;
        padding: 60px 50px 80px;
        margin-bottom: -40px;

        .top {
            display: flex;
            width: 100%;
            height: 260px;

            .left {
                width: 180px;
                height: 100%;
                border-radius: 12px;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .right {
                width: calc(100% - 180px);
                height: 100%;
                position: relative;
                padding-left: 30px;

                h2 {
                    color: #fff;
                    font-size: 30px;
                    @include ellipsis(2);
                }

                p {
                    margin: 10px 0;
                    color: #fff;
                    font-size: 26px;

                    &.b {
                        position: absolute;
                        left: 30px;
                        bottom: -6px;
                        border-color: #eee;
                        border-style: solid;
                        border-width: 0px 0px 6px;
                        letter-spacing: 3px;

                        b {
                            font-size: 30px;
                            color: #fff;
                        }
                    }
                }
            }
        }

        .bottom {
            display: flex;
            width: 100%;
            padding: 16px 30px;
            background: #fff3;
            margin-top: 30px;
            font-size: 26px;
            color: #8b6149;
            position: relative;
            border-radius: 8px;
            @include ellipsis(2)
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
