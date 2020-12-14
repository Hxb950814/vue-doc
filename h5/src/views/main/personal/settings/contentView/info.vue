<template>
    <div class="pageBox">
        <div class="hbb-setting-top hbb-van-input-right">
            <div>
                <span>姓名</span>
                <van-field style="width: 70%" v-model="realityName" placeholder="请输入姓名" />
            </div>
            <div>
                <span>身份证号</span>
                <van-field style="width: 70%" v-model="idNumber" placeholder="请输入身份证号" />
            </div>
            <div>
                <span>银行卡号</span>
                <van-field style="width: 70%" v-model="bankNo" placeholder="请输入银行卡号" />
            </div>
            <div>
                <span>开户银行</span>
                <van-field style="width: 70%" v-model="bankName" placeholder="请输入开户行" />
            </div>
        </div>
        <p class="hbb-tip">请确保您的身份信息及银行卡信息正确</p>
        <div class="hbb-vanbutton" @click="sureClick">
            确定
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal";

    @Component({})
    export default class extends Vue {
        bankName = '';
        bankNo = '';
        idNumber = '';
        realityName = '';

        mounted() {
            this.mySetInfo();
        }

        mySetInfo() {
            PersonalModule.mySetInfo().then((res:any) => {
                this.bankName = res?.data.bankName;
                this.bankNo = res?.data.bankNo;
                this.idNumber = res?.data.idNumber;
                this.realityName = res?.data.realityName;
            })
        }

        sureClick() {
            this.$toast({
                forbidClick: true,
                message: '提交中...'
            })
            let requestObj = {
                bankName: this.bankName,
                bankNo: this.bankNo,
                idNumber: this.idNumber,
                realityName: this.realityName
            }
            PersonalModule.addOrUpdateUserDetailInfo(requestObj).then((res:any) => {
                this.$toast({
                    type: 'success',
                    message: '保存成功'
                });
                this.$router.back();
            }).catch((err:any) => {
                this.$toast('保存失败');
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background-color: #f6f6f6;
    }
    .hbb-setting-top{
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        div {
            display: flex;
            width: 100%;
            height: 100px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-bottom: 2px solid #eee;

            span {
                font-size: 30px;
                color: #333;
                display: flex;
                align-items: center;
            }
        }
    }
    .hbb-tip{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        color: $color-ff9600;
        margin-top: 40px;
        font-weight: bold;
    }
    .hbb-vanbutton{
        display: flex;
        width: 80% !important;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #fff;
        margin: 40px auto;
    }
</style>
