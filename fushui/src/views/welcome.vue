<!-- 欢迎页面 -->
<template>
    <div class="container">
        <headbar />
        <div class="blocks-wrapper">
            <div class="blocks-wrapper-inner">
                <div class="block-union" @click="clickModule('02')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec1.png" alt="">
                    </div>
                    <div class="text">
                        数据
                    </div>
                </div>
                <div class="block-union" @click="clickModule('03')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec2.png" alt="">
                    </div>
                    <div class="text">
                        运营
                    </div>
                </div>
                <div class="block-union" @click="clickModule('04')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec3.png" alt="">
                    </div>
                    <div class="text">
                        K豆
                    </div>
                </div>
                <div class="block-union" @click="clickModule('05')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec4.png" alt="">
                    </div>
                    <div class="text">
                        用户
                    </div>
                </div>
                <div class="block-union" @click="clickModule('06')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec5.png" alt="">
                    </div>
                    <div class="text">
                        行情
                    </div>
                </div>
                <div class="block-union" @click="clickModule('07')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec6.png" alt="">
                    </div>
                    <div class="text">
                        交易
                    </div>
                </div>
                <div class="block-union" @click="clickModule('08')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec7.png" alt="">
                    </div>
                    <div class="text">
                        策略
                    </div>
                </div>
                <div class="block-union" @click="clickModule('09')">
                    <div class="image-wrap">
                        <img src="//rs.tanxingk.com/images/main_sec8.png" alt="">
                    </div>
                    <div class="text">
                        权限
                    </div>
                </div>
                <div class="block-union empty" />
                <div class="block-union empty" />
                <div class="block-union empty" />
                <div class="block-union empty" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Getter} from 'vuex-class';
    import {Headbar} from '@/views/layout/components/index';
    import mapsRouterData from '@/router/maps';

    @Component({
        components: {Headbar}
    })
    export default class Welcome extends Vue {
        @Getter('permissionList')
        permissionList: any;

        mounted() {
            // check一下是否登录
            this.$post('/admin/isLogin').then((res: any) => {
            });
        }

        clickModule(id: string) {
            if (!this.permissionList.includes(id)) {
                this.$showToast('您没有该模块权限');
                return;
            }
            this.$store.commit('SET_MODULE_ID', id); // 设置moduleID
            const secModuleMap = mapsRouterData.find((item: any) => {
                return String(item.id) === String(id);
            });

            if (secModuleMap) {
                this.$router.push({
                    path: secModuleMap.defaultLink
                });
            } else {
                this.$showToast('敬请期待');
                console.log('没有此模块,模块Id：', id);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-header {
        position: static;
    }

    .container {
        background: #fff;
        height: 100vh;
    }

    .blocks-wrapper {
        height: calc(100vh - 70px);
        overflow: auto;
        padding-top: 90px;

        .blocks-wrapper-inner {
            margin: 0 auto;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            max-width: 1300px;
            padding: 0 20px;
        }
    }

    .block-union {
        &.empty {
            border: none;
            height: 0;
        }

        &:hover {
            .image-wrap img {
                opacity: 1;
            }
        }

        width: calc((100% - 60px) / 4); // 间距20px 四等分
        @media screen and (max-width: 820px) {
            width: calc((100% - 40px) / 3);
        }
        @media screen and (max-width: 650px) {
            width: calc((100% - 20px) / 2);
        }
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid rgb(211, 211, 211);
        margin-bottom: 20px;
        cursor: pointer;

        .image-wrap {
            width: auto;

            img {
                opacity: .7;
                width: 100%;
            }
        }

        .text {
            user-select: none;
            line-height: 50px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            color: rgb(26, 126, 248);
        }
    }
</style>
