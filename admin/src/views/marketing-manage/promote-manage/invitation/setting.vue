<template>
    <div>
        <div class="page-cap-title">
            邀请设置
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <div class="group">
                    <div class="title">
                        积分奖励
                    </div>
                    <div class="one" style="margin-bottom: 20px">
                        <h2>每邀请一位用户完成注册</h2>
                        <p>
                            <span class="a">?</span>
                            以生成用户学号为准
                        </p>
                    </div>
                    <div class="one one1">
                        <span class="b">积分</span>
                        <p>
                            <el-input v-model="pageData.score" style="width:250px;height: 30px" placeholder="请输入内容" />
                        </p>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        现金奖励
                    </div>
                    <div class="one one3">
                        <h3>指定课程</h3>
                        <div class="l">
                            <el-checkbox-group v-model="checkList" @change="checkClick">
                                <el-checkbox v-for="(item,index) in pageData.list" :key="index" :label="item.courseTypeId + ''">
                                    {{ item.courseName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <h3>奖励规则</h3>
                        <div class="l">
                            1.被邀请会员成功注册 <el-input v-model="pageData.validDay" style="width: 50px;height: 30px" placeholder="请输入内容" />天内产生的购买行为有效.
                        </div>
                        <div class="l">
                            2.现金奖励为被邀请会员购买指定课程实付金额的
                            <el-input v-model="pageData.inviteScale" style="width: 50px;height: 30px" placeholder="请输入内容" />
                            %，最高可得<el-input v-model="pageData.inviteMax" style="width: 70px;height: 30px" placeholder="请输入内容" />元.
                        </div>
                        <div class="l">
                            3.单个被邀请会员的现金奖励次数 <el-input v-model="pageData.validCount" style="width: 50px;height: 30px" placeholder="请输入内容" />次.
                        </div>
                        <div class="l">
                            4.现金奖励将于被邀请人购买课程 <el-input v-model="pageData.validDay" style="width: 50px;height: 30px" placeholder="请输入内容" />天内发放.
                        </div>
                    </div>
                </div>
                <div class="group">
                    <div class="title">
                        邀请规则
                    </div>
                    <el-input
                        v-model="pageData.description"
                        type="textarea"
                        placeholder="请输入内容"
                        maxlength="300"
                        rows="7"
                        show-word-limit
                    />
                </div>
                <div class="group">
                    <div class="title">
                        分享设置
                    </div>
                    <div class="demo-input-suffix">
                        分享标题：
                        <el-input
                            v-model="pageData.shareTitle"
                            style="width: 450px;"
                            placeholder="请输入分享标题"
                        />
                    </div>
                    <div class="demo-input-suffix">
                        分享描述：
                        <el-input
                            v-model="pageData.shareDesc"
                            style="width: 450px;"
                            placeholder="请输入分享描述"
                        />
                    </div>
                    <div class="demo-input-suffix">
                        分享图片：
                        <my-image-upload :url.sync="pageData.shareImg" class="small" />
                        <div style="padding: 80px 0 0 10px;">
                            (100*100px)
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-submit-line">
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
    import commonTable from '@/mixins/commonTable';

    import MyImageUpload from '@/components/MyImageUpload.vue';

    @Component({
        components: {MyImageUpload}
    })

    export default class extends Mixins(commonTable) {
        checkList:any[] = []; // 指定课程的选择列表
        pageData:any = {
            list: [], // 指定课程
            score: 0, // 最小积分
            inviteSettingId: 0, // 注册设置id
            inviteScale: 0, // 可支付实付金额
            inviteMax: 0, // 最高可获得
            shareDesc: '测试一下', // 分享描述
            shareImg: '', // 分享图片
            shareTitle: '测试一下', // 分享标题
            validDay: 0, // 几天内注册
            validCount: 0, // 奖励次数
            description: '', // 描述
            sendDay: 0 // 几天内发放
        }

        mounted() {
            this.getInviteSetting();
        }

        async getInviteSetting() {
            // 取得详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/inviteSetting/getInviteSetting', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.pageData.list = resp?.data.list || [];
                this.pageData.score = resp?.data.oldInviteset.score;
                this.pageData.startTime = resp?.data.oldInviteset.startTime;
                this.pageData.inviteSettingId = resp?.data.oldInviteset.inviteSettingId;
                this.pageData.inviteScale = resp?.data.oldInviteset.inviteScale;
                this.pageData.inviteMax = resp?.data.oldInviteset.inviteMax;
                this.pageData.shareDesc = resp?.data.oldInviteset.shareDesc;
                this.pageData.shareImg = resp?.data.oldInviteset.shareImg;
                this.pageData.shareTitle = resp?.data.oldInviteset.shareTitle;
                this.pageData.validDay = resp?.data.oldInviteset.validDay;
                this.pageData.validCount = resp?.data.oldInviteset.validCount;
                this.pageData.description = resp?.data.oldInviteset.description;
                this.pageData.sendDay = resp?.data.oldInviteset.sendDay;
                this.pageData.status = resp?.data.oldInviteset.status;
                this.pageData.list.forEach((x:any) => {
                    if (x.isCheck === '1') {
                        this.checkList.push(String(x.courseTypeId));
                    }
                });
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        checkClick(v:any) {
            this.checkList = v;
        }

        async clickSave() {
            // 取得详情
            this.$showLoading();
            const requestData = {
                score: this.pageData.score, // 最小积分
                inviteSettingId: this.pageData.inviteSettingId, // 注册设置id
                inviteScale: this.pageData.inviteScale, // 可支付实付金额
                inviteMax: this.pageData.inviteMax, // 最高可获得
                shareDesc: this.pageData.shareDesc, // 分享描述
                shareImg: this.pageData.shareImg, // 分享图片
                shareTitle: this.pageData.shareTitle, // 分享标题
                validDay: this.pageData.validDay, // 几天内注册
                validCount: this.pageData.validCount, // 奖励次数
                description: this.pageData.description, // 描述
                sendDay: this.pageData.sendDay, // 几天内发放
                course: this.checkList.join(',')
            };
            const [err, resp] = await this.$postAsync('/inviteSetting/updateInviteSetting', requestData);
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '设置成功'
                });
                setTimeout(() => {
                    this.$router.back();
                }, 1000);
            } else {
                this.$showToast(resp?.message || '请求异常');
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
                    padding: 60px 30px;
                    justify-content: center;
                    align-items: center;
                    color: #bbb;
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
                &:nth-of-type(1){
                    margin-bottom: 20px;
                }
            }
        }
    }
</style>
