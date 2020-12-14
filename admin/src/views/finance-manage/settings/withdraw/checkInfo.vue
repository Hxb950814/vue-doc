<template>
    <div>
        <div class="page-cap-title">
            修改提现设置
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="one">
                        <el-switch
                            v-model="pageData.withdrawSwitch"
                            inactive-text="是否开启"
                            @change="switchChange"
                        />
                        <p>
                            <span class="a">?</span>
                            <small>开启提现后，前端才能进行提现操作</small>
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        提现规则
                    </div>
                    <div class="one one1">
                        <p>
                            单笔提现最低 <el-input v-model="pageData.amountMin" style="width: 100px;margin-left: 20px" />
                        </p>
                        <p>
                            单笔提现最高 <el-input v-model="pageData.amountMax" style="width: 100px;margin-left: 20px" />
                        </p>
                        <p>
                            单日提现次数 <el-input v-model="pageData.dailyLimit" style="width: 100px;margin-left: 20px" />
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        温馨提示
                    </div>
                    <div class="one one1">
                        <el-input v-model="pageData.tip" type="textarea" rows="10" style="width: 800px;margin-left: 20px" />
                    </div>
                </div>
            </div>
        </div>
        <div class="form-submit-line" style="width: 600px">
            <el-button @click="clickCancel">
                关闭
            </el-button>
            <el-button type="primary" @click="clickSave">
                保存
            </el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {}
    })

    export default class extends Mixins(commonTable) {
        pageData:any = {
            amountMax: 0, // 单笔提现最高额度
            amountMin: 0, // 单笔提现最低额度
            dailyLimit: 0, // 单日提现次数
            tip: '',
            withdrawSetId: 0,
            withdrawSwitch: true // 是否开启注册奖励
        }

        mounted() {
            this.getWithdrawSet();
        }

        async getWithdrawSet() {
            // 取得详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/finance/getWithdrawSet', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                console.log(resp?.data);
                this.pageData = resp?.data || {};
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        clickSave() {
            this.doSave();
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                withdrawSwitch: this.pageData.withdrawSwitch,
                amountMax: this.pageData.amountMax,
                amountMin: this.pageData.amountMin,
                dailyLimit: this.pageData.dailyLimit,
                withdrawSetId: this.pageData.withdrawSetId,
                tip: this.pageData.tip

            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/finance/editWithdrawSet', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('设置成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '设置成功');
            }
        }

        clickCancel() {
            this.$router.back();
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-page-top{
        display: flex;
        width: 100%;
        margin: 10px 0;
        flex-direction: column;
        .group{
            display: flex;
            width: 100%;
            flex-direction: column;
            padding: 40px;
            background: #F2F2F6;
            margin-bottom: 20px;
            .title{
                display: flex;
                width: 100%;
                margin-bottom: 20px;
                margin-top: -20px;
                font-size: 18px;
                color:#333;
                font-weight: bold;
                margin-left: -20px;

            }
            .one{
                display: flex;
                width: 100%;
                align-items: center;
                p{

                    margin-left: 20px;
                    color: #666;
                    display: flex;
                    .a{
                        margin-right: 5px;
                        display: flex;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        font-size: 12px;
                        justify-content: center;
                        text-align: center;
                        align-items: center;
                        color: #fff;
                        background: #999;
                    }

                }
                &.one1{
                    flex-direction: column;
                    align-items: inherit;
                    p{
                        display: flex;
                        width: 100%;
                        margin-top: 10px;
                        align-items: center;
                    }
                }
                .b{
                    display: flex;
                    width: 120px;
                }
                b{
                    display: flex;
                    margin-left: 10px;
                    padding: 3px 15px;
                    color: #43B3FF;
                    border: 1px solid #43B3FF;
                    border-radius: 10px;
                    background: #fff;
                }
                &:nth-of-type(1){
                    margin-bottom: 20px;
                }
            }
        }
    }
</style>
