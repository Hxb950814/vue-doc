<!--K豆比例设置-->
<template>
    <div>
        <div class="page-cap-title">
            K豆比例设置
        </div>
        <div class="nav-common-search" style="margin-bottom: 10px">
            <div class="ratio-text">
                K豆和现金比例:
            </div>

            <div class="dis-flex">
                <el-form
                    ref="dataForm"
                    class="form-data form-style"
                    :model="editData"
                    :rules="dataRule"
                    :disabled="!editData.enable"
                >
                    <div class="dis-flex">
                        <el-form-item label="" prop="money">
                            <el-input
                                v-model.trim="editData.money"
                                type="text"
                                autocomplete="off"
                                placeholder="请输入产品名称"
                                maxlength="10"
                                style="width:150px"
                            />
                        </el-form-item>
                        <span class="show-text">现金</span>
                        <i class="el-icon-sort rotate" />
                        <span class="show-text">K豆</span>
                        <el-form-item label="" prop="kcoin">
                            <el-input
                                v-model.trim="editData.kcoin"
                                type="text"
                                autocomplete="off"
                                placeholder="请输入K豆"
                                maxlength="10"
                                style="width:150px"
                            />
                        </el-form-item>
                    </div>
                </el-form>
                <div v-permission="'04040101'">
                    <el-button v-if="!editData.enable" type="primary" class="enable-btn" @click="clickEnable">
                        修改
                    </el-button>
                    <el-button v-if="editData.enable" type="primary" class="enable-btn" @click="clickSave">
                        保存
                    </el-button>
                    <el-button v-if="editData.enable" class="enable-btn" @click="clickCancel">
                        取消
                    </el-button>
                </div>
            </div>
        </div>

        <div class="common-table" style="width: 100%;">
            <el-table :data="tableData.data">
                <el-table-column prop="idx" label="序号" width="60" />
                <el-table-column prop="time" width="300" label="修改时间" />
                <el-table-column prop="opPerson" label="修改人" />
                <el-table-column prop="ratio" label="修改后比例">
                    <template slot-scope="scope">
                        {{ scope.row.money }} : {{ scope.row.kcoin }}
                    </template>
                </el-table-column>
            </el-table>
            <my-pagination
                :page-size="tableData.pageSize"
                :total="tableData.count"
                :current-page.sync="tableData.currentPage"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import * as validator from '@/utils/validate';

    @Component({
        components: {}
    })
    export default class extends Mixins(commonTable) {
        editData: any = {
            enable: false,
            money: '', // 现金
            kcoin: '' // k豆
        };

        dataRule: any = {
            money: [
                {required: true, message: '请输入现金', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({
                        number: 1,
                        compareType: '>='
                    }),
                    trigger: 'blur'
                }
            ],
            kcoin: [
                {required: true, message: '请输入K豆', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({
                        number: 1,
                        compareType: '>='
                    }),
                    trigger: 'blur'
                }
            ]
        };

        mounted() {
            this.getRatio();
            this.getDataList();
        }

        searchData() {
            this.tableData.currentPage = 1;
            this.getDataList();
        }

        async getRatio() {
            const [err, resp] = await this.$postAsync('/kbeansRatioSet/getKbeansRatioSet');
            if (resp?.code === '000000') {
                this.editData.money = resp?.data?.moneys || '';
                this.editData.kcoin = resp?.data?.kbeans || '';
            }
        }

        async getDataList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/kbeansRatioSet/getKbeansRatioSetList', {
                page: this.tableData.currentPage
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data?.result || []).forEach((item: any, idx: number) => {
                    list.push({
                        idx: idx + 1,
                        id: String(item.kbeansRatioSetId),
                        time: item.createTime, // 时间
                        opPerson: item.adminUserName, // 修改人
                        ratio: item.publishTime, // 比例
                        money: item.moneys, // money
                        kcoin: item.kbeans // kcoin
                    });
                });
                this.tableData.data = list;
                this.tableData.count = resp.data.totalCount;
            } else {
                this.tableData.data = [];
                this.tableData.count = 0;
            }
        }

        handleCurrentChange() {
            this.getDataList();
        }

        clickEnable() {
            this.editData.enable = true;
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.doSave();
                }
            });
        }

        clickCancel() {
            this.editData.enable = false;
            this.editData.money = '';
            this.editData.kcoin = '';
            (this.$refs.dataForm as ElForm).resetFields();
        }

        async doSave() {
            this.$showLoading();
            const data = {
                kbeans: this.editData.kcoin,
                moneys: this.editData.money
            };
            const [err, resp] = await this.$postAsync('/kbeansRatioSet/saveKbeansRatioSet', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                this.editData.enable = false;
                this.tableData.currentPage = 1;
                this.getDataList();
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ratio-text {
        padding-bottom: 20px;
        font-weight: bold;
    }

    .enable-btn {
        align-self: center;
        margin-left: 10px
    }

    .show-text {
        width: 50px;
        line-height: 38px;
        padding: 0 10px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    /deep/ .rotate {
        line-height: 15px;
        width: 15px;
        height: 15px;
        margin-top: 10px;
        transform-origin: center;
        transform: rotate(90deg);
        color: $theme-font-color;
        font-size: 18px;
    }
</style>
