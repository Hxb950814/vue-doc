<!-- 查看期货公司-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看期货公司
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="期货公司：" prop="company" label-width="120px">
                    <el-input
                        v-model.trim="editData.company"
                        type="text"
                        placeholder="请输入公司名称"
                        clearable
                        maxlength="15"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="接口方式：" prop="interfaceType" label-width="120px">
                    <el-select
                        v-model.trim="editData.interfaceType"
                        type="text"
                        autocomplete="off"
                        clearable
                        placeholder="请选择接口方式"
                        style="width:300px"
                    >
                        <el-option v-for="(item,idx) in interfaceTypeList" :key="idx" :value="item.value" :label="item.label" />
                    </el-select>
                </el-form-item>
                <el-form-item label="银期转账：" prop="bankTransfer" label-width="120px">
                    <el-radio-group v-model="editData.bankTransfer">
                        <el-radio label="1">
                            支持
                        </el-radio>
                        <el-radio label="0">
                            不支持
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button @click="clickClose">
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

    let editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            company: '', // 期货公司
            interfaceType: '', // 接口方式
            status: '1', // 状态
            bankTransfer: '1' // 银期转账
        };

        dataRule: any = {
            company: [{required: true, message: '请输入期货公司', trigger: 'blur'}],
            interfaceType: [
                {required: true, message: '请选择接口方式', trigger: 'change'}
            ]
        };

        interfaceTypeList: any[] = [];

        async mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            this.id = this.$route.query.id + '';
            if (!this.id || this.id === 'undefined') {
                this.$message.error('id不能为空');
                return;
            }
            this.getInterfaceTypeList();
            this.getData();
        }

        async getInterfaceTypeList() {
            const [err, resp] = await this.$postAsync('/futureCompany/queryDictionaryByCode', {
                code: 'api_type'
            });
            if (resp?.code === '000000') {
                this.interfaceTypeList = resp.data.map((item: any) => {
                    return {
                        value: String(item.value),
                        label: item.name
                    };
                });
            } else {
                this.interfaceTypeList = [];
            }
        }

        async getData() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/futureCompany/queryFutureCompanyInfo', {
                futureCompanyId: this.id
            }, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.company = resp.data.futureCompanyName;
                this.editData.interfaceType = resp.data.apiType + '';
                this.editData.status = resp.data.status + '';
                this.editData.bankTransfer = resp.data.bankTransfer + '';
            } else {
                this.$showToast(resp?.message || '获取数据错误');
            }

            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            });
        }

        clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {
            });
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data = {
                futureCompanyId: this.id,
                apiType: this.editData.interfaceType,
                futureCompanyName: this.editData.company,
                status: this.editData.status,
                bankTransfer: this.editData.bankTransfer
            };
            const [err, resp] = await this.$postAsync('/futureCompany/addOrUpdateFutureCompany', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
        }
    }
</script>
