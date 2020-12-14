<!-- 添加行情抬头-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加行情抬头
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
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
                    保存
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
    export default class extends Vue {
        editData: any = {
            name: '', // 展示名称
            location: '', // 显示位置
            status: '0', // 状态 1=显示  0=不显示
            code: '', // code
            order: ''
        };

        dataRule: any = {
            name: [{required: true, message: '请输入展示名称', trigger: 'blur'}],
            location: [{required: true, message: '请选择显示位置', trigger: 'change'}],
            code: [{required: true, message: '请输入抬头代码', trigger: 'blur'}],
            order: [
                {required: true, message: '请输入顺序(1-99数字)', trigger: 'blur'},
                {required: true, validator: getValidateInteger(), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '>=', number: 1}), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '<=', number: 99}), trigger: 'blur'}
            ]
        };

        async mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            // this.setDataKeep(this.editData);
        }

        clickClose() {
            // this.checkSaveDataBack(this.editData); // 检查合格再推出
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
                titleName: this.editData.name,
                titleLocation: this.editData.location,
                sortby: this.editData.order,
                status: this.editData.status,
                titleCode: this.editData.code
            };
            const [err, resp] = await this.$postAsync('/quotation/updateOrAddQuotationTitle', data);
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
