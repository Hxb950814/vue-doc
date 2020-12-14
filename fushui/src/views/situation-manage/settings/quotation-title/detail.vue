<!-- 添加行情抬头-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加行情抬头
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule" :disabled="!canEdit">
                <el-form-item label="抬头名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        placeholder="请输入抬头名称"
                        clearable
                        maxlength="4"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="展示位置：" prop="name" label-width="120px">
                    <el-select
                        v-model.trim="editData.location"
                        style="width: 160px"
                        clearable
                        placeholder="全部"
                    >
                        <el-option value="" label="全部" />
                        <el-option value="1" label="抬1" />
                        <el-option value="2" label="抬2" />
                        <el-option value="3" label="抬3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="抬头代码：" prop="code" label-width="120px">
                    <el-input
                        v-model.trim="editData.code"
                        type="text"
                        placeholder="请输入代码"
                        clearable
                        maxlength="20"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="显示顺序：" prop="order" label-width="120px">
                    <el-input
                        v-model.trim="editData.order"
                        type="text"
                        placeholder="请输入显示顺序(1-99)"
                        clearable
                        maxlength="3"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="是否展示：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            是
                        </el-radio>
                        <el-radio label="0">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button type="primary" @click="clickSave">
                    {{ canEdit ? '保存' : '编辑' }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Mixins} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import {getValidateInteger, getValidateSpecialNumber} from '@/utils/validate';
    import leaveCheck from '@/mixins/leaveCheck';

    @Component({
        components: {},
        mixins: []
    })
    export default class extends Mixins(leaveCheck) {
        id = '';
        canEdit = false;
        editData: any = {
            name: '', // 展示名称
            location: '', // 显示位置
            code: '', // code
            status: '', // 状态 1=显示  0=不显示
            order: ''
        };

        dataRule: any = {
            name: [{required: true, message: '请输入展示名称', trigger: 'blur'}],
            location: [{required: true, message: '请选择显示位置', trigger: 'change'}],
            order: [
                {required: true, message: '请输入顺序(1-99数字)', trigger: 'blur'},
                {required: true, validator: getValidateInteger(), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '>=', number: 1}), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '<=', number: 99}), trigger: 'blur'}
            ],
            code: [{required: true, message: '请输入抬头代码', trigger: 'blur'}]
        };

        async mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.getData();
        }

        async getData() {
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/quotation/getQuotationTitleDetail', {
                quotationTitleId: this.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const {data} = resp;
                if (!data) {
                    return;
                }
                this.editData.name = data.titleName;
                this.editData.location = String(data.titleLocation || '');
                this.editData.status = String(data.status);
                this.editData.order = data.sortby;
                this.editData.code = data.titleCode;
            }
            // 保存未更改的快照, 用于对比数据是否发生更改
        }

        clickSave() {
            if (!this.canEdit) {
                this.canEdit = true;
                return;
            };
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
                quotationTitleId: this.id,
                titleName: encodeURI(this.editData.name),
                titleLocation: this.editData.location,
                sortby: this.editData.order,
                status: this.editData.status,
                titleCode: this.editData.code
            };
            const [err, resp] = await this.$postAsync('/quotation/updateOrAddQuotationTitle', data);
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '保存失败');
            }
        }
    }
</script>
