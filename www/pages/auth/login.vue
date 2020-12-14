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
                        快捷登录
                    </p>
                    <div class="login-form">
                        <div class="form-line">
                            <label>账号:</label>
                            <input v-model.trim="account" type="text" placeholder="请输入注册手机号" style="width: 260px">
                        </div>
                        <div class="form-line">
                            <label>验证码:</label>
                            <input v-model.trim="code" type="text" placeholder="请输入" style="width: 155px" maxlength="4" @keyup.enter="onKeyEnter">
                            <button style="width: 100px;margin-left: 2px" class="msg-btn" :class="'status' + codeBtnStatus" :loading="codeBtnStatus === 1"
                                    :disabled="codeBtnStatus !== 0"
                                    @click="getCode"
                            >
                                <span class="text">
                                    {{ codeBtnStatus === 0 ? '获取' : codeBtnStatus === 1 ? '获取中' : timesCount + 's' }}
                                </span>
                            </button>
                        </div>
                        <div class="form-line">
                            <label />
                            <button style="width: 260px;" type="danger" @click="login">
                                {{ loginBtnStatus === 0 ? '登录' : loginBtnStatus === 1 ? '登录成功' : '登录中' }}
                            </button>
                        </div>
                    </div>
                    <div>
                        <nuxt-link class="tips" to="/auth/register" style="margin-left: 80px">
                            没有账号？去注册
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <tk-footer />
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {isMobile} from '@common/src/utils/validate';
    import Cookie from 'js-cookie';
    import TkHeader from '@/components/common/TkHeader.vue';
    import TkFooter from '@/components/common/TkFooter.vue';
    import {postAsync} from '@/utils/request';

    @Component({
        components: {
            TkHeader,
            TkFooter
        }
    })
    export default class extends Vue {
        account = '';
        code = '';
        time = 10; // 倒计时
        codeBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中  2=请求成功，短信已发送
        loginBtnStatus = 0; // 0 1 2 // 0=初始状态 1=请求中 2=请求成功，登录结果已返回

        inTimeCount = false;
        timesCount = 0;
        timeHandle = -1;

        mounted() {
            const delkey = this.$route.query.delkey + '';
            // 强制退出
            if (delkey === '1' || delkey === '2') {
                Cookie.remove('token'); // 删除掉token
                this.$store.commit('user/exitLogin');
                // this.$route.query.delkey = '';
            }
        }

        beforeDestroyed() {
            if (this.timeHandle >= 0) {
                clearInterval(this.timeHandle);
            }
            this.timeHandle = 0;
        }

        async getCode() {
            if (!this.account) {
                this.$showToast('请输入手机号');
                return;
            }
            if (!isMobile(this.account)) {
                this.$showToast('手机号格式不正确');
                return;
            }
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

        async login() {
            if (!this.account) {
                this.$showToast('请输入手机号');
                return;
            }
            if (!isMobile(this.account)) {
                this.$showToast('手机号格式不正确');
                return;
            }
            if (!this.code) {
                this.$showToast('请输入验证码');
                return;
            }

            this.loginBtnStatus = 1;
            const [_, resp] = await postAsync('/user/userRegister', {
                mobileNum: this.account,
                verifyCode: this.code,
                type: 2 // 0=h5,1=app,2=pc
            });
            this.loginBtnStatus = 0;
            if (resp?.code === '000000') {
                this.$showToast('登录成功');
                this.account = '';
                this.code = '';
                // 保存下token和phone

                Cookie.set('token', resp.data, {
                    expires: 30,
                    path: '/'
                });
                await this.getPersonInfo();
            } else {
                this.$showToast(resp?.message || '登录失败');
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

        async onKeyEnter() {
           await this.login();
        }
    }
</script>

<style lang="scss" scoped>
    .main-self{
        min-height: $main-height;
        padding-top: 140px;
        /*margin-bottom: 20px;*/
    }
    .login-form{
        .form-line{
            margin: 15px 0;
        }
        .form-line > label{
            display: inline-block;
            width: 50px;
            font-size: 15px;
            line-height: 44px;
            text-align: right;
            margin-right: 10px;
            color: #333;
        }
        .form-line > input{
        }
        .form-line > button{
        }
    }
</style>
