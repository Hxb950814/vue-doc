<template>
    <div>
        <div class="page-cap-title">
            提现设置
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="one">
                        <el-switch
                            v-model="pageData.withdrawSwitch"
                            disabled
                            inactive-text="是否开启"
                        />
                        <p>
                            <span class="a">?</span>
                            <small>开启提现后，前端才能进行提现操作</small>
                        </p>
                    </div>
                    <div class="one one2">
                        提现规则
                        <b style="cursor: pointer;width: 60px" @click="goSetting">修改</b>
                        <p>
                            <span class="a">?</span>
                            注册规则修改：新注册用户按照新规则进行奖励，已注册用户按照老规则
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        提现规则
                    </div>
                    <div class="one one1">
                        <p>
                            单笔提现最低 <el-input v-model="pageData.amountMin" disabled style="width: 100px;margin-left: 20px" />
                        </p>
                        <p>
                            单笔提现最高 <el-input v-model="pageData.amountMax" disabled style="width: 100px;margin-left: 20px" />
                        </p>
                        <p>
                            单日提现次数 <el-input v-model="pageData.dailyLimit" disabled style="width: 100px;margin-left: 20px" />
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        温馨提示
                    </div>
                    <div class="one one1">
                        <el-input v-model="pageData.tip" type="textarea" rows="10" disabled style="width: 800px;margin-left: 20px" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
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

        goSetting() {
            this.$router.push({
                path: '/finance_manage/settings/withdraw/checkInfo'
            });
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
