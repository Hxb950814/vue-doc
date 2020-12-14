<template>
    <div class="hbb-home-box">
        <div class="hbb-main">
            <!-- 个人信息部分 -->

            <div class="hbb-personal-top">
                <div class="top">
                    <span v-if="token" @click="goSetting" style="width: 20px;height: 20px"><svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="height: calc(100% - 0px); width: calc(100% - 0px);"><path d="M588.8 128l12 83.2 4.8 34.4 31.2 14.4c12.8 6.4 26.4 13.6 38.4 21.6l28 18.4 31.2-12 81.6-32 76 127.2-67.2 51.2-28 21.6 3.2 35.2c0.8 7.2 0.8 14.4 0.8 20.8s0 13.6-0.8 20.8l-3.2 35.2 28 21.6 67.2 51.2-75.2 127.2-82.4-32-31.2-12-28 18.4c-12.8 8.8-25.6 16-38.4 21.6l-31.2 14.4-4.8 33.6-12 84H435.2l-12-83.2-4.8-34.4-31.2-14.4c-12.8-6.4-26.4-13.6-38.4-21.6l-28-18.4-31.2 12L208 768l-76-127.2 67.2-51.2 28-21.6-3.2-35.2c-0.8-7.2-0.8-14.4-0.8-20.8s0-13.6 0.8-20.8l3.2-35.2-28-21.6-67.2-51.2L207.2 256l82.4 32 31.2 12 28-18.4c12.8-8.8 25.6-16 38.4-21.6l31.2-14.4 4.8-33.6L435.2 128h153.6m8.8-64H426.4c-27.2 0-49.6 19.2-53.6 44.8L360 201.6c-16 7.2-31.2 16-47.2 26.4l-90.4-35.2c-6.4-2.4-12.8-3.2-19.2-3.2-19.2 0-37.6 9.6-46.4 26.4L71.2 360c-13.6 22.4-8 52 12.8 68l76 57.6c-0.8 9.6-1.6 18.4-1.6 26.4s0 16.8 1.6 26.4l-76 57.6c-20.8 16-26.4 44-12.8 68l84.8 143.2c9.6 16.8 28 27.2 47.2 27.2 6.4 0 12-0.8 18.4-3.2L312 796c15.2 10.4 31.2 19.2 47.2 26.4l13.6 92c3.2 25.6 26.4 45.6 53.6 45.6h171.2c27.2 0 49.6-19.2 53.6-44.8l13.6-92.8c16-7.2 31.2-16 47.2-26.4l90.4 35.2c6.4 2.4 12.8 3.2 19.2 3.2 19.2 0 37.6-9.6 46.4-26.4l85.6-144.8c12.8-23.2 7.2-51.2-13.6-67.2l-76-57.6c0.8-8 1.6-16.8 1.6-26.4 0-9.6-0.8-18.4-1.6-26.4l76-57.6c20.8-16 26.4-44 12.8-68l-84.8-143.2c-9.6-16.8-28-27.2-47.2-27.2-6.4 0-12 0.8-18.4 3.2L712 228c-15.2-10.4-31.2-19.2-47.2-26.4l-13.6-92c-4-26.4-26.4-45.6-53.6-45.6zM512 384c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128m0-64c-105.6 0-192 86.4-192 192s86.4 192 192 192 192-86.4 192-192-86.4-192-192-192z" style="fill: rgb(255, 255, 255);"></path></svg></span>
                    <span @click="goNews" style="width: 24px;height: 24px"><b></b></span>
                </div>
                <div class="middle">
                    <template v-if="token">
                        <div class="imgBox">
                            <img :src="head" alt="">
                        </div>
                        <div>
                            <h2 class="ellipsis">{{name}}</h2>
                            <p>学号：{{studentNo}}</p>
                        </div>
                    </template>
                    <template v-else>
                        <div class="imgBox"  @click="goLogin">
                            <img src="@assets/images/wdl.png" alt="">
                        </div>
                        <div  @click="goLogin">
                            <h2 class="ellipsis" style="display: flex;align-items: center">登录微信<van-icon name="arrow" size="15" color="#fff"/></h2>
                        </div>
                    </template>
                </div>
                <div class="bottom">
                    <!-- 首页导航 -->
                    <TopNav :navList="topNavList" page="my"  v-if="topNavList.length > 0"></TopNav>
                </div>
            </div>
            <!-- 首页导航 -->
            <TopNav :navList="topNavData"  v-if="topNavData.length > 0"></TopNav>
            <!-- 轮播图 -->
            <div class="hbb-swiper-box hbb-swiper-box1" v-if="bannerList.length > 0">
                <BannerSlide :dataList="bannerList" class="slider" mode="3" :pagination="true"></BannerSlide>
            </div>
            <!-- 互动打卡 -->
            <div class="hbb-interactive-box"  v-if="interactiveList.length > 0">
                <h2>互动打卡</h2>
                <div class="list">
                    <div :style="{background: 'url(' + item.src +')'}" v-for="(item,index) in interactiveList" :key="index" @click ='goPage(item)'>
                        <h2>{{item.title}}</h2>
                        <p>{{item.description}}</p>
                    </div>
                </div>
            </div>·
            <!-- 推荐工具 -->
            <div class="hbb-interactive-box hbb-tools-box" v-if="tools.length > 0">
                <h2>推荐工具</h2>
                <div class="list">
                    <div v-for="(item,index) in tools" :key="index">
                        <img :src="item.src" alt="">
                        <h2>{{item.title}}</h2>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部导航 -->
        <div class="footer">
            <Footer :active-index="3"></Footer>
        </div>
    </div>
</template>

<script lang="ts" scope>
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";
    import {HomeModule} from '@/store/modules/user/home.ts';
    import {PersonalModule} from '@/store/modules/user/personal.ts';
    import { setUserInfo } from '@/utils/index.ts';
    import BannerSlide from "@components/banner/banner-slide.vue";
    import TopNav from "@components/nav/topNav.vue";
    import Footer from "@components/footer/index.vue";
    import config from "@/utils/config";
    import {designatedSite} from "@/utils/index";

    @Component({components: {TopNav,Footer,BannerSlide}})
    export default class extends Vue {
        token = '';
        head = '';
        name = '';
        studentNo = '';
        bannerList: any = []; // 轮播图的数据源

        topNavList: any = []; // 首页导航的数据源

        topNavData: any = []; // 首页导航的数据源

        interactiveList: any = []; // 打卡的数据源

        tools: any = []; // 推荐工具的数据源


        mounted () {

            PersonalModule.getMyIconData().then((res:any) => {
                // 我的页面的广告图管理
                this.bannerList = res?.data?.list8 || [];
                // 资产icon
                this.topNavList = (res?.data?.list6 || []).map((x:any) => {
                    return {
                        src: x.imageUrl,
                        title: x.imageTitle,
                        path: x.url,
                        power: x.power
                    }
                });
                // 汇总icon
                this.topNavData = (res?.data?.list5 || []).map((x:any) => {
                    return {
                        src: x.imageUrl,
                        title: x.imageTitle,
                        path: x.url,
                        power: x.power
                    }
                });
                // 互动icon
                this.interactiveList = (res?.data?.list4 || []).map((x:any) => {
                    return {
                        src: x.imageUrl,
                        title: x.imageTitle,
                        path: x.url,
                        power: x.power,
                        description: x.description
                    }
                });
                // 工具icon
                this.tools = (res?.data?.list3 || []).map((x:any) => {
                    return {
                        src: x.imageUrl,
                        title: x.imageTitle,
                        path: x.url,
                        power: x.power
                    }
                });
            });
            this.token = HomeModule.getToken;
            if(!this.token){
                setUserInfo();
            } else {
                this.head = HomeModule.getHead;
                this.name = HomeModule.getNickName;
                this.studentNo = HomeModule.getStudentNo;
            }
        }

        goSetting() {
            this.$router.push({
                path: '/personal/settings'
            })
        }

        goPage(item:any) {
            // 跳转路由页面
            if(item.path === '') {
                this.$toast('敬请期待！')
                return false;
            }
            // power:0 无权限 并且是在我没有登录前提下
            if(HomeModule.getToken || item.power === 0){
                // 登录了或者后台没有配置icon权限
                this.$nextTick(()=> {
                    window.location.href = item.path;
                })
            } else {
                if(designatedSite(item.path)) {
                    window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(item.path)}&response_type=code&scope=snsapi_userinfo&state=STATE`;
                    return false
                } else {
                    window.location.href = item.path;
                    return false
                }

            }
        }

        goNews() {
            this.$router.push({
                path: '/personal/news'
            })
        }

        goLogin() {
            location.href=
                `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(location.href)}&response_type=code&scope=snsapi_userinfo&state=STATE`;
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-home-box {
        width: 100%;
        .hbb-main {
            padding-bottom: 110px;
            .hbb-personal-top {
                display: flex;
                width: 100%;
                height: 400px;
                background: linear-gradient(to right, #0085ff 0%, #00afff 100%);
                position: relative;
                border-radius: 0px 0px 20px 20px;
                flex-direction: column;
                .top{
                    position: absolute;
                    right: 30px;
                    top:30px;
                    color: #fff;
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    align-items: center;
                    height: 40px;
                    span{
                        margin-left: 20px;
                        font-size: 28px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        b{
                            display: flex;
                            width: 40px;
                            height: 40px;
                            background-color: #fff;
                            -webkit-mask: url(../../../../assets/images/xiaoxi.svg) center center / contain no-repeat;
                        }
                    }
                }
                .middle{
                    display: flex;
                    width: 100%;
                    margin-top: 90px;
                    align-items: center;
                    padding: 0 30px;
                    .imgBox{
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-right: 30px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    div{
                        color: #fff;
                        h2{
                            font-size: 32px;
                        }
                        p{
                            font-size: 24px;
                            margin-top: 12px;
                        }
                    }
                }
                .bottom{
                    margin-top:10px;
                    p{
                        color:#fff !important;
                    }

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
            .hbb-interactive-box{
                display: flex;
                width: 100%;
                margin-top: 30px;
                padding: 0 30px;
                flex-direction: column;
                h2{
                    font-size: 28px;
                    margin-bottom: 20px;
                }
                .list{
                    width: 100%;
                    margin-top: 10px;
                    div{
                        width: 336px;
                        height: 120px;
                        margin-bottom: 16px;
                        margin-right: 16px;
                        flex-shrink: 0;
                        float: left;
                        background-repeat: no-repeat !important;
                        background-position: center center !important;
                        background-size: cover !important;
                        padding: 0 30px;
                        h2{
                            color: $base-font-color;
                            font-size: 30px;
                            font-weight: normal;
                            margin-top: 20px;
                            margin-bottom: 0;
                        }
                        p{
                            color: #ff2c27;
                            font-size: 24px;
                            margin-top: 4px;
                            font-weight: bold;
                        }
                        &:nth-of-type(2n){
                            margin-right: 0;
                        }
                    }
                }
            }
            .hbb-tools-box{
                .list{
                    div{
                        width: 172px;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        margin: 30px 0px 40px 0px;
                        img{
                            width: 64px;
                            height: 64px;
                        }
                        h2{
                            font-size: 26px;
                            color: $base-font-color;
                        }
                    }
                }
            }
        }
    }

</style>
