<!-- 侧边栏 -->
<template>
    <section class="nav account-sidebar">
        <section class="personal-info">
            <img alt="" class="head" :src="userPortrait" @click="clickShowHeadPanel">
            <p class="user-name">
                {{ userName }}
            </p>
            <div class="sign-button" :class="{disabled: userSigned}" @click="clickSign">
                <svg class="icon" viewBox="0, 0, 1024, 1024" stroke-width="2">
                    <path
                        d="M489.376 534.624a31.904 31.904 0 0 0 45.248 0l304-304a31.968 31.968 0 1 0-45.248-45.248l-304 304a31.968 31.968 0 0 0 0 45.248M832 480a32 32 0 0 0-32 32l0.256 288L224 800.256 223.744 224H512a32 32 0 0 0 0-64H223.744A63.84 63.84 0 0 0 160 223.744v576.512C160 835.392 188.608 864 223.744 864h576.512A63.84 63.84 0 0 0 864 800.256V512a32 32 0 0 0-32-32"
                        style="fill: #fff"
                    />
                </svg>
                签到
            </div>
            <div class="sign-button" style="background:none;color:#1a7ef8" @click="clickQuotation">
                <img style="width:18px;margin-right:8px" src="@/assets/svg/hq.svg">
                行情
            </div>
        </section>
        <div v-if="showHeadPanel" class="head-panel">
            <div class="head">
                <img alt="" class="pic" :src="userPortraitUpload" @click="clickShowHeadPanel">
                <input type="file" name="file" multiple="multiple" accept="image/jpeg,image/png,image/gif" @change="onHeadChange">
            </div>
            <button type="primary" @click="clickEditHeadSure">
                确定头像
            </button>
            <button @click="clickEditHeadCancel">
                取消
            </button>
        </div>
        <ol class="menu-list">
            <li :class="{active: activeFlag === 'deal'}">
                <nuxt-link class="link" to="/account/deal">
                    <svg class="icon" viewBox="0 0 90 90">
                        <path fill="#999" d="M45,49.75h.11a23.11,23.11,0,1,0,0-46.21H45a23.11,23.11,0,0,0,0,46.21Zm-16.17-23A16.14,16.14,0,0,1,45,10.58h.16a16.12,16.12,0,0,1-.05,32.23H45A16.13,16.13,0,0,1,28.85,26.7Z" />
                        <path fill="#999" d="M85.2,55.43a20.18,20.18,0,0,0-24.84-4.55A33.5,33.5,0,0,1,45,55.13a33.51,33.51,0,0,1-15.34-4.25A20.13,20.13,0,0,0,4.84,55.44,17.84,17.84,0,0,0,.5,67c0,10.76,10.15,19.51,22.63,19.51H66.87c12.48,0,22.63-8.75,22.63-19.5A17.26,17.26,0,0,0,85.2,55.43ZM79.73,60a10.54,10.54,0,0,1,2.67,6.93c-.05,6.88-7.06,12.48-15.64,12.48H23.34C14.75,79.42,7.75,73.83,7.75,67A10.4,10.4,0,0,1,10.43,60a12.81,12.81,0,0,1,9.79-4.49,13.8,13.8,0,0,1,6.34,1.6,40,40,0,0,0,18.52,5,40.06,40.06,0,0,0,18.52-5A13,13,0,0,1,79.73,60Z" />
                    </svg>
                    我的交易
                </nuxt-link>
            </li>
            <li :class="{active: activeFlag === 'transaction-account'}">
                <nuxt-link class="link" to="/account/transaction-account">
                    <svg class="icon" viewBox="0 0 40 40">
                        <g>
                            <g>
                                <polygon
                                    points="15.6,15.1 13.7,17 17.3,20.7 13.1,20.7 13.1,23.4 18.6,23.4 18.6,25.7 13.1,25.7 13.1,28.5 18.6,28.5 18.6,31.5 21.4,31.5 21.4,28.5 26.9,28.5 26.9,25.7 21.4,25.7 21.4,23.4 26.9,23.4 26.9,20.7 22.7,20.7 26.3,17 24.4,15.1 20,19.4"
                                    fill="#999"
                                />
                            </g>
                            <g>
                                <path
                                    d="M40,19.1L20,1.6L0,19.1l1.8,2.1L4.3,19v19.4h31.4V19l2.5,2.2L40,19.1z M33,35.7H7V16.6L20,5.2l13,11.3V35.7z"
                                    fill="#999"
                                />
                            </g>
                        </g>
                    </svg>
                    交易账户
                </nuxt-link>
            </li>
            <li :class="{active: activeFlag === 'kcoin'}">
                <nuxt-link class="link" to="/account/kcoin">
                    <svg class="icon" viewBox="0 0 40 40">
                        <g>
                            <g>
                                <path class="st0"
                                      d="M36.4,16.5C33.9,6.3,30.6-2.6,17.3,0.7C6.6,3.3,0.1,14.1,2.7,24.8C5,33.9,13.1,40,22.1,40 c1.6,0,3.2-0.2,4.8-0.6C39.5,36.3,38.9,26.6,36.4,16.5z M26.4,37.4c-9.6,2.4-19.3-3.5-21.6-13.1c-1.1-4.6-0.4-9.4,2.1-13.5 c2.5-4.1,6.4-7,11-8.1c1.7-0.4,3.2-0.6,4.5-0.6c7.7,0,10.1,6.6,12.1,14.9C37.1,27.7,36.7,34.9,26.4,37.4z"
                                      fill="#999"
                                />
                            </g>
                            <g>
                                <path class="st0"
                                      d="M27.6,29.3c-3-3.3-5.2-6.6-6.8-9.8c2.4-2.8,4.5-5.9,6.2-9.1c0.4-0.5,0.4-1.1,0-1.7c-0.4-0.5-0.9-0.7-1.5-0.7 c-0.6,0.1-1,0.4-1.3,0.9c-2,3.5-4.1,6.6-6.5,9.2V9.6c0-0.4-0.2-0.8-0.6-1.1c-0.6-0.5-1.5-0.5-2.2,0c-0.4,0.3-0.6,0.7-0.6,1.1v20.8 c0,0.4,0.2,0.7,0.5,1c0.7,0.7,1.6,0.7,2.3,0c0.3-0.3,0.5-0.7,0.5-1v-7.6l0.7-0.7c1.7,3.1,4,6.2,6.8,9.3c0.5,0.5,0.9,0.6,1.2,0.6 c0.1,0,0.2,0,0.4-0.1c1.1-0.4,1.2-1.2,1.2-1.5C28.1,29.8,27.9,29.5,27.6,29.3z"
                                      fill="#999"
                                />
                            </g>
                        </g>
                    </svg>
                    我的K豆
                </nuxt-link>
            </li>
            <li :class="{active: activeFlag === 'strategy'}">
                <nuxt-link class="link" to="/account/strategy">
                    <svg class="icon" viewBox="0 0 40 40">
                        <g>
                            <g>
                                <path class="st0"
                                      d="M11.7,11.9c-0.6,1-1.3,1.9-2.1,2.8l-1.6-1c1.7-1.8,2.9-3.8,3.7-5.9l1.8,0.4c-0.3,0.8-0.6,1.5-0.9,2.1h6.8v1.7 h-4.5c0.7,1,1.2,1.9,1.6,2.7l-1.7,0.6c-0.5-1.1-1.1-2.2-1.9-3.3H11.7z M8.3,15.9h10.6v-1.8h2v1.8h10.6v1.7H20.8v2.1h8.6v5 c0,1.4-0.7,2-2.1,2h-1.8L25.1,25l1.7,0.1c0.5,0,0.8-0.3,0.8-0.8v-2.9h-6.7v2.3c2.8,2.7,6.6,4.8,11.2,6.3l-1,1.7 c-4-1.5-7.4-3.6-10.2-6.2v6.8h-2v-6.7c-2.7,2.6-5.9,4.7-9.5,6.2l-1.1-1.7c4.2-1.5,7.7-3.7,10.6-6.5v-2.3h-6.3v5.3h-1.9v-6.9h8.2 v-2.1H8.3V15.9z M22.7,11.9c-0.5,0.9-0.9,1.7-1.4,2.4l-1.6-1.1c1.2-1.7,2.1-3.5,2.6-5.5l1.8,0.4c-0.2,0.8-0.5,1.5-0.7,2.1h7.9v1.7 h-4.9c0.7,1,1.2,1.9,1.6,2.7l-1.7,0.6c-0.5-1-1.1-2.1-1.8-3.3H22.7z"
                                      fill="#999"
                                />
                            </g>
                        </g>
                        <path
                            d="M32.8,39H7.2C3.8,39,1,36.2,1,32.8V7.2C1,3.8,3.8,1,7.2,1h25.7C36.2,1,39,3.8,39,7.2v25.7 C39,36.2,36.2,39,32.8,39z M7.2,3.1c-2.3,0-4.1,1.8-4.1,4.1v25.7c0,2.3,1.8,4.1,4.1,4.1h25.7c2.3,0,4.1-1.8,4.1-4.1V7.2 c0-2.3-1.8-4.1-4.1-4.1H7.2z"
                            fill="#999"
                        />
                    </svg>
                    我的策略
                </nuxt-link>
            </li>
            <li :class="{active: activeFlag === 'community'}">
                <a class="link" @click="clickNoOpen">
                    <svg class="icon" viewBox="0 0 40 40">
                        <g>
                            <g>
                                <path
                                    d="M35.3,3.6h-3.9c-2.8,0-5.6,0.6-8.2,1.7l-2.2,1c-0.3,0.1-0.6,0.2-0.9,0.2c-0.3,0-0.6-0.1-0.9-0.2l-2.2-1 c-2.6-1.1-5.4-1.7-8.2-1.7H4.7C2.1,3.6,0,5.7,0,8.3v20.6c0,2.6,2.1,4.7,4.7,4.7h3.9c2.8,0,5.6,0.6,8.2,1.7l2.2,1 c0.3,0.1,0.6,0.2,0.9,0.2c0.3,0,0.6-0.1,0.9-0.2l2.2-1c2.6-1.1,5.4-1.7,8.2-1.7h3.9c2.6,0,4.7-2.1,4.7-4.7V8.3 C40,5.7,37.9,3.6,35.3,3.6z M37.6,28.9c0,1.3-1.1,2.3-2.4,2.3h-3.9c-3.2,0-6.2,0.6-9.1,1.9L20,34l-2.2-1c-2.9-1.2-6-1.9-9.1-1.9 H4.7c-1.3,0-2.4-1-2.4-2.3V8.3C2.4,7,3.4,6,4.7,6h3.9c2.5,0,4.9,0.5,7.2,1.5l2.2,1c0.6,0.3,1.2,0.4,1.9,0.4c0.6,0,1.3-0.1,1.9-0.4 l2.2-1c2.3-1,4.7-1.5,7.2-1.5h3.9c1.3,0,2.4,1,2.4,2.3V28.9z"
                                    fill="#999"
                                />
                            </g>
                            <g>
                                <path class="st0"
                                      d="M32.8,17.1c-2.6,0-5.3,0.2-8,1.3c-0.9,0.4-1.6,1.2-1.6,1.8c0,0.4,0,0.8,0,1c0,1.1,0.7,1.7,1.6,1.4 c2.7-0.7,3.8-1.2,8-1.6c0.9-0.1,1.6-0.6,1.6-1.6v-0.7C34.4,17.8,33.7,17.1,32.8,17.1z"
                                      fill="#999"
                                />
                            </g>
                            <g>
                                <path class="st0"
                                      d="M15.2,11.2L15.2,11.2c-2.7-1.1-5.3-1.3-8-1.3c-0.9,0-1.6,0.7-1.6,1.6v13.8c0,0.9,0.7,1.6,1.6,1.6 c2.6,0,5.3,0.1,8,0.9c0.9,0.3,1.6-0.4,1.6-1.5c0-0.6,0-12.8,0-13.3C16.7,12.4,16,11.6,15.2,11.2z"
                                      fill="#999"
                                />
                            </g>
                            <g>
                                <path class="st0"
                                      d="M32.8,9.9c-2.6,0-5.3,0.2-8,1.3c-0.9,0.4-1.6,1.2-1.6,1.8c0,0.4,0,1.2,0,1.8c0,1.1,0.7,1.7,1.6,1.4 c2.7-0.7,3.8-1.2,8-1.6c0.9-0.1,1.6-0.7,1.6-1.6v-1.5C34.4,10.6,33.7,9.9,32.8,9.9z"
                                      fill="#999"
                                />
                            </g>
                        </g>
                    </svg>
                    我的社区
                </a>
            </li>
            <li :class="{active: activeFlag === 'setting'}">
                <nuxt-link class="link" to="/account/setting">
                    <svg class="icon" viewBox="0 0 40 40">
                        <g>
                            <g>
                                <path class="st0"
                                      d="M29.2,2.6H3.8v34.8h32.4V11.7h-5.6c-0.8,0-1.4-0.6-1.4-1.4V2.6z M3,0.5h27.2L38.3,11v27.2 c0,0.8-0.6,1.4-1.4,1.4H3c-0.8,0-1.4-0.6-1.4-1.4V1.9C1.7,1.1,2.3,0.5,3,0.5z"
                                      fill="#999"
                                />
                            </g>
                            <g>
                                <path class="st0"
                                      d="M24.8,18.5c2.2,1,2.8,0.9,2.8,2.8c0,0.2,0,0.3,0,0.3H12.4c0,0,0,0.2,0-0.3c0-1.9,0.7-1.8,2.8-2.8 c0.7-0.4,3.1-1.4,3.1-1.4s0.1-0.5,0-0.9c-0.5-0.3-1.1-1.7-1.2-2.3c-0.5-0.2-0.7-1.2-0.7-1.4c0-0.2,0-0.6,0.4-0.7 c-0.1-0.3-0.2-0.6-0.2-1c0-0.1,0-0.2,0-0.2c0-0.1,0-0.2,0-0.2c0-1.8,1.5-2.8,3.4-2.8c1.9,0,3.4,1,3.4,2.8c0,0.1,0,0.2,0,0.2 c0,0.1,0,0.2,0,0.2c0,0.3-0.1,0.6-0.2,1c0.3,0,0.4,0.5,0.4,0.7c0,0.2-0.2,1.1-0.7,1.4c-0.1,0.6-0.6,2-1.2,2.3 c-0.1,0.4,0,0.9,0,0.9S24.1,18.2,24.8,18.5L24.8,18.5z M10.6,25.8h18.8v2.1H10.6V25.8z M10.6,30.8h18.8v2.1H10.6V30.8z"
                                      fill="#999"
                                />
                            </g>
                        </g>
                    </svg>
                    账号设置
                </nuxt-link>
            </li>
        </ol>
        <div v-if="showSignSuccess" class="animation-mask">
            <div class="sun" />
            <div class="flower" />
            <p class="tips">
                签到成功<span v-if="rewardToday > 0">+{{ rewardToday }}K豆</span>
            </p>
        </div>
    </section>
</template>
<script lang="ts">
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
    import { Getter } from 'vuex-class';
    import Cookie from 'js-cookie';
    import { postAsync } from '@/utils/request';

    @Component({
        asyncData() {
            return {};
        }
    })
    export default class TkAccountSidebar extends Vue {
        activeFlag = '';
        showSignSuccess = false;
        rewardToday = 0;
        userSigned = false;

        showHeadPanel = false;
        userPortraitUpload = '';
        userPortraitUploadServerPath = ''; // 服务器地址

        // @Getter('userPortrait')
        userPortrait = '';

        @Getter('userName')
        userName!: string;

        mounted() {
            this.userSigned = this.$store.getters.userSigned;
            this.userPortrait = this.$store.getters.userPortrait;
            this.setActiveFlag(this.$route.path + '');
        }

        @Watch('$route.path')
        onRouterPathChange(val: string) {
            this.setActiveFlag(val);
        }

        setActiveFlag(path: string) {
            if (/.*\/deal\/?.*/.test(path)) {
                this.activeFlag = 'deal';
            } else if (/.*\/kcoin\/?.*/.test(path)) {
                this.activeFlag = 'kcoin';
            } else if (/.*\/transaction-account\/?.*/.test(path)) {
                this.activeFlag = 'transaction-account';
            } else if (/.*\/strategy\/?.*/.test(path)) {
                this.activeFlag = 'strategy';
            } else if (/.*\/setting\/?.*/.test(path)) {
                this.activeFlag = 'setting';
            }
        }

        async clickSign() {
            const [_, resp] = await postAsync('/transIndex/doSignIn');
            if (resp?.code === '000000') {
                this.showSignSuccess = true;
                this.rewardToday = resp?.data?.reward || 0;
                setTimeout(() => {
                    this.showSignSuccess = false;
                }, 5000);
                this.userSigned = true; // 签到成功
            } else {
                this.$showToast(resp?.message || '签到失败');
            }
        }

        clickShowHeadPanel() {
            this.showHeadPanel = true;
            this.userPortraitUpload = this.userPortrait;
        }

        // 点击上传头像
        async clickEditHeadSure() {
            if (this.userPortraitUpload === this.userPortrait) { // 没发生上传
                this.showHeadPanel = false;
                return;
            }
            if (this.userPortraitUploadServerPath === '') { // 上传失败了
                this.showHeadPanel = false;
            }
            this.$showLoading();
            const [_, resp] = await postAsync('/systemInstall/updateHeadPhotoInfo', {
                photo: this.userPortraitUploadServerPath
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.showHeadPanel = false;
                this.userPortrait = this.userPortraitUploadServerPath;
            } else {
                this.$showToast(resp?.message || '更新失败');
            }
        }

        clickEditHeadCancel() {
            this.showHeadPanel = false;
        }

        onHeadChange(e: any) {
            // console.log(e.target.files);
            const file = e.target.files[0] as File;
            // console.log(file);
            if (file) {
                if (file.size > 1024 * 1024 * 5) {
                    this.$showToast('图片不能大于5M');
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    this.userPortraitUpload = '' + reader.result;
                    (async () => {
                        await this.uploadImage(file);
                    })();
                };
                reader.readAsDataURL(file);
            }
        }

        async uploadImage(file: File) {
            const formData = new FormData();
            formData.append('fileName', file);
            const [_, resp] = await postAsync('/upload/fileUpload', formData, {
                paramType: 'file'
            });
            if (resp?.code === '000000') {
                const url = resp.data.fileUrl; // Get url from response
                console.log('上传成功,', url);
                this.userPortraitUploadServerPath = url;
            } else {
                this.userPortraitUploadServerPath = '';
            }
        }

        clickNoOpen() {
            this.$showToast('敬请期待');
        }

        clickQuotation() {
            // 点击行情 ，如果用户未登录期货账号的情况下 不展示手动下单部分 则 按之前流程
            window.open('/future/deal', '_self');
        }
    }
</script>

<style lang="scss">
    .animation-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: $z-sign-mask;
        background-color: rgba(0, 0, 0, .5);

        .sun {
            position: fixed;
            z-index: 5001;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 400px;
            height: 400px;
            background: url(#{$cdn-path}/images/checkin_light_img.png) top/ 100% 100% no-repeat;
            display: flex;
            animation: animRotate 5s linear infinite;
        }

        .flower {
            position: fixed;
            z-index: 5002;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 100px;
            height: 100px;
            background: url(#{$cdn-path}/images/checkin_kbeans.png) top/ 100% 100% no-repeat;
        }

        @keyframes animRotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .tips {
            text-align: center;
            position: absolute;
            z-index: 5005;
            top: 40%;
            bottom: 0;
            margin: auto;
            transform: translateY(200px);
            width: 100%;
            font-weight: bold;
            font-size: 25px;
            color: #fff;

            > span {
                font-size: 25px;
                color: #fff;
            }
        }
    }
    .head-panel{
        width: 200px;
        border-radius: 5px;
        padding-bottom: 10px;
        background-color: #fff;
        border: 1px solid #ccc;
        position: absolute;
        top: 0;
        left: 158px;
        z-index: 9999;
        .head{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            margin:  20px auto 20px;
            border: 1px solid #eaeaea;
            position: relative;
            >.pic{
                width: 100%;
                height: 100%;
                position: absolute;
                top:0;
                left:0;
                z-index: 99;
                pointer-events: none;
                object-fit: contain;
            }
            input{
                opacity: 0;
                width: 100%;
                height: 100%;
            }
        }
        button{
            height: 34px;
            line-height: 34px;
            width: 120px;
            display: block;
            margin: 0 auto 10px;
        }
    }
    .account-sidebar{
        position: relative;
    }
</style>
