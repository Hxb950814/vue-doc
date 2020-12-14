<!-- 添加公告 -->
<template>
    <div>
        <div class="page-cap-title">
            查看新债
        </div>

        <div class="form-input-area hbb-form">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <table>
                    <tr>
                        <td class="l">
                            新债名称：
                        </td>
                        <td>
                            <el-form-item prop="newDebtName">
                                <el-input
                                    v-model.trim="editData.newDebtName"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入新债名称"
                                    maxlength="6"
                                    style="width:400px"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            申购代码：
                        </td>
                        <td>
                            <el-form-item prop="applyCode">
                                <el-input
                                    v-model.trim="editData.applyCode"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入申购代码"
                                    maxlength="50"
                                    style="width:400px"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            新债类型：
                        </td>
                        <td>
                            <el-form-item prop="stockType">
                                <el-select v-model="editData.stockType" style="width: 100%" placeholder="请选择股票类型">
                                    <el-option
                                        v-for="item in dictionaryList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </td>
                        <td class="l">
                            一签缴款：
                        </td>
                        <td>
                            <el-form-item>
                                <el-input
                                    v-model.trim="editData.paymentBySign"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入缴款"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            发行价格：
                        </td>
                        <td>
                            <el-form-item prop="issuePrice">
                                <el-input
                                    v-model.trim="editData.issuePrice"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入发行价格"
                                    maxlength="50"
                                    style="width:400px"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            申购上限：
                        </td>
                        <td>
                            <el-form-item prop="applyLimit">
                                <el-input
                                    v-model.trim="editData.applyLimit"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入申购上限"
                                    maxlength="50"
                                    style="width:400px"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            申购日期：
                        </td>
                        <td>
                            <el-form-item prop="applyDate">
                                <el-date-picker
                                    v-model.trim="editData.applyDate"
                                    type="date"
                                    placeholder="申购日期"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            配号日期：
                        </td>
                        <td>
                            <el-form-item prop="allotmentNumberDate">
                                <el-date-picker
                                    v-model.trim="editData.allotmentNumberDate"
                                    type="date"
                                    placeholder="配号日期"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            中签结果日期：
                        </td>
                        <td>
                            <el-form-item prop="winResultDate">
                                <el-date-picker
                                    v-model.trim="editData.winResultDate"
                                    type="date"
                                    placeholder="中期结果日期"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            上市日期：
                        </td>
                        <td>
                            <el-form-item prop="listDate">
                                <el-date-picker
                                    v-model.trim="editData.listDate"
                                    type="date"
                                    placeholder="上市日期"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            正股名称：
                        </td>
                        <td>
                            <el-form-item prop="regularStockName">
                                <el-input
                                    v-model.trim="editData.regularStockName"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入正股名称"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            正股代码：
                        </td>
                        <td>
                            <el-form-item prop="regularStockCode">
                                <el-input
                                    v-model.trim="editData.regularStockCode"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入正股代码"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            正股价格：
                        </td>
                        <td>
                            <el-form-item prop="regularStockPrice">
                                <el-input
                                    v-model.trim="editData.regularStockPrice"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入正股价格"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            转股价格：
                        </td>
                        <td>
                            <el-form-item prop="turnStockPrice">
                                <el-input
                                    v-model.trim="editData.turnStockPrice"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入转股价格"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            转股价值：
                        </td>
                        <td>
                            <el-form-item prop="turnStockValue">
                                <el-input
                                    v-model.trim="editData.turnStockValue"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入转股价值"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            溢价率/%：
                        </td>
                        <td>
                            <el-form-item prop="premiumRate">
                                <el-input
                                    v-model.trim="editData.premiumRate"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入溢价率"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            开始转股：
                        </td>
                        <td>
                            <el-form-item prop="startTurnStockDate">
                                <el-date-picker
                                    v-model.trim="editData.startTurnStockDate"
                                    type="date"
                                    placeholder="开始转股日期"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            股权登记日：
                        </td>
                        <td>
                            <el-form-item prop="stockRegisterDate">
                                <el-date-picker
                                    v-model.trim="editData.stockRegisterDate"
                                    type="date"
                                    placeholder="股权登记日"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            公司介绍：
                        </td>
                        <td class="b">
                            <el-form-item prop="companyIntroduce">
                                <el-input
                                    v-model.trim="editData.companyIntroduce"
                                    type="textarea"
                                    autocomplete="off"
                                    placeholder="请输入公司介绍"
                                    maxlength="200"
                                    style="width:100%"
                                    rows="4"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </el-form>
            <div style="width: 100%;text-align: center;margin-top: 20px">
                <el-button @click="clickCancel">
                    关闭
                </el-button>
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import dayjs from 'dayjs';
    import commonTable from '@/mixins/commonTable';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    let editDataSnapshot = '';
    @Component({
        components: {MyCustomEditor},
        mixins: [commonTable]
    })
    export default class extends Vue {
        id = ''; // id
        editData: any = {
            newDebtName: '', // 新债名称
            applyCode: '', // 申购代码
            stockType: '', // 股票类型
            paymentBySign: '', // 一签缴款
            issuePrice: '', // 发行价格
            applyLimit: '', // 申购上限
            applyDate: '', // 申购日期
            allotmentNumberDate: '', // 配号日期
            winResultDate: '', // 中签结果日期
            listDate: '', // 上市日期
            regularStockName: '', // 正股名称
            regularStockCode: '', // 正股代码
            regularStockPrice: '', // 正股价格
            turnStockValue: '', // 转股价值
            turnStockPrice: '', // 转股价格
            premiumRate: '', // 溢价率
            startTurnStockDate: '', // 开始转股日期
            stockRegisterDate: '', // 股权登记日期
            companyIntroduce: '' // 公司介绍
        };

        dataRule: any = {
            newDebtName: [{required: true, message: '请输入新债名称', trigger: 'blur'}],
            applyCode: [{required: true, message: '请输入申购代码', trigger: 'blur'}],
            stockType: [{required: true, message: '请选择新债类型', trigger: 'change'}],
            issuePrice: [{required: true, message: '请输入发行价格', trigger: 'blur'}],
            applyLimit: [{required: true, message: '请输入申购上限', trigger: 'blur'}],
            premiumRate: [{required: true, message: '请输入溢价率', trigger: 'blur'}],
            netIssueNum: [{required: true, message: '请输入网上发行总量', trigger: 'blur'}],
            netApplyLimit: [{required: true, message: '请输入网上申购上限', trigger: 'blur'}],
            applyDate: [{required: true, message: '请选择日期', trigger: 'change'}],
            allotmentNumberDate: [{required: true, message: '请选择日期', trigger: 'change'}],
            winResultDate: [{required: true, message: '请选择日期', trigger: 'change'}],
            regularStockName: [{required: true, message: '请输入正股名称', trigger: 'blur'}],
            regularStockCode: [{required: true, message: '请输入正股代码', trigger: 'blur'}],
            regularStockPrice: [{required: true, message: '请输入正股价格', trigger: 'blur'}],
            turnStockValue: [{required: true, message: '请输入转股价值', trigger: 'blur'}],
            turnStockPrice: [{required: true, message: '请输入转股价格', trigger: 'blur'}]
        };

        publishTimeOpt1: any = {};
        publishTimeOpt2: any = {};
        dictionaryList: any[] = [];

        mounted() {
            this.queryDictionaryList();
            this.id = String(this.$route.query.id);
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
            this.getDetail();
        }

        async queryDictionaryList() {
            // 根据code查询字典表
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/newStock/queryDictionaryList', {
                code: 'stock_type'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.dictionaryList = resp?.data || [];
            } else {
                this.$showToast(resp?.message || '网络异常');
            }
        }

        async getDetail() {
            // 取得新股详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/newDebt/queryNewDebtInfoById', {
                newDebtId: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.newDebtName = resp?.data?.newDebtName;
                this.editData.applyCode = resp?.data?.applyCode;
                this.editData.stockType = resp?.data?.stockType;
                this.editData.issuePrice = resp?.data?.issuePrice;
                this.editData.premiumRate = resp?.data?.premiumRate;
                this.editData.regularStockName = resp?.data?.regularStockName;
                this.editData.regularStockCode = resp?.data?.regularStockCode;
                this.editData.regularStockPrice = resp?.data?.regularStockPrice;
                this.editData.turnStockValue = resp?.data?.turnStockValue;
                this.editData.turnStockPrice = resp?.data?.turnStockPrice;
                this.editData.startTurnStockDate = resp?.data?.startTurnStockDate;
                this.editData.stockRegisterDate = resp?.data?.stockRegisterDate;
                this.editData.applyLimit = resp?.data?.applyLimit;
                this.editData.applyDate = resp?.data?.applyDate;
                this.editData.allotmentNumberDate = resp?.data?.allotmentNumberDate;
                this.editData.winResultDate = resp?.data?.winResultDate;
                this.editData.listDate = resp?.data?.listDate;
                this.editData.paymentBySign = resp?.data?.paymentBySign;
                this.editData.companyIntroduce = resp?.data?.companyIntroduce;
            } else {
                this.$showToast(resp?.message || '网络异常');
            }
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {});
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请完善信息'
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data = {
                newDebtId: this.id,
                newDebtName: this.editData.newDebtName,
                applyCode: this.editData.applyCode,
                stockType: this.editData.stockType,
                issuePrice: this.editData.issuePrice,
                premiumRate: this.editData.premiumRate,
                applyLimit: this.editData.applyLimit,
                applyDate: dayjs(this.editData.applyDate).format('YYYY-MM-DD'),
                allotmentNumberDate: dayjs(this.editData.allotmentNumberDate).format('YYYY-MM-DD'),
                winResultDate: dayjs(this.editData.winResultDate).format('YYYY-MM-DD'),
                listDate: dayjs(this.editData.listDate).format('YYYY-MM-DD'),
                paymentBySign: this.editData.paymentBySign,
                regularStockName: this.editData.regularStockName,
                regularStockCode: this.editData.regularStockCode,
                regularStockPrice: this.editData.regularStockPrice,
                turnStockValue: this.editData.turnStockValue,
                startTurnStockDate: dayjs(this.editData.startTurnStockDate).format('YYYY-MM-DD'),
                stockRegisterDate: dayjs(this.editData.stockRegisterDate).format('YYYY-MM-DD'),
                companyIntroduce: this.editData.companyIntroduce,
                turnStockPrice: this.editData.turnStockPrice
            };
            const [err, resp] = await this.$postAsync('/newDebt/addOrUpdateNewDebtInfo', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }

        clickCancel() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {});
        }
    }
</script>

<style lang="scss">
    .hbb-form{
        table{
            display: table-cell;
            width: 800px;
            border: 1px solid #ddd;
            margin-top: 30px;
            tr{
                display: flex;
                align-items: center;
                width: 100%;
                background: #cccccc;
                border-bottom: 1px solid #eee;
                td{
                    display: flex;
                    background: #fff;
                    width: calc(50% - 130px) !important;

                    align-items: center;
                    .el-form-item{
                        width: 100%;
                        margin-bottom: 0;
                        .el-form-item__content{
                            line-height: 0;
                        }
                        .el-input{
                            width: 100% !important;
                            input, textarea{
                                border-radius: 0;
                                border: none;
                            }
                            .el-textarea .el-textarea__inner{
                                border-color:#fff ;
                            }
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
