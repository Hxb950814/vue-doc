<template>
    <div>
        <div class="page-cap-title">
            注册奖励
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="one">
                        <el-switch
                            v-model="pageData.status"
                            inactive-text="是否开启"
                            @change="switchChange"
                        />
                        <p>
                            <span class="a">?</span>
                            启动注册奖励功能，请确认以完善规则
                        </p>
                    </div>
                    <div class="one">
                        注册规则
                        <b style="cursor: pointer" @click="goSetting">修改</b>
                        <p>
                            <span class="a">?</span>
                            注册规则修改：新注册用户按照新规则进行奖励，已注册用户按照老规则
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        注册奖励
                    </div>
                    <div class="one one1">
                        <span class="b">积分</span>
                        <p>
                            最小积分：{{ pageData && pageData.minScore }}<span style="margin-left:40px" />最大积分：{{ pageData && pageData.maxScore }}
                        </p>
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
            minScore: 0, // 最小积分
            maxScore: 0, // 最大积分
            registerSettingId: 0, // 注册设置id
            status: false // 是否开启注册奖励
        }

        mounted() {
            this.getRegisterSetting();
        }

        async getRegisterSetting() {
            // 取得详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/registerSetting/getRegisterSetting', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                console.log(resp?.data);
                this.pageData = resp?.data || {};
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        async switchChange() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/registerSetting/onOffRegisterSetting', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                if (resp?.data.status) {
                    this.$message({
                        type: 'success',
                        message: '已开启'
                    });
                } else {
                    this.$message({
                        type: 'info',
                        message: '已关闭'
                    });
                }
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        goSetting() {
            this.$router.push({
                path: '/marketing_manage/promote-manage/registered/setting'
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
                &.one1{
                    background: #fff;
                    padding: 30px;
                }
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
