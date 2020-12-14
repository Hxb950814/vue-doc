<template>
    <div class="container">
        <tk-header class="normal" />
        <div class="main-self">
            <div class="login-area-block">
                <div>
                    <img src="https://rs.tanxingk.com/images/pc_login.png" alt="" class="logo">
                </div>
                <div class="login-section">
                    <p class="title">
                        用户注册
                    </p>
                    <div class="login-form">
                        <div class="form-line">
                            <label>账号:</label>
                            <input type="text" v-model.trim="account" placeholder="请输入您的手机号" style="width: 260px" maxlength="11">
                        </div>
                        <div class="form-line">
                            <label>图形验证码:</label>
                            <input type="text" v-model.trim="picCode" placeholder="请输入" style="width: 155px" maxlength="4">
                            <img :src="codeImgSrc" alt="" class="pic-code" style="width: 100px;margin-left: 2px" @click="getCode">
                        </div>
                        <div class="form-line">
                            <label>手机验证码:</label>
                            <input type="text" v-model.trim="code" placeholder="请输入" style="width: 155px" maxlength="4">
                            <button style="width: 100px;margin-left: 2px" class="msg-btn" :class="'status' + codeBtnStatus" :loading="codeBtnStatus === 1"
                                    @click="getPhoneCode"
                                    :disabled="codeBtnStatus !== 0"
                            >
                                <span class="text">
                                    {{ codeBtnStatus === 0 ? '获取' : codeBtnStatus === 1 ? '获取中' : timesCount + 's' }}
                                </span>
                            </button>
                        </div>
                        <div class="form-line" style="margin: 2px 0">
                            <div class="rule">
                                <label></label>
                                <div class="checkbox-theme">
                                    <input type="checkbox" id="checkbox_rand" v-model="checkedRule">
                                    <label for="checkbox_rand"></label>
                                </div>
                                我已经阅读并同意<a class="service-rule" target="_blank" href="/agreement/user">《下单大师服务协议》</a>
                            </div>
                        </div>
                        <div class="form-line">
                            <label />
                            <button style="width: 260px;" type="danger" class="login-btn" @click="register" :disabled="!checkedRule">
                                立即注册
                            </button>
                        </div>
                    </div>
                    <div>
                        <nuxt-link class="tips" to="/auth/login" style="margin-left: 102px">
                            已有账号？去登录
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <tk-footer />
        <input type="checkbox" name="hobby" value="1">
        <input type="radio" name="hobby" value="1">
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {isMobile} from '@common/src/utils/validate';
    import Cookie from 'js-cookie';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import {getAsync, postAsync} from '@/utils/request';

    let codeTimeHandle = -1;

    @Component({
        components: {
            TkHeader,
            TkFooter
        }
    })
    export default class extends Vue {
        account = '';
        picCode = ''; // 图片验证码
        randomKey = ''; // 图片验证码，对应key
        code = '';
        time = 60; // 倒计时
        checkedRule = false; // 服务协议
        codeBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中  2=请求成功，短信已发送
        loginBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中 2=请求成功，登录结果已返回

        inTimeCount = false;
        timesCount = 0;
        timeHandle = -1;

        codeImgSrc = '';

        mounted() {
            this.timeForGetCode();
            this.getCode();
        }

        beforeDestroy() {
            clearInterval(codeTimeHandle);
            codeTimeHandle = -1;
            clearTimeout(this.timeHandle);
            this.timeHandle = -1;
        }

        timeForGetCode() {
            if (codeTimeHandle) {
                clearInterval(codeTimeHandle);
            }
            codeTimeHandle = window.setInterval(() => {
                this.getCode();
            }, 1000 * 60);
        }

        /* 获取图片验证码 */
        async getCode() {
            this.timeForGetCode();
            const [_, resp] = await getAsync('/user/randomCode', {}, {responseType: 'arraybuffer'});
            if (resp) {
                // @ts-ignore
                this.randomKey = resp?.headers?.randomrandkey;
                this.codeImgSrc = 'data:image/png;base64,' + btoa(
                    new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }
        }

        async getPhoneCode() {
            if (!this.account) {
                this.$showToast('请输入手机号');
                return;
            }
            if (!isMobile(this.account)) {
                this.$showToast('手机号码格式错误');
                return;
            }
            // if (!this.picCode) {
            //     this.$showToast('请输入手机号');
            //     return;
            // }
            // 登录 注册
            this.codeBtnStatus = 1; // 变成获取中
            const [_, resp] = await postAsync('/user/sendCode', {
                mobileNum: this.account
            });
            if (resp?.code === '000000') {
                this.$showToast('验证码已发送');

                this.codeBtnStatus = 2;

                this.inTimeCount = true;
                this.timesCount = 60 - 1;

                this.timeHandle = window.setInterval(() => {
                    this.timesCount--;
                    if (this.timesCount < 0) {
                        clearInterval(this.timeHandle);
                        this.inTimeCount = false;
                        this.codeBtnStatus = 0;
                    }
                }, 1000);
                // return;
            } else {
                this.$showToast(resp?.message || '发送失败');
                this.codeBtnStatus = 0;
            }
        }

        async register() {
            if (!this.account) {
                this.$showToast('请输入手机号');
                return;
            }
            if (!isMobile(this.account)) {
                this.$showToast('手机号码格式错误');
                return;
            }
            if (!this.picCode) {
                this.$showToast('请输入图形验证码');
                return;
            }
            if (!this.code) {
                this.$showToast('请输入手机验证码');
                return;
            }
            if (!this.checkedRule) {
                this.$showToast('请勾选服务协议');
                return;
            }

            this.loginBtnStatus = 1;
            const [_, resp] = await postAsync('/user/userRegister', {
                mobileNum: this.account,
                verifyCode: this.code,
                randomCode: this.picCode,
                randomRandKey: this.randomKey,
                type: 2 // 0=h5,1=app,2=pc
            });
            this.loginBtnStatus = 0;
            if (resp?.code === '000000') {
                this.$showToast('注册成功');
                // 2秒后跳转到新页面
                this.account = '';
                this.code = '';
                // 保存下token和phone
                Cookie.set('token', resp.data, {
                    expires: 30,
                    path: '/'
                });
                await this.getPersonInfo();
                // window.setTimeout(() => {
                //     if (this.$route.query.to) {
                //         this.$router.push(this.$route.query.to + ''); // 回调
                //     } else {
                //         this.$router.push('/auth/login');
                //     }
                // }, 200);
            } else {
                this.$showToast(resp?.message || '注册失败');
            }
        }

        async getPersonInfo() {
            const [_, resp] = await postAsync('/user/queryPcUserInfoByLogin');
            if (resp?.code === '000000') {
                this.$store.commit('user/setUserName', resp?.data?.realityName || '');
                this.$store.commit('user/setUserLogined', true);
                this.$store.commit('user/setUserPortrait', resp?.data?.photo || '');
                this.$store.commit('user/setUserSigned', resp?.data?.isSign || false);
                this.$store.commit('user/setPhone', resp?.data?.phone || '');
                // 2秒后跳转到新页面
                // window.setTimeout(() => {
                if (this.$route.query.to) {
                    this.$router.push(decodeURIComponent(this.$route.query.to + '')); // 回调
                } else {
                    this.$router.push('/account');
                }
                // }, 100);
            } else {
                this.$showToast(resp?.message || '获取信息失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-self{
        min-height: $main-height;
        padding-top: 140px;
    }
    .login-form{
        .form-line{
            margin: 15px 0;
            .rule{
                padding-left: 154px;
                display: flex;
                align-items: center;
                .checkbox-theme{
                    margin-right: 5px;
                }
            }
        }
        .form-line > label{
            display: inline-block;
            width: 80px;
            font-size: 15px;
            line-height: 44px;
            text-align: right;
            margin-right: 10px;
            color: #333;
        }
    }
    .pic-code{
        display: inline-block;
        border: 1px solid #eaeaea;
        height: 44px;
    }
    .service-rule{
        color: $color-main;
        cursor: pointer;
    }
    input[type=checkbox]{
        /*width: 20px;*/
        /*height: 20px;*/
    }
</style>
