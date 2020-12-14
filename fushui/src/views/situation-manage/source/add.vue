<!-- 添加行情来源-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加行情来源
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="展示名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        placeholder="请输入行情展示名称"
                        clearable
                        maxlength="15"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="交易所全称：" prop="exchangeName" label-width="120px">
                    <el-input
                        v-model.trim="editData.exchangeName"
                        type="text"
                        placeholder="请输入交易所全称"
                        clearable
                        maxlength="15"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="种类数量：" prop="" label-width="120px">
                    {{ editData.contractNumber }}
                </el-form-item>
                <el-form-item label="合约数量：" prop="" label-width="120px">
                    {{ editData.speciesNumber }}
                </el-form-item>
                <el-form-item label="显示顺序：" prop="order" label-width="120px">
                    <el-input
                        v-model.trim="editData.order"
                        type="text"
                        placeholder="请输入显示顺序"
                        clearable
                        maxlength="15"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            已上架
                        </el-radio>
                        <el-radio label="0">
                            已下架
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
    import {getValidateInteger, getValidateSpecialNumber} from '@/utils/validate';

    let editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        editData: any = {
            name: '', // 展示名称
            exchangeName: '', // 交易所全称
            status: '0', // 状态
            order: '',
            contractNumber: '--', // 合约数量
            speciesNumber: '--' // 种类数量
        };

        dataRule: any = {
            name: [{required: true, message: '请输入展示名称', trigger: 'blur'}],
            exchangeName: [{required: true, message: '请输入交易所全程', trigger: 'blur'}],
            order: [
                {required: true, message: '请输入顺序(1-99数字)', trigger: 'blur'},
                {required: true, validator: getValidateInteger(), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '>=', number: 1}), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '<=', number: 99}), trigger: 'blur'}
            ]
        };

        async mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
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
                sourceName: this.editData.name,
                fullName: this.editData.exchangeName,
                sortby: this.editData.order,
                status: this.editData.status
            };
            const [err, resp] = await this.$postAsync('/quotation/updateOrAddQuotationSource', data, {
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
    }
</script>
