<template>
    <div>
        <div class="hbb-chi-video" style="height: 210px">
            <ChiZhanVideoView ref="ChiZhanVideoVideo"
                              :cover="cover"
                              :progressMarkers="progressMarkers"
                              @videoEnd='videoEnd'
                              @videoPlay="videoPlay"
                              @updateShilookTime="updateShilookTime"
                              ></ChiZhanVideoView>

        </div>
        <div style="height: 0" v-wechat-title="courseName"></div>
        <div class="hbb-shiting">
            <div class="left" v-if="!isBuy">
                <div :class="isPause ? 'btn pause': 'btn'" @click="btnClick">

                </div>
                <div class="time">
                    <span>{{currentTime}}</span>/<span>{{totalTime}}</span>
                </div>
            </div>
            <div v-else  style="font-size: 14px">{{sectionTitle}}</div>
            <div class="look" @click="lookCourse">
                {{isBuy ? '课程列表' : '试看'}}
            </div>
        </div>
        <div class="hbb-tip" style="font-size: 16px" v-if="!isBuy">
            {{sectionTitle}}
        </div>
        <div v-if="courseFrom !== 0" style="display: flex;width: 100%;padding: 0 15px;margin:10px 0"  @click.parent="doPlayAudio">
            <audio  controlsList="nodownload" style="width: 100%" :src="contentSoundUrl" id="audio" controls="controls">
            </audio>
        </div>

        <div class="hbb-video-con" v-html="sectionImgUrl">
        </div>

        <!--  查看课程  -->
        <van-popup v-model="courseShow"
                   round
                   position="bottom"
                   style="height: calc(100% - 210px);; padding-top: 4px;">
            <div class="hbb-title-top" style="top: 210px" @click="courseShow = false">
                <span>{{dialogTitle}}</span>
                <van-icon name="cross"  />
            </div>
            <CourseCatalogView style="margin-top:40px" @lookVideoEvent="lookVideoEvent" :hasBuy="isBuy" :list="courseChapterDoLists" :type="3" :chapterSectionId="chapterSectionId" :courseChapterId="String(courseChapterId)"></CourseCatalogView>
        </van-popup>

       <!-- 是看已经结束是否去购买课程 -->
        <van-dialog width="300px" v-model="seeState" :show-confirm-button="false">
            <div class="hbb-title">
                <h2>试听结束</h2>
                <p>试听结束, 是否立即购买？</p>
            </div>
            <div class="hbb-see-btn">
                <span @click="seeState = false">再想想</span>
                <span @click="confirm">去购买</span>
            </div>
        </van-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";

    import ChiZhanVideoView from '@/components/video/index.vue';
    import AudioIntroductionView from './audioIntroduction.vue';
    import CourseCatalogView from './courseCatalog.vue';
    import {appweixin} from "@/utils/wechart";
    import {log} from "lodash-decorators/utils";

    @Component({
        components:{
            AudioIntroductionView,
            ChiZhanVideoView,
            CourseCatalogView
        }
    })
    export default class extends Vue {
        id:string = '';
        cId:string = '';
        currentTime = '00:00'; // 当前走的时间点
        totalTime = '00:00'; // 这段视频的时长
        isBuy = 0; // 用户是否已经购买了课程
        courseShow = false; // 查看课程弹层是否启动
        isPause = true; // 试看模式  是否暂停
        source = ''; // 视频来源 可多种画质 根据配置来设定.
        contentSoundUrl = ''; // 音频来源
        cover = ''; // 视频封面图
        sectionImgUrl = ''; // 视频封面图
        progressMarkers = []; // 视频进度条的标记
        timer = 0; // 时间对象源
        dialogTitle = '';  // 弹层标题.
        courseDescribe = '';  // 描述.
        shareTitleImgUrl = '';  // 分享图片.

        courseName = '';  // 详情名称.
        courseFrom = ''; // 判断音视频的展示 0：视频 1：音频 2：音视频
        chapterSectionId  = 0; // 选中小节id
        courseChapterId  = 0; // 选中章节id.
        sectionTitle = '';
        courseChapterDoLists = [];
        audio = null;
        seeState = false; // 试听结束的弹层
        mounted() {
            this.id = String(this.$route.query.id);
            this.cId = String(this.$route.query.cId);
            this.getDetail();
            this.getQueryNoListenCourseInfo();
            this.$nextTick(() => {
                this.audio = (document.getElementById('audio') as any);
                this.doPlayAudio();
            })

        }

        lookVideoEvent(res:any) {
            // 点击当前的视频
            this.courseShow = false;
            (this.$refs.ChiZhanVideoVideo as any).disposeEvent();
            (this.audio as any).pause();
            // this.contentSoundUrl = '';
            this.id = String(res.chapterSectionId);
            this.getDetail();
        }

        getDetail() {
            let url = HomeModule.getUId ? location.href + '&abcde=' + HomeModule.getUId : location.href;
            HomeModule.getTryNoListenSectionInfo(this.id).then((res:any) => {
                this.cover = res?.data.videoCoverUrl;
                this.source = res?.data.contendUrl;
                this.isBuy = res?.data.hasBuy;
                this.courseDescribe = res?.data.courseDescribe || '';
                this.shareTitleImgUrl = res?.data.shareTitleImgUrl || '';
                this.sectionImgUrl =  res?.data.sectionImgUrl;
                this.chapterSectionId =  res?.data.chapterSectionId;
                this.sectionTitle= res?.data.sectionTitle || '';
                this.contentSoundUrl =  res?.data.contentSoundUrl || '';
                (this.audio as any).setAttribute('src', this.contentSoundUrl);
                this.courseFrom = res?.data.courseFrom;
                this.$route.meta.title = this.sectionTitle;
                this.courseName = res?.data.courseName;
                this.courseChapterId =  res?.data.courseChapterId;
                this.dialogTitle = '当前正在播放-第' + res?.data.sectionNo + '节';
                (this.$refs.ChiZhanVideoVideo as any).setUrl(this.source);
                appweixin.onMenuShare({
                    title: this.courseName,
                    desc: this.courseDescribe,
                    link: url,
                    show: location.href,
                    imgUrl: this.shareTitleImgUrl
                });
            })
        }

        getQueryNoListenCourseInfo() {
            const requestObj = {
                courseTypeId: this.cId,
                recommendUserId: 0
            }
            HomeModule.getQueryNoListenCourseInfo(requestObj).then((res:any) => {
                const data = res?.data;
                this.isBuy = res?.data.hasBuy;
                this.courseChapterDoLists = res?.data.courseChapterDoList || [];
            })
        }



        updateShilookTime(obj:any, obj1:any) {
            // 同步更新视频的时间节点
            this.timer = setInterval(() => {
                this.currentTime = obj.innerHTML;
                this.totalTime = obj1.innerHTML;
            },0)
        }

        lookCourse(){
            // 查看课程

            if(!this.isBuy) return;
            this.courseShow = true;
        }

        btnClick() {
            // 点击按钮
            if(!(this.audio as any).paused){
                (this.audio as any).pause();
            }
            this.isPause = !this.isPause;
            (this.$refs.ChiZhanVideoVideo as any).doPlay(this.isPause);
        }

        videoPlay() {
            (this.audio as any).pause();
            this.isPause = false;
        }

        videoEnd() {
            this.isPause = false;
            if(!this.isPause) {
                this.isPause = true;
                let requestData = {
                    chapterSectionId: this.chapterSectionId
                }
                HomeModule.getNoListenSectionBroadcastEnd(requestData).then((res:any) => {
                    console.log('end')

                    if(this.isBuy === 0) {
                        this.seeState = true;
                    }

                })
            }
        }

        doPlayAudio() {
            // 点击播放音频
            let that = this;
            (this.audio as any).addEventListener('ended', function () {
                (that.audio as any).pause();// 暂停
                let requestData = {
                    chapterSectionId: that.chapterSectionId
                }
                HomeModule.getNoListenSectionBroadcastEnd(requestData).then((res:any) => {
                    console.log('end')
                    if(that.isBuy === 0) {
                        that.seeState = true;
                    }
                })
            }, false);
            (this.audio as any).addEventListener('play', function () {
                // 播放音频的时候  暂停视频
                if(!(that.audio as any).paused){
                    that.isPause = true;
                } else {
                    that.isPause = false;
                }
                (that.$refs.ChiZhanVideoVideo as any).setVideo()
            }, false);
        }

        confirm() {
            this.$router.push({
                path: '/home/orderInfo',
                query:{
                    id: this.cId,
                    userId: '0'
                }
            })
        }
    }
</script>

<style lang="scss">
.hbb-chi-video{
    display: flex;
    width: 100%;
}
.hbb-shiting{
    display: flex;
    width: 100%;
    height: 90px;
    align-items:center;
    justify-content: space-between;
    padding: 0 30px;
    .left{
        display: flex;
        align-items: center;
        color: #666;
        font-size: 26px;
    }
    .btn{
        width: 40px;
        height: 40px;
        margin-right: 20px;
        background-color: #ffc000;
        -webkit-mask: url(../../../../../assets/images/zhant.svg) center center / contain no-repeat;
        &.pause{
            -webkit-mask: url(../../../../../assets/images/zhan.svg) center center / contain no-repeat;
        }
   }
    .look{
        border-radius: 8px;
        padding: 0 20px;
        height: 52px;
        display: flex;
        align-items: center;
        border: 2px solid #ffc000;
        color: #ff9600;
        font-size: 26px;
    }
}
    .hbb-tip{
        display: flex;
        width: 100%;
        height:80px;
        background: #fff3f3;
        align-items: center;
        color: #ff9600;
        margin-bottom: 40px;
        justify-content: center;
    }
    .hbb-title-top{
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        width:100%;
        height: 80px;
        align-items: center;
        position: fixed;
        background: #fff;
        z-index:5;
        border-bottom: 2px solid #ddd;
        span{
            color: $color-ff9600;
            font-size: 36px;
        }
    }
    .hbb-title{
        display: flex;
        width: 100%;
        justify-content: center;
        padding: 40px 0;
        align-items: center;
        font-size: 24px;
        flex-direction: column;
        h2{
            font-weight: normal;
            margin-bottom: 10px;
        }
        p{
            font-size: 24px;
        }
    }
    .hbb-see-btn{
        display: flex;
        width: 100%;
        align-items: center;
        height: 80px;
        justify-content: center;
        border-top: 2px solid #ddd;
        span{
            font-size: 28px;
            width: 50%;
            text-align: center;
            height: 100%;
            line-height: 80px;
            &:nth-of-type(1){
                border-right: 2px solid #ddd;
            }
            &:nth-of-type(2){
                color: $color-main;
            }
        }
    }
    .hbb-video-con{
        display: flex;
        width: 100%;
        flex-direction:column;
        padding: 0 30px;
        font-size: 28px;

        p{
            img{
                width: 100% !important;
            }
        }

    }
</style>
