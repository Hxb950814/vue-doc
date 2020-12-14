<!-- 拖拽滑动 -->
<template>
    <div>
        <div id="default_drag_comp"
             @touchstart="down"
             @touchmove="move"
             @touchend="end"
        >
            <img @click="showPopup" :src="imgCore"
                 alt="">
            <span :class="isStart ? 'start' : ''" @click="playAudio"></span>
            <b @click="close">×</b>
        </div>
        <!--    详细页面弹层    -->
        <Detail ref="audioView" @stateEvent="stateEvent" @prevAudioEvent="prevAudioEvent" :page="page" @nextAudioEvent="nextAudioEvent" @IntroductionEvent="IntroductionEvent" @finishEvent="finishEvent"></Detail>
    </div>

</template>

<script lang="ts">
    import {Component, Vue,Prop} from 'vue-property-decorator';
    import Detail from './detail.vue';

    @Component({
        components: {
            Detail
        }
    })
    export default class extends Vue {
        @Prop({type:String,default:'0',required:false})
        courseListenSectionId!:string;
        @Prop({type:String,default:'',required:false})
        page!:string

        imgCore:string = ''; // 课程封面;

        currentObj:any = {}; // 当前小节对象

        isStart = false; // 是否开启音频
        isFirst = true; // 是否为第一次
        flags = false;
        position:any =  { x: 0, y: 0 };
        nx =  0;
        ny =  0;
        dx =  0;
        dy =  0;
        maxW  =  0;
        maxH  =  0;

        mounted() {
            this.$nextTick(() => {
                this.imgCore = (this.$parent as any).pageData.courseImgUrl;
            })
            this.currentObj = (this.$parent as any).currentAudio;
        }

        showPopup() {
            // 启动弹层
            (this.$refs.audioView as any).active(this.courseListenSectionId, 1);
        }

        pauseAudio(res:any) {
            // 暂停音频时间 点击切换音频进行播放
            this.isStart = true;
            this.currentObj = res;
            (this.$refs.audioView as any).pauseAudio1(this.isStart, res, 1);
        }

        paseAudio() {
            this.isStart = !this.isStart;
            (this.$refs.audioView as any).doPlay(this.isStart);

        }

        prevAudioEvent(res:any) {
            // 上一个视频
            this.$emit('prevAudioEvent' , res)
        }

        nextAudioEvent(res:any) {
            // 下一个视频
            this.$emit('nextAudioEvent' , res)
        }

        playAudio() {
            // 播放音频
            this.isStart = !this.isStart;

            if(!this.isStart) {
                this.$emit('zanFu');
            }else{
                this.$emit('startFu');
            }
            (this.$refs.audioView as any).doPlay(this.isStart);
        }

        stateEvent(res:any) {
            this.isStart = res;
            if(!this.isStart) {
                this.$emit('zanFu');
            }else{
                this.$emit('startFu');
            }
        }

        IntroductionEvent() {
            this.$emit('IntroductionEvent')
        }

        finishEvent() {
            this.$emit('finishEvent')
        }

        close() {
            this.$emit("closeEvent");
        }

        down(event:any) {
            // 手指按下事件
            let default_drag_comp = document.querySelector("#default_drag_comp") as HTMLElement;
            this.flags = true;
            var touch;
            if (event.touches) {
                touch = event?.touches[0];
            } else {
                touch = event;
            }
            this.maxW = document.body.clientWidth - default_drag_comp.offsetWidth;
            this.maxH = document.body.clientHeight - default_drag_comp.offsetHeight;

            this.position.x = touch.clientX - default_drag_comp.offsetLeft;
            this.position.y = touch.clientY - default_drag_comp.offsetTop;
            this.dx = touch.clientX;
            this.dy = touch.clientY;
        }

        move(event:any) {
            // 手指按下移动事件
            event.preventDefault();
            let default_drag_comp = document.querySelector("#default_drag_comp") as HTMLElement;
            if (this.flags) {
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                this.nx = touch.clientX - this.position.x;
                this.ny = touch.clientY - this.position.y;

                if (this.nx < 0) {
                    this.nx = 0;
                } else if (this.nx > this.maxW) {
                    this.nx = this.maxW;
                }

                if (this.ny < 0) {
                    this.ny = 0;
                } else if (this.ny >= this.maxH) {
                    this.ny = this.maxH;
                }

                default_drag_comp.style.left = this.nx + "px";
                default_drag_comp.style.top = this.ny + "px";
                //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
                document.addEventListener(
                    "touchmove",
                    function() {
                        // event.preventDefault();
                    },
                    false
                );
            }
        }

        end() {
            // 手指抬起事件
            this.flags = false;
        }
    }

</script>
<style scoped lang="scss">
    #default_drag_comp {
        width: 220px;
        height: 90px;
        border-radius:12px 50px 50px 12px;
        background: #ddd;
        position: fixed;
        z-index: 1000;
        bottom: 200px;
        left: 30px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
        img {
           width: 62px;
            height: 100%;
            border-radius: 12px;
        }
        span{
            width: 44px;
            height:44px;
            background: #fff;
            -webkit-mask: url(../../assets/images/y-zhan.svg) center center / contain no-repeat;
            &.start{

                background-color: #fff;
                -webkit-mask: url(../../assets/images/y-start.svg) center center / contain no-repeat;

            }
        }
        b{
            width: 40px;
            height: 40px;
            background: #aaa;
            color: #fff;
            border-radius: 50%;
            text-align: center;
            font-weight: normal;
            font-size: 30px;
            line-height: 40px;
        }
    }
</style>
