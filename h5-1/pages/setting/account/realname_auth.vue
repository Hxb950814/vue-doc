<template>
    <div>
        <tk-nav-bar>实名认证</tk-nav-bar>

        <div class="container">
            <div class="normal-input-filed">
                <van-field v-model="name" label="姓名" placeholder="请输入" maxlength="6" type="text" />
                <van-field v-model="idCard" label="身份证号" placeholder="请确认" maxlength="18" type="text" />
            </div>
            <div class="theme-button-wrap">
                <div class="theme-button" :class="{disabled: btnDisabled}" @click="clickSure">
                    确定
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import { isIdNumber } from '@common/src/utils/validate';
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
        mode='set'; // set 和 modify
        name = '';
        idCard = ''; // 密码
        btnDisabled = false;

        mounted() {
            if (this.mode === 'modify') {
                this.getInfo();
            }
        }

        async getInfo() {
            const [_, resp] = await postAsync('/systemInstall/queryRealNameInfo');
            if (resp?.code === '000000') {
                this.name = resp.data.realName;
                this.idCard = resp.data.idNumber;
            }
        }

        async clickSure() {
            if (this.name === '') {
               this.$showToast('请输入姓名');
               return;
            }

            if (this.idCard === '') {
                this.$showToast('请输入身份证号');
                return;
            }

            if (!isIdNumber(this.idCard)) {
                this.$showToast('请输入正确的身份证号');
            }
            this.btnDisabled = true;
            this.$showLoading('请求中...');
            const [_, resp] = await postAsync('/systemInstall/addOrUpdateRealNameInfo', {
                realName: this.name,
                idNumber: this.idCard
            });
            if (resp?.code === '000000') {
                this.$closeLoading();
                this.$showToast(this.mode === 'set' ? '实名认证设置成功' : '实名认证修改成功');
                setTimeout(() => {
                    this.$router.push('/my');
                    // this.btnDisabled = false;
                }, 200);
            } else {
                this.btnDisabled = false;
                this.$closeLoading();
                this.$showToast(resp?.message || '请求错误');
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
