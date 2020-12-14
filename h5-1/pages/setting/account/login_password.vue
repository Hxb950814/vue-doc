<template>
    <div>
        <tk-nav-bar>登录密码{{ mode === 'set' ? '设置' : '修改' }}</tk-nav-bar>
        <div class="container">
            <div class="normal-input-filed">
                <van-field v-model="password1" label="登录密码" placeholder="请输入6-12位密码(数字或字母组合)" maxlength="12" type="password" />
                <van-field v-model="password2" label="确认密码" placeholder="请再次输入密码" maxlength="12" type="password" />
            </div>
            <div class="theme-button-wrap">
                <div class="theme-button" @click="clickSure">
                    确定
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: {},
        asyncData(context) {
            // console.log(context.route.query.mode);
            return {
                mode: context?.route?.query?.mode || ''
            };
        }
    })
    export default class extends Vue {
        mode='set';
        password1 = '';
        password2 = ''; // 密码

        mounted() {
            console.log(this.mode);
        }

        async clickSure() {
            if (this.password1 === '') {
                this.$showToast('请输入密码');
                return;
            }
            if (this.password2 === '') {
                this.$showToast('请输入确认密码');
                return;
            }
            if (this.password1 !== this.password2) {
                this.$showToast('两次密码输入不一致');
                return;
            }
            this.$showLoading();
            const [_, resp] = await postAsync('/systemInstall/addOrUpdatePassword', {
                confirmPassword: this.password1,
                newPassword: this.password2,
                type: 1
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast(this.mode === 'set' ? '登录密码设置成功' : '登录密码修改成功');
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 200);
            } else {
                this.$showToast(resp?.message || '失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .theme-button-wrap{
        padding-top: 30px;
        .theme-button{
            margin-top: 10px;
        }
    }
</style>
