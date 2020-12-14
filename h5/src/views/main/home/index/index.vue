<template>
    <div class="hbb-home-box">
        <div class="hbb-main">
            <!--   轮播图部分     -->
            <div class="hbb-swiper-box">
                <BannerSlide
                        :dataList="bannerList"
                        class="slider"
                        mode="1"
                        :pagination="true"
                ></BannerSlide>
            </div>
            <!-- 首页导航 -->
            <TopNav :navList="topNavList"></TopNav>
            <div class="hbb-hot-nav">
                <h2>热销课程</h2>
                <div>
                    <BannerSlide
                            :dataList="hotNav"
                            class="hotSlider"
                            mode="2"
                            @goBuyEvent="goBuy"
                    ></BannerSlide>
                </div>
                <div class="hbb-noData" v-if="hotNav.length === 0">
                    暂无数据
                </div>
            </div>
            <div class="hbb-swiper-box hbb-swiper-box1" v-if="advertisingList.length > 0">
                <BannerSlide
                    :dataList="advertisingList"
                    class="slider"
                    mode="3"
                    :pagination="true"
                ></BannerSlide>
            </div>
            <!-- 所有课程 -->
            <TabNav :navList="coursesNav" class="hbb-index-page" page="home"></TabNav>
        </div>


        <!-- 底部导航 -->
        <div class="footer">
            <Footer :active-index="1"></Footer>
        </div>
    </div>
</template>

<script lang="ts" scope>
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";
    import {HomeModule} from '@/store/modules/user/home.ts';
    import BannerSlide from "@components/banner/banner-slide.vue";
    import TopNav from "@components/nav/topNav.vue";
    import TabNav from "@components/nav/tabNav.vue";
    import Footer from "@components/footer/index.vue";

    @Component({components: {BannerSlide, TopNav, TabNav, Footer}})
    export default class extends Vue {
        bannerList: any = []; // 轮播图的数据源
        topNavList: any = []; // 首页导航的数据源
        hotNav: any = []; // 热销课程的数据源
        advertisingList: any = []; // 首页广告的数据源

        coursesNav: any = []; // 所有课程的数据源
        coursesCurrent:number = 0;
        courseId:number = 0;

        async mounted() {
            this.getData();
            this.getQueryHotCourseList();
            this.getQueryAllNoListenCourse();
        }



        getQueryAllNoListenCourse() {
            // 所有课程
            HomeModule.getQueryAllNoListenCourse().then((res:any) => {
                console.log(res)
                let obj = {
                    courseTypeName: '推荐',
                    courseId: 0
                }
                this.coursesNav = res?.data || [];
                this.coursesNav.unshift(obj)

            })
        }

        getQueryHotCourseList() {

            HomeModule.getQueryHotCourseList().then((res:any) => {
                this.hotNav = res?.data || [];
            })
        }

        getData() {

            HomeModule.getIconData().then((res:any) => {
                this.bannerList = res?.data?.iconBanner || [];
                this.topNavList = (res?.data?.iconIndex || []).map((x:any) => {
                    return {
                        src: x.imageUrl,
                        title: x.imageTitle,
                        path: x.url,
                        power: x.power
                    }
                });
                this.advertisingList = res?.data?.iconAD || [];
            })
        }


        goBuy(item:any) {
            // 去购买页面
            this.$router.push({
                path: '/home/curriculum',
                query: {
                    id: item.courseTypeId
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-home-box {
        width: 100%;
        .hbb-main {
            padding-bottom: 110px;
            .hbb-swiper-box {
                display: flex;
                width: 100%;
                height: 320px;
                .slider {
                    height: 100%;
                    width: 100%;
                }
                &.hbb-swiper-box1{
                    margin-top: 30px;
                    padding: 0 30px;
                    margin-bottom: 30px;
                    border-radius: 12px;
                    overflow: hidden;
                    height: 140px;
                    .slider{
                        img{
                            border-radius: 12px !important;
                        }

                    }
                }
            }
            .hbb-hot-nav {
                display: flex;
                width: 100%;
                margin-top: 35px;
                flex-direction: column;
                padding-left: 30px;
                h2 {
                    font-size: 32px;
                    color: $base-font-color;
                    margin-bottom: 20px;
                }
                .hotSlider {
                    height: 204px;
                }
            }
            .hbb-index-page{
                .van-tab{
                    width:160px !important;
                }
            }

        }
    }
</style>
