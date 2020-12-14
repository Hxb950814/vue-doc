<template>
    <div>
        <div class="page-cap-title">
            打卡设置
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="one" style="margin-bottom: 20px">
                        <el-switch
                            v-model="pageData.status"
                            inactive-text="打卡是否开启"
                            @change="switchChange"
                        />
                        <p style="padding-left: 20px">
                            <span class="a">?</span>
                            {{ pageData.status ? '停用打卡，用户连续天数清零；重新启用打卡，重新计算用户连续天数和匹配奖励' : '开启打卡功能前，请完善打卡规则' }}
                        </p>
                    </div>
                    <div class="one" style="margin-bottom: 20px">
                        打卡规则
                        <b style="cursor: pointer" @click="goSetting">修改</b>
                        <p>
                            <span class="a">?</span>
                            不关闭打卡修改：用户连续天数保留，重新匹配新规则
                        </p>
                    </div>
                    <div class="one">
                        打卡启用时间
                        <b class="time">{{ pageData.createTime }}</b>
                        <p>
                            <span class="a">?</span>
                            以启用时间计算用户连续打卡天数
                        </p>
                    </div>
                    <div class="one" style="margin-top:20px">
                        规则更新时间
                        <b class="time">{{ pageData.updateTime }}</b>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        打卡随机奖励
                    </div>
                    <div class="one one1">
                        <span class="b">积分</span>
                        <p>
                            {{ pageData.minScore }} - {{ pageData.maxScore }}
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        连续打卡额外奖励
                        <el-switch
                            disabled
                        v-model="isExtraState"
                        inactive-text="       "
                    />
                    </div>
                    <div v-for="(item,index) in pageData.list" :key="index" style="display: flex;flex-direction: column">
                        <div class="one one1  one2">
                            <h2> 连续打卡{{item.continuityDay}}天，额外赠送</h2>
                        </div>
                        <div class="one one1  one2">
                            <span class="b">积分</span>
                            <p>
                                {{ item.minScore }} - {{item.maxScore}}
                            </p>
                        </div>
<!--                        <div class="one one1  one2">-->
<!--                            <span class="b">优惠券</span>-->
<!--                            <p>-->
<!--                                100元优惠券，面值100元，仅限基金课程，有效期30天-->
<!--                            </p>-->
<!--                        </div>-->
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        连续打卡周期天数
                    </div>
                    <div class="one one1">
                        <p>
                            连续打卡周期 {{ pageData.clockInPeriod}}
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        活动规则
                    </div>

                    <div v-if="pageData.description" class="one one1">
                        {{ pageData.description }}
                    </div>
                    <div v-else class="one one2">
                        输入活动规则，限制300字内
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    import MyImageUpload from '@/components/MyImageUpload.vue';

    @Component({
        components: {MyImageUpload}
    })

    export default class extends Mixins(commonTable) {
        pageData:any = {
            list: [], // 连续打卡奖励
            maxScore: 0, // 最大积分
            minScore: 0, // 最小积分
            createTime: '', // 打卡启用时间
            updateTime: '', // 打卡启用时间
            isExtra: 0, // 是否开启额外奖励
            description: '', // 活动规则
            clockInPeriod: 0, // 连续打卡周期
            status: true // 是否开启邀请奖励
        }
        isExtraState = true;

        mounted() {
            this.getClockInInfo();
        }

        async getClockInInfo() {
            // 取得详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/clockIn/getClockInInfo', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.pageData.list = resp?.data.list || [];
                this.pageData.status = resp?.data.status;
                this.pageData.maxScore = resp?.data.maxScore;
                this.pageData.minScore = resp?.data.minScore;
                this.pageData.createTime = resp?.data.createTime;
                this.pageData.updateTime = resp?.data.updateTime;
                this.pageData.isExtra = resp?.data.isExtra;
                this.isExtraState = resp?.data.isExtra === 1 ? true : false;
                this.pageData.description = resp?.data.description;
                this.pageData.clockInPeriod = resp?.data.clockInPeriod;
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        async switchChange() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/clockIn/onOffClockInSetting', {});
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
                path: '/marketing_manage/clockIn-manage/setting/setting'
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
            .demo-input-suffix{
                display: flex;
                width: 100%;
                align-items: center;
                margin-bottom: 20px;
            }
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
                &.one3{
                    background: #fff;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    justify-content: flex-start !important;
                    align-items: normal;
                    h3{
                        margin-top: 20px;
                    }
                    .l{
                        padding-left: 20px;
                        margin-top: 20px;
                    }
                }
                &.one2{
                    background: #fff;
                    padding: 15px 30px;

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
                .time{
                    border: none;
                    background: none;
                    color: #bbb;
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
            }
        }
    }
</style>
