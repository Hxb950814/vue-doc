<template>
    <div>
        <tk-nav-bar>交易密码{{ mode === 'set' ? '设置' : '修改' }}</tk-nav-bar>

        <div class="container">
            <div class="normal-input-filed">
                <van-field v-model="password1" label="交易密码" placeholder="请输入密码" maxlength="6" type="digit" />
                <van-field v-model="password2" label="确认密码" placeholder="请再次输入密码" maxlength="6" type="digit" />
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
            // todo
            const [_, resp] = await postAsync('/systemInstall/addOrUpdatePassword', {
                confirmPassword: this.password1,
                newPassword: this.password2,
                type: 2
            });
            if (resp?.code === '000000') {
                this.$showToast(this.mode === 'set' ? '交易密码设置成功' : '交易密码修改成功');
                setTimeout(() => {
                    this.$router.push('/my');
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
