<template>
    <div class="hbb-home-box">

        <div class="hbb-main">
            <p class="h-t-tip">路漫漫其修远兮，吾将上下而求索！</p>
            <div class="hbb-title">
                <span>学习</span>
                <div class="icon" style="width:64px;height:24px;display: flex">
                    <span @click='goHelp' style="float:left;width: 24px;height: 24px">
                        <svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="height: calc(100% - 0px); width: calc(100% - 0px);"><path d="M799.68 672H736v-192h63.68l0.32-0.096L799.68 672zM288 672.032l-64 0.064L224.32 480H288V672.032zM799.68 416H736v-64.192C736 228.416 635.52 128 512 128s-224 100.416-224 223.808V416H224.32C188.864 416 160 444.672 160 479.904v192.192C160 707.328 188.864 736 224.32 736h94.848c0.288 0 0.544 0.16 0.832 0.16 0.32 0 0.544-0.16 0.864-0.16H352V351.808A160.064 160.064 0 0 1 512 192c88.224 0 160 71.68 160 159.808V736.16c0 34.144-8.352 58.24-25.536 73.664-16.544 14.88-42.912 22.944-78.144 24.384A63.68 63.68 0 0 0 512 800a64 64 0 0 0 0 128c22.816 0 42.72-12.032 54.048-29.984 53.312-1.44 94.208-14.56 123.2-40.576 31.04-27.872 46.72-68.672 46.72-121.28V736h63.744A64.16 64.16 0 0 0 864 672.096v-192.192A64.16 64.16 0 0 0 799.68 416z" style="fill: #666;"></path></svg></span>
                    <span @click='goNews'  style="float:left;width: 24px;height: 24px"><b></b></span>
                </div>
            </div>
            <!-- 首页导航 -->
            <TopNav :navList="topNavList"></TopNav>
            <!-- 轮播图 -->
            <div class="hbb-swiper-box" v-if="bannerList.length > 0">
                <BannerSlide :dataList="bannerList" class="slider" mode="3" :pagination="true"></BannerSlide>
            </div>
            <!-- 学习计划 -->
            <div class="hbb-learn-box">
                <div class="box">
                    <div>
                        <h2>学习计划</h2>
                        <p>学员：{{studentNo}}</p>
                    </div>
                    <p v-if="navList.length > 0" class="r" style="display: flex;align-items: center" @click="goMyClass(1)">
                        我的班级<van-icon name="arrow" size="12px"/>
                    </p>
                </div>

            </div>
            <!-- 所有课程 -->
            <TabNav :navList="coursesNav" page="knowledge"></TabNav>
        </div>
        <!-- 底部导航 -->
        <div class="footer">
            <Footer :active-index="2"></Footer>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";
    import BannerSlide from "@components/banner/banner-slide.vue";
    import TopNav from "@components/nav/topNav.vue";
    import TabNav from "@components/nav/tabNav.vue";
    import Footer from "@components/footer/index.vue";
    import {KnowledgeModule} from "@/store/modules/user/knowledge.ts";
    import {HomeModule} from "@/store/modules/user/home";

    @Component({components: {BannerSlide, TopNav, TabNav, Footer}})
    export default class extends Vue {
        bannerList: any = []; // 轮播图的数据源

        topNavList: any = []; // 首页导航的数据源

        studentNo:string = '';

        navList:any[] = []; // 我的班级的数据源

        coursesNav: any = []; // 所有课程的数据源


        mounted() {
            this.studentNo = HomeModule.getStudentNo;
            KnowledgeModule.getIconData().then((res:any) => {
                this.bannerList = res?.data?.iconAD || [];
                this.topNavList = (res?.data?.iconKnowledge || []).map((x:any) => {
                    return {
                        src: x.imageUrl,
                        title: x.imageTitle,
                        path: x.url,
                        power: x.power
                    }
                });
            })
            this.getSeekPageAllCourse();
            this.getmyClassList();

        }

        getmyClassList() {
            KnowledgeModule.getmyClassList().then((res:any) => {
                this.navList = res?.data || [];
            })
        }


        getSeekPageAllCourse() {
            // 获取导航
            KnowledgeModule.getSeekPageAllCourse().then((res:any) => {
                let obj = {
                    courseTypeName: '今日',
                    courseId: 0
                }
                this.coursesNav = res?.data || [];
                this.coursesNav.unshift(obj)
            })
        }

        goHelp() {
            this.$router.push({
                path: '/personal/help'
            })
        }

        goNews() {
            this.$router.push({
                path: '/personal/news'
            })
        }

        goMyClass(t:number) {
            this.$router.push({
                path: '/knowledge/myClass'
            })
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-home-box {
        width: 100%;
        .hbb-main {
            padding-bottom: 110px;
            padding-top: 90px;
            .hbb-swiper-box {
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
            .h-t-tip{
                display: flex;
                width: 100%;
                margin-top: 20px;
                margin-bottom: 10px;
                justify-content: center;
                color: #bbb;
            }
            .hbb-title{
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 99;
                height: 80px;
                background: #fff;
                box-shadow: rgb(221, 221, 221) 0px 0px 12px;
                justify-content: center;
                align-items: center;
                font-size: 30px;
                color: $base-font-color;
                div{
                    position: absolute;
                    right: 10px;
                    span{
                        margin-left: 15px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        b{
                            display: flex;
                            width: 40px;
                            height: 40px;
                            background-color: #666;
                            -webkit-mask: url(../../../../assets/images/xiaoxi.svg) center center / contain no-repeat;
                        }
                    }
                }
            }
            .hbb-learn-box{
                display: flex;
                width: 100%;
                margin-top:25px;
                justify-content: space-between;
                padding: 0 30px;
                height: 72px;

                .box{
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    background: #fff3f3;
                    padding: 0 30px;
                    align-items: center;
                    border-radius: 8px;
                    div{
                        display: flex;
                        align-items: center;
                        h2{
                            color: $base-font-color;
                            font-size: 26px;
                        }
                        p{
                            margin-left: 10px;
                            color:$color-gray;
                            font-size: 22px;
                        }
                    }
                    .r{
                        font-size: 24px;
                        color: $color-666;
                        span{
                            color: #0a8dff;
                        }
                    }
                }
            }
            .hbb-learn-bottom{
                display: flex;
                width: 100%;
                justify-content: center;
                margin: 25px 0 20px 0;
                color: #bbb;
            }
        }
    }
</style>
