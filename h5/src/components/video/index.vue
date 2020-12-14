<template>
    <div style="width:100%;height: 100%">
        <div :id="playerId" :class="isBuy ? 'prism-player' : 'prism-player hbb-noBuy'"></div>
    </div>
</template>

<script lang="js">
export default {
    props:{
        isReload: {
            // 是否预加载
            type: Boolean,
            default: false
        },
        cover: {
            // 视频封面图
            type: String,
            default: ''
        },
        showBarTime: {
            // 视频控制条点击之后展示的时间段
            type: Number,
            default: 3000
        },
        autoplay: {
            // 是否自动播放
            type: Boolean,
            default: false
        },
        isLive: {
            // true：直播  false：点播
            type: Boolean,
            default: false
        },
        width: {
            // 容器宽度
            type: String,
            default: '100%'
        },
        height: {
            // 容器高度
            type: String,
            default: '210px'
        },
        controlBarVisibility: {
            // 视频控制台出现的方式 默认hover 支持 'hover', 'click', 'always'
            type: String,
            default: 'click'
        },
        progressMarkers: {
            // 进度条标记
            type: Array,
            default: []
        },
        x5_video_position: {
            type: String,
            default: "top"
        },
        x5_type: {
            type: String,
            default: "h5"
        },
        x5_fullscreen: {
            type: Boolean,
            default: false
        },
        x5_orientation: {
            type: Number,
            default: 2
        },
        autoPlayDelay: {
            type: Number,
            default:2
        },
        autoPlayDelayDisplayText: {
            type: String,
            default: '视频正在努力缓冲...'
        }
    },
    data() {
        return {
            playerId: "aliplayer_" + Math.random().toString(36).substr(2), // playerId
            player: null, // aliplayerDom
            danmukuList: [], // 弹幕列表
            isBuy: false, // 用户是否已经购买了课程 未购买的只有查看功能
            timer: 0, // 时间轮询对象
            timer1: 0  // 时间轮询对象
        };
    },
    mounted() {
    },
    methods: {
        doPlay(status) {
            // 连接外部控制的媒介 - video
            if(status) {
                this.player.pause();
                clearInterval(this.timer);
            } else {
                this.player.play();
                this.watchLookStatus();
            }
        },

        setVideo() {
            // 播放音频的时候  暂停视频
            this.player.pause();
        },

        setUrl(url) {
            this.source = url;
            this.isBuy = this.$parent.isBuy === 0 ? false : true;
            const _this = this;
            // 用户是否已经购买了课程 未购买的只有查看功能
            this.$nextTick(() => {
                this.player = new Aliplayer({
                    id: _this.playerId,
                    source: _this.source,
                    width: _this.width,
                    height:  _this.height,
                    autoplay: _this.autoplay,
                    isReload: _this.isReload,
                    isLive: _this.isLive,
                    controlBarVisibility: _this.controlBarVisibility,    /* The mode of the status bar, which is set to Click. */
                    extraInfo: _this.extraInfo,
                    cover: _this.cover,
                    x5_video_position: _this.x5_video_position,
                    x5_type: _this.x5_type,
                    x5_fullscreen: _this.x5_fullscreen,
                    x5_orientation: _this.x5_orientation,
                    autoPlayDelay: _this.autoPlayDelay,
                    playsinline: true,
                    useH5Prism:true,
                    autoPlayDelayDisplayText: _this.autoPlayDelayDisplayText,
                    showBarTime: _this.showBarTime
                    // 使用的组件库 [这里按照官网的导入方式导入就可以]
                    // 一般情况网站所需要的功能组件都是统一的  直接在这里定义就可以
                }, function (player) {
                    console.log('player is created!')
                    const text = document.getElementsByClassName('current-time')[0];
                    const textAll = document.getElementsByClassName('duration')[0];
                    _this.timer1 = setInterval(() => {
                        _this.$emit('updateShilookTime', text, textAll)
                    },1000);
                });
                _this.player.on('ended',function(e) {
                    clearInterval(_this.timer1);
                    _this.$emit('videoEnd');
                });
                _this.player.on('play',function(e) {
                    _this.$emit('videoPlay');
                });

                // 监听是否退出全屏事件
                window.onresize = function(){
                    _this.setLayout();
                };
                _this.player.on("requestFullScreen", function(){
                    _this.setLayout();
                });
            })

        },

        disposeEvent() {
            this.player.dispose();
        },
        setLayout () {
            //设置播放器容器的高度
            let height; //根据实际情况设置高度
            console.log(height)
            this.player.el().style.height = height;
        },
        watchLookStatus() {
            // 同步video的时间
          this.timer = setInterval(() => {
            if(this.player.getStatus() === 'ended') {
                clearInterval(this.timer)
                this.$emit('videoEnd')
                return false;
            };
          }, 500);
        }
    },
};
</script>

<style lang="scss">
.prism-player .prism-volume-control {
  left: auto !important;
  right: 125px;
}
.prism-player .prism-fullscreen-btn {
  margin-top: 30px !important;
  width: 40px;
  height: 40px;
}
.prism-player .prism-thumbnail {
  border: none;
}
.prism-player .prism-play-btn {
  width: 28px;
  height: 28px;
    margin-top: 30px !important;
}

.player-olympic-player-next {
  width: 24px;
  height: 28px;
}
.prism-volume {
  margin-top: 14px !important;
  margin-right: 12px !important;
}
.prism-player .prism-volume .volume-icon {
  width: 27px;
  height: 26px;
  background-repeat: no-repeat;
}
.prism-player .prism-volume .volume-icon .short-horizontal {
  width: 2px;
  height: 7px;
}
.prism-player .prism-volume .volume-icon .long-horizontal {
  width: 2px;
  height: 13px;
}
.prism-player .prism-volume .volume-icon.mute .short-horizontal {
  height: 13px;
  top: 7px;
}
.prism-player .prism-volume .volume-icon.mute .long-horizontal {
  top: 7px;
  height: 13px;
}
.prism-player .prism-cc-btn {
  height: 24px;
  width: 20px;
  margin-top: 14px !important;
  margin-right: 22px !important;
}
.prism-player .x5-top-left{
    object-position:center !important;
}
.prism-player .prism-setting-btn {
  width: 20px;
  height: 22px;
  margin-top: 15px !important;
  margin-right: 23px !important;
}
.prism-time-display {
  margin-top: 4px !important;
  margin-left: 20px !important;
}
.prism-setting-btn,
.prism-cc-btn {
  display: none;
}
.ali-danmuku-control .ali-danmu-input-wrap {
  width: 120px;
}
.ali-danmu-input .danmu-input-enter {
  top: -1px;
  height: 30px;
}
.quality-components,
.rate-components {
  margin-top: 7px;
}
.current-rate {
  width: 30px;
}
.prism-big-play-btn{
    position: absolute;
    left: 0  !important;
    bottom: 0  !important;
    display: block;
    right: 0  !important;
    top: 0  !important;
    margin: auto ;
}
.prism-player .prism-time-display {
  line-height: 46px;
}
.prism-player .prism-volume-control {
  right: 44px;
}
.prism-player .prism-time-display{
    line-height: 86px !important;
}
.prism-player .prism-volume{
    margin-top: 35px !important;
}
.hbb-noBuy .prism-controlbar {
    display: none !important;
}
.hbb-noBuy .prism-big-play-btn{
    display: none !important;
}
.hbb-noBuy .prism-big-play-btn{
    display: none !important;
}
</style>
