<!-- 添加公告 -->
<template>
    <div>
        <div class="page-cap-title">
            添加新股
        </div>

        <div class="form-input-area hbb-form">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <table>
                    <tr>
                        <td class="l">
                            新股名称：
                        </td>
                        <td>
                            <el-form-item prop="newStockName">
                                <el-input
                                    v-model.trim="editData.newStockName"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入新股名称"
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
                            股票类型：
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
                            发行总量：
                        </td>
                        <td>
                            <el-form-item prop="issueNum">
                                <el-input
                                    v-model.trim="editData.issueNum"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入发行总量"
                                    maxlength="50"
                                    style="width:400px"
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
                            市盈率/%：
                        </td>
                        <td>
                            <el-form-item prop="pERatio">
                                <el-input
                                    v-model.trim="editData.pERatio"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入市盈率"
                                    maxlength="50"
                                    style="width:400px"
                                />
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td class="l">
                            网上发行总量：
                        </td>
                        <td>
                            <el-form-item prop="netIssueNum">
                                <el-input
                                    v-model.trim="editData.netIssueNum"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入网上发行总量"
                                    maxlength="50"
                                    style="width:400px"
                                />
                            </el-form-item>
                        </td>
                        <td class="l">
                            网上申购上限：
                        </td>
                        <td>
                            <el-form-item prop="netApplyLimit">
                                <el-input
                                    v-model.trim="editData.netApplyLimit"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入网上申购上限"
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
                            一签缴款：
                        </td>
                        <td>
                            <el-form-item prop="paymentBySign">
                                <el-input
                                    v-model.trim="editData.paymentBySign"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="请输入缴款"
                                    maxlength="50"
                                />
                            </el-form-item>
                        </td>
                        <td class="l" />
                        <td>
                            <el-form-item prop="title">
                                <el-input
                                    v-model.trim="editData.title"
                                    type="text"
                                    autocomplete="off"
                                    disabled
                                    placeholder=""
                                    maxlength="50"
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
             newStockName: '', // 新股名称
             applyCode: '', // 申购代码
             stockType: '', // 股票类型
             issueNum: '', // 发行总量
             issuePrice: '', // 发行价格
             pERatio: '', // 市盈率
             netIssueNum: '', // 网上发行总量
             netApplyLimit: '', // 网上申购上限
             applyDate: '', // 申购日期
             allotmentNumberDate: '', // 配号日期
             winResultDate: '', // 中签结果日期
             listDate: '', // 上市日期
             paymentBySign: '', // 一签缴款
             companyIntroduce: '' // 公司介绍
        };

         dataRule: any = {
             newStockName: [{required: true, message: '请输入新股名称', trigger: 'blur'}],
             applyCode: [{required: true, message: '请输入申购代码', trigger: 'blur'}],
             stockType: [{required: true, message: '请选择股票类型', trigger: 'change'}],
             issueNum: [{required: true, message: '请输入发行总量', trigger: 'blur'}],
             issuePrice: [{required: true, message: '请输入发行价格', trigger: 'blur'}],
             pERatio: [{required: true, message: '请输入市盈率', trigger: 'blur'}],
             netIssueNum: [{required: true, message: '请输入网上发行总量', trigger: 'blur'}],
             netApplyLimit: [{required: true, message: '请输入网上申购上限', trigger: 'blur'}],
             applyDate: [{required: true, message: '请选择日期', trigger: 'change'}],
             allotmentNumberDate: [{required: true, message: '请选择日期', trigger: 'change'}],
             winResultDate: [{required: true, message: '请选择日期', trigger: 'change'}]
        };

         publishTimeOpt1: any = {};
         publishTimeOpt2: any = {};
        dictionaryList: any[] = [];

        mounted() {
            this.queryDictionaryList();
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
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
                newStockName: this.editData.newStockName, // 新股名称
                applyCode: this.editData.applyCode, // 申购代码
                stockType: this.editData.stockType, // 股票类型
                issueNum: this.editData.issueNum, // 发行总量
                issuePrice: this.editData.issuePrice, // 发行价格
                pERatio: this.editData.pERatio, // 市盈率
                netIssueNum: this.editData.netIssueNum, // 网上发行总量
                netApplyLimit: this.editData.netApplyLimit, // 网上申购上限
                applyDate: dayjs(this.editData.applyDate).format('YYYY-MM-DD'), // 申购日期
                allotmentNumberDate: dayjs(this.editData.allotmentNumberDate).format('YYYY-MM-DD'), // 配号日期
                winResultDate: dayjs(this.editData.winResultDate).format('YYYY-MM-DD'), // 中签结果日期
                listDate: dayjs(this.editData.listDate).format('YYYY-MM-DD'), // 上市日期
                paymentBySign: this.editData.paymentBySign, // 一签缴款
                companyIntroduce: this.editData.companyIntroduce // 公司介绍
            };
            const [err, resp] = await this.$postAsync('/newStock/addOrUpdateNewStockInfo', data, {
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
