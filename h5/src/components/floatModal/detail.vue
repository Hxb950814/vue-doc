<template>
    <div>
        <van-popup
                v-model="audioShow"
                closeable
                close-icon="arrow-down"
                close-icon-position="top-left"
                position="bottom"
                :style="{ height: '100%' }"
                :overlay="false"
                v-show="isShow"
                get-container="body"
        >
            <div class="hbb-audio-boxM">
                <div class="img-main">
                    <img :src="imgCore"
                         alt="">
                </div>
                <div class="img-btn">
                    <span  @click="bookClick">书本小节</span>
                    <span @click="Introduction">书本简介</span>
                </div>
                <div class="img-tip">
                   {{currentObj.sectionTitle}}
                </div>
                <div class="img-audio">
                    <audio name="media"  controlsList="nodownload" :src="currentObj.contendUrl" id="audio" controls="controls">
                    </audio>
                </div>
                <div class="audio-btn">
                    <span class="a">
                        <img v-if="page !== 'course'" src="@assets/images/zjt.png" alt=""  @click="prevAudio">
                    </span>
                    <span class="b" @click="audioClick(1)">
                         <img src="@assets/images/t-zhan.png" alt="" v-if="!isStart">
                         <img src="@assets/images/t-start.png" alt="" v-if="isStart">
                    </span>
                    <span class="c">
                        <img v-if="page !== 'course'" src="@assets/images/yjt.png" alt=""  @click="nextAudio">
                    </span>
                </div>

            </div>
        </van-popup>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    @Component({})
    export default class extends Vue {
        @Prop({type:String,default:'',required:false})
        page!:string

        imgCore:string = ''; // 课程封面;
        currentObj:any = {}; // 当前小节对象
        progress = 0;
        audioShow = true;
        isShow = false;
        isStart = false; // 是否开始播放音频

        active(id:any,t:number) {
            // 激活组件
            if(t === 1) {
                this.isShow = true;
                this.audioShow = true;
            }
            this.imgCore = (this.$parent as any).imgCore;
            this.currentObj = (this.$parent as any).currentObj;
            console.log(this.currentObj)
            let _this = this;
            this.$nextTick(() => {
                let audio=document.getElementById('audio');
                if(audio){
                    if(t !== 1) {
                        (audio as any).play();
                    }
                    (audio as any).loop = false;
                    audio.addEventListener('ended', function () {
                        let requestObj = {
                            courseId: 5,
                            courseListenSectionId:id
                        };
                        HomeModule.getUpdateListenCourseById(requestObj).then((res:any) => {
                            _this.$emit('finishEvent')
                        })
                    }, false);
                }
            });

        }

        mounted() {

        }

        prevAudio() {
            // 上一个视频
            this.$emit('prevAudioEvent' , this.currentObj)
        }

        nextAudio() {
            // 下一个视频
            this.$emit('nextAudioEvent' , this.currentObj)
        }

        doPlay(status:any) {
            this.isStart = status;
            this.$nextTick(() => {
                this.audioClick(2);
            })

        }

        pauseAudio1(status:any, res:any, t:number) {
            // 动态切换音频之后
            this.isStart = status;
            let that = this;
            this.currentObj = res;
            const audio = document.getElementById('audio');

            setTimeout(() => {
                // 动态切换音频之后  先暂停当前的音频
                // 以下是进行赋值音频地址紧接着开始播放.
                if(t === 2) {
                    (audio as any).pause();
                    return false;
                }
                (audio as any).pause();
                (audio as any).setAttribute('src', res.contendUrl)
                setTimeout(() => {
                    (audio as any).play();
                },100);
                // this.isStart = (this.$parent as any).isStart = true;
                //监听到播放结束
                (audio as any).addEventListener('ended', function () {
                    that.isStart = false;
                    (that.$parent as any).isStart = that.isStart;
                }, false);
            }, 100)

        }

        audioClick(t:number) {
            // 点击操作音频
            if(t === 1) {
                this.isStart = (this.$parent as any).isStart =  !this.isStart;
                this.$emit('stateEvent', this.isStart)

            }

            let that = this;
            setTimeout(() => {
                const audio = document.getElementById('audio');
                if((audio as any).paused){
                    (audio as any).play();
                }
                else{
                    (audio as any).pause();// 暂停

                }
                //监听到播放结束
                (audio as any).addEventListener('ended', function () {
                    that.isStart = false;
                    (that.$parent as any).isStart = that.isStart;
                }, false);
            }, 0)

        }

        Introduction() {
            // 课程介绍
            this.audioShow = false;
            this.$emit('IntroductionEvent')
        }

        bookClick() {
            // 课程介绍
            this.audioShow = false;
            this.$emit('bookClick')
        }
    }
</script>

<style lang="scss">
.hbb-audio-boxM{
    display: flex;
    width: 100%;
    margin-top: 200px;
    flex-direction: column;
    justify-content: center;
    .img-main{
        width: 560px;
        display: flex;
        height: 560px;
        margin: 0 auto;
        background: url(https://file3.ih5.cn/v35/files/0457c28e0d01fd261ee753491d0e1d05_51311_700_700.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        justify-content: center;
        align-items: center;
        img{
            width: 240px;
            height: 340px;
            border-radius: 16px;
        }
    }
    .img-btn{
        width: 440px;
        display: flex;
        margin: 0 auto;
        margin-top: 40px;
        justify-content: space-between;
        span{
            padding: 0 30px;
            height: 56px;
            line-height: 56px;
            border-radius: 32px;
            border: 2px solid $color-ff9600;
            color: $color-ff9600;
        }
    }
    .img-tip{
        display: flex;
        margin-top: 50px;
        width: 100%;
        justify-content: center;
        color: $color-ff9600;
        height: 60px;
        align-items: center;
        background: #fff3f3;
    }
    .img-audio {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 30px;
        audio{
            width: 100%;
            border: none !important;
        }
        audio::-webkit-media-controls-play-button {
            display: none !important;
        }

        audio::-internal-media-controls-overflow-button {
            display: none !important;
        }

        audio::-webkit-media-controls-enclosure {
            background: none !important;
        }
    }
    .audio-btn{
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0 80px;
        margin-top: 20px;
        align-items: center;
        span{
            width: 60px;
            height: 60px;
            img{
                width: 100%;
                height: 100%;
            }
            &.b{
                width: 120px;
                height: 120px;
            }
        }

    }
}
</style>
