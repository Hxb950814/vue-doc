<template>
    <div class="hbb-noB">
        <div class="page-cap-title">
            会员详情
        </div>

        <div class="form-input-area">
            <div class="hbb-group-title">
                注册信息
                <table>
                    <tr>
                        <td class="l">
                            联系方式：
                        </td>
                        <td>
                            <span>{{ editData.mobile }}</span>
                        </td>
                        <td class="l">
                            微信状态：
                        </td>
                        <td>
                            <span>{{ editData.wechatBind === 1 ? '已绑定': '未绑定' }}({{ editData.openId }})</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            会员学号：
                        </td>
                        <td>
                            <span>{{ editData.studentNo }}</span>
                        </td>
                        <td class="l">
                            注册时间：
                        </td>
                        <td>
                            <span>{{ editData.createTime }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            账号状态：
                        </td>
                        <td>
                            <span v-if="editData.status !== 0">{{ ['正常', '锁定', '注销'][editData.status] }}</span>
                            <span v-else>{{ ['未学习', '学习中'][editData.learnState] }}</span>
                        </td>
                        <td class="l">
                            推荐来源：
                        </td>
                        <td>
                            <span>{{ editData.recommendStudentNo }}</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hbb-group-title">
                会员信息
                <table>
                    <tr>
                        <td class="l">
                            会员姓名：
                        </td>
                        <td>
                            <span>{{ editData.realityName }}</span>
                        </td>
                        <td class="l">
                            证件号码：
                        </td>
                        <td>
                            <span>{{ editData.idNumber }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            会员性别：
                        </td>
                        <td>
                            <span>{{ editData.sex === 1 ? '男': '女' }}</span>
                        </td>
                        <td class="l">
                            会员年龄：
                        </td>
                        <td>
                            <span>{{ editData.age }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            银行名称：
                        </td>
                        <td>
                            <span>{{ editData.bankName }}</span>
                        </td>
                        <td class="l">
                            银行卡号：
                        </td>
                        <td>
                            <span>{{ editData.bankNo }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            职业类型：
                        </td>
                        <td>
                            <span>{{ ['无', '班主任', '律师'][editData.workType] }}</span>
                        </td>
                        <td class="l">
                            微信账号：
                        </td>
                        <td>
                            <span>{{ editData.wechatNo }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            微信二维码：
                        </td>
                        <td>
                            <span v-if="editData.wechatCode" :style="{height: editData.wechatCode ? '60px': '36px'}">
                                <el-image
                                    style="width: 60px; height: 60px"
                                    :src="editData.wechatCode"
                                    :preview-src-list="srcList"
                                />
                            </span>
                            <span v-else>
                                -
                            </span>
                        </td>
                        <td class="l">
                            工作单位：
                        </td>
                        <td>
                            <span :style="{height: editData.wechatCode ? '60px': '36px', lineHeight: editData.wechatCode ? '60px': '36px'}">{{ editData.work }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            简单介绍：
                        </td>
                        <td class="b">
                            <span style="float: left;width: 100%;padding: 5px 10px">{{ editData.simplyIntroduce }}</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hbb-group-title">
                推荐信息
                <table>
                    <tr>
                        <td class="l">
                            推荐人数：
                        </td>
                        <td>
                            <span>{{ editData.recommend }}</span>
                            <span class="b" @click="lookNum(1, 1)">查看</span>
                        </td>
                        <td class="l">
                            转化人数：
                        </td>
                        <td>
                            <span>{{ editData.recommendLearned }}</span>
                            <span class="b" @click="lookNum(1, 2)">查看</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hbb-group-title">
                资产信息信息
                <table>
                    <tr>
                        <td class="l">
                            钱包余额：
                        </td>
                        <td>
                            <span><b style="color:#F95A5A;font-weight: normal">{{ editData.balance | money }}</b> / <b style=";font-weight: normal;color:#55B755">{{ editData.freeze | money }}</b></span>
                            <span class="b" @click="lookNum(2, 1)">记录</span>
                        </td>
                        <td class="l">
                            积分余额：
                        </td>
                        <td>
                            <span>{{ editData.pointBalance }}</span>
                            <span class="b" @click="lookNum(2, 2)">记录</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            消费金额：
                        </td>
                        <td>
                            <span>{{ editData.amount | money }}</span>
                        </td>
                        <td class="l">
                            消费积分：
                        </td>
                        <td>
                            <span>{{ editData.pointAmount }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            提现金额：
                        </td>
                        <td>
                            <span>{{ editData.withdrawAmount | money }}</span>
                        </td>
                        <td class="l">
                            奖励余额：
                        </td>
                        <td>
                            <span>{{ editData.awardAmount | money }}</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="hbb-group-title">
                课程信息
                <table>
                    <tr>
                        <td class="l">
                            课程名称：
                        </td>
                        <td class="b">
                            <el-input
                                v-model.trim="editData.courseName"
                                type="text"
                                autocomplete="off"
                                readonly
                                placeholder="-"
                                style="width:100%"
                            />
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!-- 会员推荐人信息 -->
        <recommendationModal ref="recommendationView" />
        <!-- 会员资金记录 -->
        <fundingRecordsModal ref="fundingRecordsView" />
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import dayjs from 'dayjs';
    import recommendationModal from './recommendationModal.vue';
    import fundingRecordsModal from './fundingRecordsModal.vue';
    @Component({
        components: {
            recommendationModal,
            fundingRecordsModal
        }
    })
    export default class extends Vue {
        @Prop({type: String, default: '', required: false})
        title!:string;

        id = ''; // id
        userId = 0;
        srcList:any[] = []
        editData: any = {
            openId: '', // 联系方式
            mobile: '', // 联系方式
            balance: '', // 余额
            learnState: '', // 学习状态
            pointBalance: '', // 积分余额
            wechatBind: '', // 微信状态
            studentNo: '', // 学号
            createTime: '', // 注册时间
            status: '', // 账号状态 0=正常，1=锁定，2=注销
            realityName: '', // 真实姓名
            idNumber: '', // 身份证号
            bankName: '', // 银行
            bankNo: '', // 银行卡号
            wechatNo: '', // 微信账号
            work: '', // 工作单位
            workType: '', // workType职业类型:0=无；1=班主任；2=律师
            simplyIntroduce: '', // 简单介绍
            age: '', // 年龄
            sex: '', // 性别
            recommendStudentNo: '', // 推荐来源
            recommend: '', // 推荐人数
            recommendLearned: '', // 转化人数
            recommendUserId: '', // 转化人数
            amount: '', // 总金额
            awardAmount: '', // 消费金额
            pointAmount: '', // 消费积分
            wechatCode: '',
            withdrawAmount: '' // 消费积分
        };

        lookNum(t:number, mode: number) {
            if (t === 1) {
                (this.$refs.recommendationView as any).active(mode);
            } else {
                (this.$refs.fundingRecordsView as any).active(mode);
            }
        }

        mounted() {
            this.id = String(this.$route.query.id);
            this.getDetail();
        }

        async getDetail() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/getUserDetail', {userId: this.id});
            if (resp?.code === '000000') {
                const data = resp?.data;
                this.editData.mobile = data.user.mobile;
                this.editData.balance = data.user.balance;

                this.editData.pointBalance = data.user.pointBalance;
                this.editData.wechatBind = data.user.wechatBind;
                this.editData.createTime = dayjs(data.user.createTime).format('YYYY-MM-DD');
                this.editData.status = data.user.status;
                this.editData.learnState = data.user.learnState;
                this.editData.realityName = data.user.realityName;
                this.editData.recommendUserId = data.user.recommendUserId;
                this.editData.auth = data.user.auth;
                this.editData.idNumber = data.user.idNumber;
                this.editData.bankName = data.userDetail?.bankName;
                this.editData.bankNo = data.userDetail?.bankNo;

                this.editData.wechatNo = data.userDetail?.wechatNo;
                this.editData.work = data.userDetail?.work;
                this.editData.workType = data.userDetail?.workType;
                this.editData.simplyIntroduce = data.userDetail?.simplyIntroduce;

                this.editData.recommend = data.recommend;
                this.editData.amount = data.recommend;
                this.editData.awardAmount = data.awardAmount;
                this.editData.courseName = data.courseName;
                this.editData.pointAmount = data.pointAmount;
                this.editData.recommendLearned = data.recommendLearned;
                this.editData.withdrawAmount = data.withdrawAmount;
                this.editData.age = data.age;
                this.editData.sex = data.sex;
                this.editData.recommendStudentNo = data.recommendStudentNo;
                this.editData.studentNo = data.user.studentNo;

                this.userId = data.user.userId;
                this.editData.wechatCode = data.userDetail ? data.userDetail.wechatCode : '';
                if (this.editData.wechatCode) {
                    this.srcList.push(data.userDetail.wechatCode);
                }

                this.editData.openId = data.user.openId;
            }
            this.$closeLoading();
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-noB{

        .hbb-group-title{
            display: flex;
            width: 100%;
            padding: 10px 0;
            font-size: 18px;
            margin-top: 20px;
            flex-direction: column;
            border-bottom: 1px solid #ddd;
        }
        table{
            display: table-cell;
            width: 1000px;
            border: 1px solid #ddd;
            margin-top: 10px;
            tr{
                display: flex;
                align-items: center;
                width: 100%;
                background: #cccccc;
                border-bottom: 1px solid #ddd;
                td{
                    display: flex;
                    background: #fff;
                    width: calc(50% - 130px) !important;
                    align-items: center;
                    position: relative;
                    span{
                        width: 400px;
                        height: 36px;
                        background: #fff;
                        line-height: 36px;
                        float: left;
                        padding-left: 10px;
                    }
                    span.b{
                        position: absolute;
                        display: block;
                        right: 10px;
                        color: #5195FB;
                        font-weight: bold;
                        width: 60px !important;
                        cursor: pointer;
                    }
                    .el-input{
                        width: 100% !important;

                        input, textarea{
                            border-radius: 0 !important;
                            border: none !important;
                        }
                        .el-input__inner{
                            background: red;
                            border: none !important;
                        }

                    }

                    &.l {

                        width: 130px !important;
                        background: none;
                        padding-left: 10px;
                    }
                    &.b{
                        width: calc(100% - 130px) !important;
                    }

                }
            }
        }

    }
</style>
