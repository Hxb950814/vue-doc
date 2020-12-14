<template>
    <div>
        <div
            :class="'swiper-container' + mode"
            class="swiper-container"
            @touchstart="touchstart"
            @touchend="touchend"
        >
            <div class="swiper-wrapper">

                <template v-if="mode === '2'">
                    <div
                        class="swiper-slide"
                        v-for="(item, index) in dataList"
                        :key="index"
                        @click="goToDetail(item)"
                    >
                        <img :src="item.courseImgUrl" alt="">
                        <div class="con">
                            <h2>{{item.courseName}}</h2>
                            <p>{{item.courseDescribe}}</p>
                            <b>¥{{(item.isLimitTimeDiscount === 1 ? item.discountPrice : item.markPrice) | money }} <s v-if="item.isLimitTimeDiscount === 1">¥{{item.markPrice | money}}</s></b>
                        </div>
                        <span class="courseLevel">
                            {{['初级', '进阶', '小白', '其他'][item.courseLevel]}}
                            <b></b>
                        </span>
                    </div>
                </template>
                <template v-else>
                    <div
                        :class="mode === '4' ? 'swiper-slide swiper-slide1' : 'swiper-slide'"
                        v-for="(item, index) in dataList"
                        :key="index"
                        @click="goToDetail(item)"
                    >
                        <img  :src="item.imageUrl" alt="">
                    </div>
                </template>
            </div>
            <template v-if="pagination">
                <div class="swiper-pagination" slot="“pagination”"></div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Swiper from "swiper";
import { getSubString } from "@/utils/index.ts"
import "swiper/css/swiper.min.css";
import {HomeModule} from "@/store/modules/user/home";
import config from "@/utils/config";
import {designatedSite} from "@/utils/index"; // 根据实际路径和文件修改

@Component({ components: {} })
export default class extends Vue {
  @Prop({ type: Array, default: [], required: false })
  dataList!: [];
  @Prop({ type: String, default: "1", required: false })
  mode!: string; // 1:banner图  2：热销课程
  @Prop({ type: Boolean, default: true, required: false })
  pagination!: boolean; // 1:展示分页  2：不展示分页

  mySwiper: any = null; // swiper 实例
  optionModeBanner: any = {
    notNextTick: true,
    initialSlide: 0,
    direction: "horizontal", // 水平切换选项
    loop: true, // 循环模式选项
    autoplay: {
      disableOnInteraction: false //手动滑动之后不打断播放
    },
    //滑动速度
    speed: 1000,
    // 如果需要分页器
    observer: true, //监听，当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    observeParents: true //修改swiper的父元素时，自动初始化swiper  如果修改外层样式，这个一定要加！！
  }; // banner图的轮播图配置

  optionModeHot: any = {
    slidesPerView: 0,
    spaceBetween: 0,
    //滑动速度
    // 如果需要分页器
    observer: true, //监听，当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
    observeParents: true //修改swiper的父元素时，自动初始化swiper  如果修改外层样式，这个一定要加！！
  }; // 热销课程的轮播图配置

  mounted() {
    this.init();
  }
    getStr (str:any) {
        return getSubString(str)
    }

  init() {
    // init
    const _this = this;
    this.$nextTick(() => {
      const setOption =
        _this.mode !== "2" ? _this.optionModeBanner : _this.optionModeHot;
      if(_this.mode === "2") return false;
        let swiperLength = _this.dataList.length;
        if(swiperLength > 1) {
            this.optionModeBanner.loop = true;
        } else {
            this.optionModeBanner.loop = false;
        }
      _this.mySwiper = new Swiper(".swiper-container" + _this.mode, setOption);
    });
  }

  touchstart() {
    // 手指触摸 停止轮播
    if (this.mode === "2") return;
    this.mySwiper.autoplay.stop();
  }

  touchend() {
    // 手指触摸 继续轮播
    if (this.mode === "2") return;
    this.mySwiper.autoplay.start();
  }
    goToDetail(item:any) {
      if(this.mode === '2') {
          console.log(item)
          this.$emit('goBuyEvent', item)
          return false;
      }
      if(item.url === '') {
          return false;
      }
        // power:0 无权限 并且是在我没有登录前提下
        if(HomeModule.getToken || item.power === 0){
            // 登录了或者后台没有配置icon权限
            this.$nextTick(()=> {
                window.location.href = item.url;
            })
        } else {
            if(designatedSite(item.url)) {
                location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(item.url)}&response_type=code&scope=snsapi_userinfo&state=STATE`;
                return false;
            } else {
                window.location.href = item.url;
                return false
            }
        }

    }
}
</script>

<style lang="scss">
.swiper-container {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  cursor: pointer;
  z-index: 1;
  .swiper-wrapper {
    height: 100%;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
  }
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  height: 100%;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  transition-property: transform;
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
  }
    .courseLevel{
        position: absolute;
        z-index: 5;
        display: flex;
        width: 32px;
        font-size: 20px;
        right: 45px;
        top: 0;
        color: #fff;
    }
    .con{
        position: absolute;
        display: flex;
        width: calc(100% - 20px);
        left: 20px;
        top: 20px;
        bottom: 20px;
        flex-direction: column;
        justify-content: flex-start;
        text-align: left;
        h2{
            color: #333;
            width: 80%;
            font-size: 28px;
            @include ellipsis(1)
        }
        p{
            color: #666;
            width: 50%;
            font-size: 24px;
            margin-top: 10px;
            @include ellipsis(2)
        }
        b{
            color: #ff2c27;
            font-size: 28px;
            display: flex;
            align-items: center;
            margin-top: 10px;
            position: absolute;
            bottom: 0;
            s{
                color: #cccccc;
                font-weight: normal;
                font-size: 20px;
                margin-left: 20px;
            }
        }
    }
}

.swiper-container2 {

  .swiper-slide {
    width: 350px !important;
    border-radius: 20px !important;
    overflow: hidden;
  }
}
.swiper-container3 {
    border-radius: 12px;
    .swiper-slide {
        border-radius: 12px;
        img{
            border-radius: 12px;
        }
    }
}

.swiper-pagination {
  width: 100%;
  height: 0.4rem;
  text-align: center;
  position: absolute;
  bottom: 0 !important;
  line-height: 0.4rem;
  box-sizing: border-box;
  padding: 0 0.3rem;
  font-size: 0;
  z-index: 3;
}

.swiper-pagination-bullet {
  background-color: #666;
  opacity: 1;
  width: 60px !important;
  height: 4px !important;
  margin: 0 10px !important;
}

.swiper-pagination-bullet-active {
  //设置小圆点激活颜色
  background-color: rgba(255, 255, 255, 1) !important;
  opacity: 1;
  width: 60px !important;
  height: 4px !important;
}

.swiper-container-autoheight,
.swiper-container-autoheight .swiper-slide {
  font-size: 0;
  position: relative;
}
</style>
